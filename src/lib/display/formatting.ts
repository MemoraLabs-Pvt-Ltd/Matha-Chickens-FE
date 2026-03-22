/**
 * Shared display helpers (INR, ISO timestamps, API date strings).
 */

export function formatInr(value: number): string {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** e.g. 22/03/2026 — for compact table date columns */
export function formatIsoDateEnGbNumeric(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Date + time split for list/sheet layouts */
export function splitIsoDateTime(iso: string): { date: string; time: string } {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return { date: "-", time: "-" };
  }

  return {
    date: date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

/** Single-line locale string for receipts / print */
export function formatIsoDateTimeEnIn(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTrendVsYesterday(
  percent: number | null,
): string | undefined {
  if (percent === null) return undefined;
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent}% vs yesterday`;
}

export function parseApiDate(
  value: string | Date | null | undefined,
): Date | undefined {
  if (value == null || value === "") return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }

  const raw = value.trim();
  if (!raw) return undefined;

  const normalized = raw.includes("T") ? raw : raw.replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseApiDate(startDate);
  const end = parseApiDate(endDate);

  if (!start || !end) {
    return "-";
  }

  const startText = start.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const endText = end.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${startText} - ${endText}`;
}
