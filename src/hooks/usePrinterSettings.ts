import { useCallback, useState } from "react";
import {
  loadPrinterSettings,
  savePrinterSettings,
  type PrinterSettings,
} from "@/lib/billing/printerSettings";

/** Printer/receipt preferences for this device, persisted in localStorage. */
export function usePrinterSettings() {
  const [settings, setSettings] = useState<PrinterSettings>(() => loadPrinterSettings());

  const updateSettings = useCallback((next: PrinterSettings) => {
    setSettings(next);
    savePrinterSettings(next);
  }, []);

  return { settings, updateSettings, isLoaded: true };
}
