import QRCode from "qrcode";
import type { OfflineBillDetail, PaymentMode } from "@/lib/api/offlineBills";
import { formatInr, formatIsoDateTimeEnIn, splitIsoDateTime } from "@/lib/display/formatting";
import { escapeHtml } from "@/lib/display/html";
import { formatPhoneForDisplay } from "@/lib/display/phone";
import {
  loadPrinterSettings,
  LABEL_SIZE_MM,
  PAGE_SIZE_MM,
  type LabelSize,
  type ReceiptPageSize,
  type ThermalPrinterSettings,
} from "@/lib/billing/printerSettings";

const paymentLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  credit_card: "Credit Card",
  debit_card: "Debit Card",
  cheque: "Cheque",
  other: "Other",
};

/** Store fields printed on the receipt header. */
export interface ReceiptStoreProfile {
  name: string;
  address?: string | null;
  phone?: string | null;
  state?: string | null;
  pincode?: string | null;
  gstin?: string | null;
  udyam_number?: string | null;
  fssai_license?: string | null;
  email?: string | null;
}

export interface PrintReceiptOptions {
  store?: ReceiptStoreProfile | null;
  /** @deprecated pass `store` instead — kept for older call sites that only had the name. */
  storeName?: string | null;
  /** The store's UPI ID to render as a payment QR on the receipt. Omit to skip the QR block entirely. */
  upiId?: string | null;
  /** Override the saved thermal page size for this print/download only (full_invoice mode). */
  pageSize?: ReceiptPageSize;
  /** Override the saved thermal label size for this print/download only (label mode). */
  labelSize?: LabelSize;
}

async function buildUpiQrDataUrl(
  store: ReceiptStoreProfile | null | undefined,
  upiId: string | null | undefined,
  amount: number,
): Promise<string | null> {
  const trimmedUpiId = upiId?.trim();
  if (!trimmedUpiId || amount <= 0) return null;

  const params = new URLSearchParams({
    pa: trimmedUpiId,
    pn: store?.name?.trim() || "Store",
    am: amount.toFixed(2),
    cu: "INR",
  });

  try {
    return await QRCode.toDataURL(`upi://pay?${params.toString()}`, {
      margin: 1,
      width: 180,
    });
  } catch {
    return null;
  }
}

// Official GST state codes — printed as "State: <code>-<name>" on the tax invoice.
const GST_STATE_CODES: Record<string, string> = {
  "jammu and kashmir": "01",
  "himachal pradesh": "02",
  punjab: "03",
  chandigarh: "04",
  uttarakhand: "05",
  haryana: "06",
  delhi: "07",
  rajasthan: "08",
  "uttar pradesh": "09",
  bihar: "10",
  sikkim: "11",
  "arunachal pradesh": "12",
  nagaland: "13",
  manipur: "14",
  mizoram: "15",
  tripura: "16",
  meghalaya: "17",
  assam: "18",
  "west bengal": "19",
  jharkhand: "20",
  odisha: "21",
  chhattisgarh: "22",
  "madhya pradesh": "23",
  gujarat: "24",
  "dadra and nagar haveli and daman and diu": "26",
  maharashtra: "27",
  karnataka: "29",
  goa: "30",
  lakshadweep: "31",
  kerala: "32",
  "tamil nadu": "33",
  puducherry: "34",
  "andaman and nicobar islands": "35",
  telangana: "36",
  "andhra pradesh": "37",
  ladakh: "38",
};

function gstStateCode(state: string): string | null {
  return GST_STATE_CODES[state.trim().toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ")] ?? null;
}

function storeIdentityLines(store: ReceiptStoreProfile | null | undefined): string[] {
  if (!store) return [];
  const lines: string[] = [];
  if (store.address) {
    const locality = [store.address, store.pincode, store.state].filter(Boolean).join(" ");
    lines.push(locality);
  }
  if (store.state) {
    const code = gstStateCode(store.state);
    lines.push(`State: ${code ? `${code}-` : ""}${store.state}`);
  }
  if (store.phone) lines.push(`Ph.No.: ${formatPhoneForDisplay(store.phone)}`);
  if (store.email) lines.push(`Email: ${store.email}`);
  if (store.gstin) lines.push(`GSTIN: ${store.gstin}`);
  if (store.udyam_number) lines.push(`UDYAM: ${store.udyam_number}`);
  if (store.fssai_license) lines.push(`FSSAI(State License): ${store.fssai_license}`);
  return lines;
}

/** The "khata" balance block — only rendered when the bill has a customer ledger snapshot. */
function hasLedgerSnapshot(bill: OfflineBillDetail): boolean {
  return bill.previous_balance !== null && bill.current_balance !== null;
}

/** Amount collected. Bills from before this column existed have it as null in the DB — treat as paid in full. */
function receivedAmount(bill: OfflineBillDetail): number {
  return bill.received_amount ?? bill.total_amount;
}

/** Unpaid shortfall on this bill, floored at 0 to absorb floating-point dust. */
function dueAmount(bill: OfflineBillDetail): number {
  return Math.max(0, bill.total_amount - receivedAmount(bill));
}

/** Plain "2268.00" style amount — no currency symbol or thousands separator, matching a raw thermal-printer invoice. */
function formatPlainAmount(value: number): string {
  return value.toFixed(2);
}

// ---------------------------------------------------------------------------
// Regular (A4 / office) printer receipt — unchanged visual style, extended
// with the store's tax-invoice header details and the credit-balance block.
// ---------------------------------------------------------------------------

function buildRegularReceiptHtml(
  bill: OfflineBillDetail,
  store: ReceiptStoreProfile | null | undefined,
  qrDataUrl: string | null,
): string {
  const title = escapeHtml(store?.name?.trim() || "Tax invoice");
  const customerName = bill.customer_name?.trim();
  const phoneDisplay = bill.customer_phone
    ? formatPhoneForDisplay(bill.customer_phone)
    : "";
  const identityLines = storeIdentityLines(store);

  const itemRows = bill.bill_items
    .map(
      (item) => `
    <tr class="item-row">
      <td class="item-name">${escapeHtml(item.item_name)}</td>
      <td class="item-qty">${item.quantity} ${escapeHtml(item.unit)}</td>
      <td class="item-amt">${formatInr(item.total)}</td>
    </tr>`,
    )
    .join("");

  const customerBlock =
    customerName || phoneDisplay
      ? `
  <div class="customer-block">
    ${customerName ? `<div class="customer-line"><span class="lbl">Customer</span><span class="val">${escapeHtml(customerName)}</span></div>` : ""}
    ${phoneDisplay ? `<div class="customer-line"><span class="lbl">Phone</span><span class="val">${escapeHtml(phoneDisplay)}</span></div>` : ""}
  </div>`
      : "";

  const balanceBlock = hasLedgerSnapshot(bill)
    ? `
        <div class="pay-row">
          <span class="pk">Previous Bal.</span>
          <span class="pv">${formatInr(bill.previous_balance!)}</span>
        </div>
        <div class="pay-row">
          <span class="pk">Current Bal.</span>
          <span class="pv">${formatInr(bill.current_balance!)}</span>
        </div>`
    : "";

  const qrBlock = qrDataUrl
    ? `
      <div class="qr-block">
        <img src="${qrDataUrl}" alt="UPI QR code" width="140" height="140" />
        <p>Scan this QR code to pay</p>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bill #${bill.id}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 20px 12px;
      color: #0f172a;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 11px;
      line-height: 1.45;
      background: #e8e4df;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .receipt {
      max-width: 78mm;
      margin: 0 auto;
      background: #fdfcfa;
      border: 1px solid #1e293b;
      border-radius: 2px;
      box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
      overflow: hidden;
    }
    .receipt-inner {
      padding: 18px 14px 20px;
    }
    .brand-bar {
      height: 4px;
      background: linear-gradient(90deg, #0f172a 0%, #334155 50%, #0f172a 100%);
    }
    .store-title {
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin: 0 0 4px;
      color: #0f172a;
    }
    .store-identity {
      text-align: center;
      margin: 0 0 12px;
    }
    .store-identity p {
      margin: 0 0 2px;
      font-size: 9px;
      color: #475569;
    }
    .doc-type {
      text-align: center;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #64748b;
      margin: 0 0 14px;
    }
    .meta-grid {
      display: grid;
      gap: 6px;
      padding-bottom: 12px;
      border-bottom: 1px dashed #cbd5e1;
      margin-bottom: 12px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .meta-row .k {
      color: #64748b;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      flex-shrink: 0;
    }
    .meta-row .v {
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      text-align: right;
      word-break: break-word;
    }
    .customer-block {
      padding: 10px 0 12px;
      margin-bottom: 12px;
      border-bottom: 1px dashed #cbd5e1;
    }
    .customer-line {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 4px;
      font-size: 10px;
    }
    .customer-line:last-child { margin-bottom: 0; }
    .customer-line .lbl { color: #64748b; font-weight: 600; }
    .customer-line .val { font-weight: 600; text-align: right; }
    .section-title {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #475569;
      margin: 0 0 8px;
    }
    table.items {
      width: 100%;
      border-collapse: collapse;
      font-variant-numeric: tabular-nums;
    }
    table.items thead th {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748b;
      padding: 6px 0 8px;
      border-bottom: 2px solid #0f172a;
      text-align: left;
    }
    table.items thead th:nth-child(2),
    table.items thead th:nth-child(3) { text-align: right; }
    table.items tbody td {
      padding: 8px 0 7px;
      vertical-align: top;
      border-bottom: 1px solid #e2e8f0;
    }
    table.items tbody tr:last-child td { border-bottom: none; }
    .item-name { font-weight: 600; color: #0f172a; padding-right: 6px; }
    .item-qty {
      text-align: right;
      white-space: nowrap;
      color: #475569;
      font-size: 10px;
      width: 22%;
    }
    .item-amt {
      text-align: right;
      font-weight: 600;
      width: 28%;
    }
    .summary {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px dashed #cbd5e1;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;
      font-size: 10px;
    }
    .summary-row .sk {
      color: #475569;
    }
    .summary-row .sv {
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
    .summary-row.discount .sv {
      color: #15803d;
      font-weight: 700;
    }
    .summary-row.total {
      margin-top: 8px;
      padding: 12px 10px;
      background: #0f172a;
      color: #fff;
      border-radius: 4px;
      font-size: 12px;
    }
    .summary-row.total .sk {
      color: #cbd5e1;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 10px;
    }
    .summary-row.total .sv {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .pay-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      padding: 8px 10px;
      background: #f1f5f9;
      border-radius: 4px;
      font-size: 10px;
    }
    .pay-row .pk {
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .pay-row .pv {
      font-weight: 700;
      color: #0f172a;
    }
    .qr-block {
      margin-top: 16px;
      text-align: center;
    }
    .qr-block img {
      display: block;
      margin: 0 auto 6px;
    }
    .qr-block p {
      margin: 0;
      font-size: 9px;
      color: #64748b;
    }
    .footer {
      margin-top: 18px;
      padding-top: 14px;
      border-top: 1px dashed #cbd5e1;
      text-align: center;
    }
    .footer p {
      margin: 0;
      font-size: 10px;
      color: #64748b;
      line-height: 1.5;
    }
    .footer .thanks {
      font-weight: 700;
      color: #0f172a;
      letter-spacing: 0.02em;
      margin-bottom: 4px;
    }
    @media print {
      body {
        padding: 0;
        background: #fff;
      }
      .receipt {
        max-width: none;
        width: 100%;
        border: none;
        box-shadow: none;
        border-radius: 0;
      }
      .brand-bar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .summary-row.total { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page {
        margin: 8mm;
        size: auto;
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="brand-bar" aria-hidden="true"></div>
    <div class="receipt-inner">
      <h1 class="store-title">${title}</h1>
      ${identityLines.length ? `<div class="store-identity">${identityLines.map((l) => `<p>${escapeHtml(l)}</p>`).join("")}</div>` : ""}
      <p class="doc-type">Tax invoice</p>

      <div class="meta-grid">
        <div class="meta-row">
          <span class="k">Bill no.</span>
          <span class="v">#${bill.id}</span>
        </div>
        <div class="meta-row">
          <span class="k">Date &amp; time</span>
          <span class="v">${escapeHtml(formatIsoDateTimeEnIn(bill.created_at))}</span>
        </div>
      </div>

      ${customerBlock}

      <p class="section-title">Items</p>
      <table class="items" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div class="summary">
        <div class="summary-row">
          <span class="sk">Subtotal (ex-GST)</span>
          <span class="sv">${formatInr(bill.subtotal)}</span>
        </div>
        <div class="summary-row discount">
          <span class="sk">Discount</span>
          <span class="sv">−${formatInr(bill.discount)}</span>
        </div>
        <div class="summary-row">
          <span class="sk">Tax (GST)</span>
          <span class="sv">${formatInr(bill.tax)}</span>
        </div>
        <div class="summary-row total">
          <span class="sk">Amount payable</span>
          <span class="sv">${formatInr(bill.total_amount)}</span>
        </div>
        <div class="pay-row">
          <span class="pk">Payment</span>
          <span class="pv">${escapeHtml(paymentLabels[bill.payment_mode])}</span>
        </div>
        <div class="pay-row">
          <span class="pk">Received</span>
          <span class="pv">${formatInr(receivedAmount(bill))}</span>
        </div>
        ${
          receivedAmount(bill) < bill.total_amount
            ? `<div class="pay-row"><span class="pk">Balance (this bill)</span><span class="pv">${formatInr(dueAmount(bill))}</span></div>`
            : ""
        }
        ${balanceBlock}
      </div>

      ${qrBlock}

      <div class="footer">
        <p class="thanks">Thank you</p>
        <p>We appreciate your business.<br />This is a computer-generated document.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Thermal printer receipt — narrow, theme-able, driven by the printer settings
// saved on this device (page size, text size, printing type, bold, etc.).
// ---------------------------------------------------------------------------

const TEXT_SIZE_PX: Record<ThermalPrinterSettings["textSize"], number> = {
  small: 10,
  medium: 12,
  large: 14,
};

function buildThermalReceiptHtml(
  bill: OfflineBillDetail,
  store: ReceiptStoreProfile | null | undefined,
  settings: ThermalPrinterSettings,
  qrDataUrl: string | null,
): string {
  const isLabelPrinting = settings.printingType === "label";
  const labelDimensions =
    settings.labelSize === "custom"
      ? { width: settings.customLabelWidthMm, height: settings.customLabelHeightMm }
      : LABEL_SIZE_MM[settings.labelSize];

  const widthMm = isLabelPrinting
    ? labelDimensions.width
    : settings.pageSize === "custom"
      ? 80
      : PAGE_SIZE_MM[settings.pageSize];
  const heightMm = isLabelPrinting ? labelDimensions.height : null;
  const baseFontPx = TEXT_SIZE_PX[settings.textSize];
  const title = escapeHtml(store?.name?.trim() || "Tax invoice");
  const identityLines = storeIdentityLines(store);
  const customerName = bill.customer_name?.trim();
  const phoneDisplay = bill.customer_phone ? formatPhoneForDisplay(bill.customer_phone) : "";
  const { date, time } = splitIsoDateTime(bill.created_at);

  const totalQty = bill.bill_items.reduce((sum, item) => sum + Number(item.quantity), 0);

  const isLabel = settings.printingType === "label";

  const itemRows = bill.bill_items
    .map((item, index) =>
      isLabel
        ? `
    <tr>
      <td class="c">${index + 1}</td>
      <td class="l">${escapeHtml(item.item_name)}</td>
      <td class="r">${formatPlainAmount(item.total)}</td>
    </tr>`
        : `
    <tr>
      <td class="c">${index + 1}</td>
      <td class="l">${escapeHtml(item.item_name)}</td>
      <td class="r">${item.quantity}</td>
      <td class="r">${formatPlainAmount(item.price)}</td>
      <td class="r">${formatPlainAmount(item.total)}</td>
    </tr>`,
    )
    .join("");

  const itemsTotalRow = `
    <tr class="totals-row">
      <td class="c"></td>
      <td class="l">Total</td>
      ${isLabel ? "" : `<td class="r">${totalQty}</td><td class="r"></td>`}
      <td class="r">${formatPlainAmount(bill.subtotal + bill.tax - bill.discount)}</td>
    </tr>`;

  const balanceRows = hasLedgerSnapshot(bill)
    ? `
      <div class="row"><span>Previous Bal. :</span><span>${formatPlainAmount(bill.previous_balance!)}</span></div>
      <div class="row"><span>Current Bal. :</span><span>${formatPlainAmount(bill.current_balance!)}</span></div>`
    : "";

  const extraLines = Array.from({ length: Math.max(0, settings.extraLinesAtEnd) })
    .map(() => `<div class="feed-line">&nbsp;</div>`)
    .join("");

  const copies = Math.max(1, settings.numberOfCopies);

  const receiptBody = `
    <div class="receipt theme-${settings.theme}${settings.boldText ? " bold" : ""}">
      <p class="store-title">${title}</p>
      ${identityLines.length ? identityLines.map((l) => `<p class="identity">${escapeHtml(l)}</p>`).join("") : ""}
      <p class="doc-type">${isLabel ? "Label" : "Tax Invoice"}</p>
      <div class="hr"></div>
      ${customerName ? `<p class="meta">${escapeHtml(customerName)}</p>` : ""}
      <div class="row meta-row">
        <span>${phoneDisplay ? `Ph.No.: ${escapeHtml(phoneDisplay)}` : ""}</span>
        <span>Date: ${date}</span>
      </div>
      <div class="row meta-row">
        <span></span>
        <span>Time: ${time}</span>
      </div>
      <div class="row meta-row">
        <span></span>
        <span>Invoice No.: ${bill.id}</span>
      </div>
      <div class="hr"></div>
      <table class="items">
        <thead>
          <tr>
            <td class="c">#</td>
            <td class="l">Name</td>
            ${isLabel ? "" : `<td class="r">Qty</td><td class="r">Price</td>`}
            <td class="r">Amount</td>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>${itemsTotalRow}</tfoot>
      </table>
      <div class="hr"></div>
      <div class="summary-block">
        <div class="row"><span>Total :</span><span>${formatPlainAmount(bill.total_amount)}</span></div>
        <div class="row"><span>Received :</span><span>${formatPlainAmount(receivedAmount(bill))}</span></div>
        <div class="row"><span>Balance :</span><span>${formatPlainAmount(dueAmount(bill))}</span></div>
        ${balanceRows}
      </div>
      <div class="hr"></div>
      ${
        qrDataUrl
          ? `<div class="qr"><img src="${qrDataUrl}" alt="UPI QR code" width="120" height="120" /><p>Scan this QR Code to pay</p></div>`
          : ""
      }
      ${extraLines}
    </div>`;

  const receiptsHtml = Array.from({ length: copies })
    .map((_, i) => (i === 0 ? receiptBody : `<div class="page-break"></div>${receiptBody}`))
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Bill #${bill.id}</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      font-family: "Courier New", ui-monospace, monospace;
      color: #000;
      font-size: ${baseFontPx}px;
    }
    .receipt {
      width: ${widthMm}mm;
      margin: 0 auto;
      padding: 3mm 2mm;
      line-height: 1.35;
    }
    .receipt.bold { font-weight: 700; }
    .store-title {
      margin: 0 0 2px;
      text-align: center;
      font-weight: 700;
      font-size: 1.15em;
      text-transform: uppercase;
    }
    .identity {
      margin: 0 0 1px;
      text-align: center;
      font-size: 0.8em;
    }
    .doc-type {
      margin: 4px 0 2px;
      text-align: center;
      font-weight: 700;
    }
    .meta { margin: 2px 0; }
    .hr {
      border-top: 1px dashed #000;
      margin: 4px 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      margin: 1px 0;
    }
    .meta-row { font-size: 0.85em; }
    .summary-block { padding-left: 10px; }
    .bold-row { font-weight: 700; }
    table.items {
      width: 100%;
      border-collapse: collapse;
      margin: 2px 0;
    }
    table.items td { padding: 2px 1px; vertical-align: top; }
    table.items thead td { font-weight: 700; border-bottom: 1px dashed #000; }
    table.items .l { text-align: left; word-break: break-word; }
    table.items .c { text-align: left; width: 1.6em; }
    table.items .r { text-align: right; white-space: nowrap; }
    .qr { text-align: center; margin-top: 6px; }
    .qr img { display: block; margin: 0 auto 4px; }
    .qr p { margin: 0; font-size: 0.8em; }
    .feed-line { height: 1.2em; }
    .page-break { page-break-before: always; }

    /* Theme 2 — compact: no rules, tighter spacing, left-aligned header */
    .theme-2 { line-height: 1.15; }
    .theme-2 .store-title, .theme-2 .identity, .theme-2 .doc-type { text-align: left; }
    .theme-2 .hr { border-top: none; margin: 3px 0; }

    /* Theme 3 — boxed items table */
    .theme-3 table.items { border: 1px solid #000; }
    .theme-3 table.items thead td { border-bottom: 1px solid #000; }
    .theme-3 table.items td { border-right: 1px solid #000; }
    .theme-3 table.items td:last-child { border-right: none; }

    /* Theme 4 — minimal: no rules, uppercase item names */
    .theme-4 .hr { border-top: none; margin: 3px 0; }
    .theme-4 table.items .l { text-transform: uppercase; }

    @media print {
      @page {
        size: ${widthMm}mm ${heightMm ? `${heightMm}mm` : "auto"};
        margin: 0;
      }
      html, body { width: ${widthMm}mm; }
      .receipt { width: ${widthMm}mm; ${heightMm ? `height: ${heightMm}mm; overflow: hidden;` : ""} }
    }
  </style>
</head>
<body>
  ${receiptsHtml}
</body>
</html>`;
}

async function resolveReceiptHtmlAndWidth(
  bill: OfflineBillDetail,
  options?: PrintReceiptOptions,
): Promise<{ html: string; widthMm: number }> {
  const store: ReceiptStoreProfile | null =
    options?.store ?? (options?.storeName ? { name: options.storeName } : null);

  const printerSettings = loadPrinterSettings();
  const due = dueAmount(bill);
  const qrAmount = due > 0 ? due : bill.total_amount;
  const qrDataUrl = await buildUpiQrDataUrl(store, options?.upiId, qrAmount);

  if (printerSettings.defaultPrinter !== "thermal") {
    return {
      html: buildRegularReceiptHtml(bill, store, qrDataUrl),
      // Matches the regular receipt's own `.receipt { max-width: 78mm }` plus its print @page margin.
      widthMm: 78 + 16,
    };
  }

  const thermal: ThermalPrinterSettings = {
    ...printerSettings.thermal,
    ...(options?.pageSize ? { pageSize: options.pageSize } : {}),
    ...(options?.labelSize ? { labelSize: options.labelSize } : {}),
  };
  const widthMm =
    thermal.printingType === "label"
      ? thermal.labelSize === "custom"
        ? thermal.customLabelWidthMm
        : LABEL_SIZE_MM[thermal.labelSize].width
      : thermal.pageSize === "custom"
        ? 80
        : PAGE_SIZE_MM[thermal.pageSize];

  return {
    html: buildThermalReceiptHtml(bill, store, thermal, qrDataUrl),
    widthMm,
  };
}

export async function printOfflineBillReceipt(
  bill: OfflineBillDetail,
  options?: PrintReceiptOptions,
): Promise<boolean> {
  const { html } = await resolveReceiptHtmlAndWidth(bill, options);

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    iframe.remove();
    return false;
  }

  doc.open();
  doc.write(html);
  doc.close();
  win.focus();

  const cleanup = () => {
    iframe.remove();
  };

  setTimeout(() => {
    win.print();
    window.setTimeout(cleanup, 1500);
  }, 100);

  return true;
}

/** Renders receipt HTML off-screen at its real physical width and captures it as a canvas. */
async function renderReceiptToCanvas(html: string, widthMm: number): Promise<HTMLCanvasElement> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText = `position:fixed;left:-10000px;top:0;width:${widthMm}mm;height:100px;border:0;`;
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentDocument;
    if (!doc) throw new Error("Could not access iframe document");

    doc.open();
    doc.write(html);
    doc.close();

    await new Promise<void>((resolve) => {
      if (doc.readyState === "complete") resolve();
      else iframe.addEventListener("load", () => resolve(), { once: true });
    });
    // Let the QR <img> (data URL) finish painting before measuring/capturing.
    await new Promise((resolve) => setTimeout(resolve, 100));

    const contentHeightPx = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight);
    iframe.style.height = `${contentHeightPx}px`;

    const { default: html2canvas } = await import("html2canvas-pro");
    return await html2canvas(doc.body, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: doc.documentElement.scrollWidth,
      windowHeight: contentHeightPx,
    });
  } finally {
    iframe.remove();
  }
}

/** Downloads the bill as a PDF file sized to match the receipt's physical dimensions. */
export async function downloadOfflineBillReceipt(
  bill: OfflineBillDetail,
  options?: PrintReceiptOptions,
): Promise<boolean> {
  try {
    const { html, widthMm } = await resolveReceiptHtmlAndWidth(bill, options);
    const canvas = await renderReceiptToCanvas(html, widthMm);

    const imgData = canvas.toDataURL("image/png");
    const heightMm = (canvas.height / canvas.width) * widthMm;

    const { default: jsPDF } = await import("jspdf");
    const pdf = new jsPDF({
      orientation: heightMm >= widthMm ? "portrait" : "landscape",
      unit: "mm",
      format: [widthMm, heightMm],
    });
    pdf.addImage(imgData, "PNG", 0, 0, widthMm, heightMm);
    pdf.save(`bill-${bill.id}.pdf`);

    return true;
  } catch {
    return false;
  }
}
