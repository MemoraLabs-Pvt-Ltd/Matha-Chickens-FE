export type PrinterKind = "regular" | "thermal";
export type ReceiptTheme = 1 | 2 | 3 | 4;
export type ReceiptPageSize = "2in" | "3in" | "4in" | "custom";
export type InvoiceTextSize = "small" | "medium" | "large";
export type PrintingType = "full_invoice" | "label";
export type LabelSize = "40x30" | "50x25" | "50x30" | "100x50" | "custom";

export interface ThermalPrinterSettings {
  theme: ReceiptTheme;
  pageSize: ReceiptPageSize;
  /** Characters per line, only used when pageSize is "custom". */
  customChars: number;
  textSize: InvoiceTextSize;
  printingType: PrintingType;
  /** Die-cut label dimensions — only used when printingType is "label". */
  labelSize: LabelSize;
  customLabelWidthMm: number;
  customLabelHeightMm: number;
  boldText: boolean;
  autoCutPaper: boolean;
  openCashDrawer: boolean;
  extraLinesAtEnd: number;
  numberOfCopies: number;
}

export interface PrinterSettings {
  /** Which printer type "Save & Print" / "Print Bill" uses by default. */
  defaultPrinter: PrinterKind;
  thermal: ThermalPrinterSettings;
}

export const PAGE_SIZE_MM: Record<Exclude<ReceiptPageSize, "custom">, number> = {
  "2in": 58,
  "3in": 68,
  "4in": 88,
};

/** Common die-cut thermal label sizes (width x height, mm). */
export const LABEL_SIZE_MM: Record<Exclude<LabelSize, "custom">, { width: number; height: number }> = {
  "40x30": { width: 40, height: 30 },
  "50x25": { width: 50, height: 25 },
  "50x30": { width: 50, height: 30 },
  "100x50": { width: 100, height: 50 },
};

export const DEFAULT_THERMAL_SETTINGS: ThermalPrinterSettings = {
  theme: 1,
  pageSize: "4in",
  customChars: 70,
  textSize: "large",
  printingType: "full_invoice",
  labelSize: "50x25",
  customLabelWidthMm: 50,
  customLabelHeightMm: 25,
  boldText: false,
  autoCutPaper: true,
  openCashDrawer: false,
  extraLinesAtEnd: 2,
  numberOfCopies: 1,
};

export const DEFAULT_PRINTER_SETTINGS: PrinterSettings = {
  defaultPrinter: "thermal",
  thermal: DEFAULT_THERMAL_SETTINGS,
};

const STORAGE_KEY = "matha-printer-settings";

export function loadPrinterSettings(): PrinterSettings {
  if (typeof window === "undefined") return DEFAULT_PRINTER_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PRINTER_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<PrinterSettings>;
    return {
      defaultPrinter: parsed.defaultPrinter ?? DEFAULT_PRINTER_SETTINGS.defaultPrinter,
      thermal: { ...DEFAULT_THERMAL_SETTINGS, ...parsed.thermal },
    };
  } catch {
    return DEFAULT_PRINTER_SETTINGS;
  }
}

export function savePrinterSettings(settings: PrinterSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore quota / private mode
  }
}
