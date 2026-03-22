import type { OfflineBillDetail, PaymentMode } from "@/lib/api/offlineBills";
import { formatInr, formatIsoDateTimeEnIn } from "@/lib/display/formatting";
import { escapeHtml } from "@/lib/display/html";
import { formatPhoneForDisplay } from "@/lib/display/phone";

const paymentLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  other: "Other",
};

function buildReceiptHtml(
  bill: OfflineBillDetail,
  storeName: string | null | undefined,
): string {
  const title = escapeHtml(storeName?.trim() || "Tax invoice");
  const customerName = bill.customer_name?.trim();
  const phoneDisplay = bill.customer_phone
    ? formatPhoneForDisplay(bill.customer_phone)
    : "";

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
      margin-top: 12px;
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
      <p class="doc-type">Bill / Receipt</p>

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
      </div>

      <div class="footer">
        <p class="thanks">Thank you</p>
        <p>We appreciate your business.<br />This is a computer-generated document.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function printOfflineBillReceipt(
  bill: OfflineBillDetail,
  options?: { storeName?: string | null },
): boolean {
  const html = buildReceiptHtml(bill, options?.storeName);

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
