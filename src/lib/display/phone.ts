export function sanitizePhoneForDisplayInput(value: string): string {
  const trimmed = value.trimStart();
  const hasLeadingPlus = trimmed.startsWith("+");
  const digits = value.replace(/\D/g, "");

  // Fixed live mask for Indian numbers: +91 XX XXXX XXXX
  // Supports:
  // - explicit +91...
  // - pasted 91...
  // - plain local number (auto-assume +91)
  if (
    (hasLeadingPlus && digits.startsWith("91")) ||
    (!hasLeadingPlus && digits.startsWith("91")) ||
    (!hasLeadingPlus && digits.length > 0)
  ) {
    const normalized = !hasLeadingPlus && !digits.startsWith("91")
      ? `91${digits}`
      : digits;

    const local = normalized.slice(2, 12);
    const part1 = local.slice(0, 2);
    const part2 = local.slice(2, 6);
    const part3 = local.slice(6, 10);

    let output = "+91";
    if (part1) output += ` ${part1}`;
    if (part2) output += ` ${part2}`;
    if (part3) output += ` ${part3}`;
    return output;
  }

  // Fallback for non-Indian numbers: normalize separators and group by 3
  const grouped = digits.replace(/(\d{3})(?=\d)/g, "$1 ");
  return hasLeadingPlus ? `+${grouped}` : grouped;
}

export function normalizePhoneForPayload(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const hasLeadingPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (hasLeadingPlus) return `+${digits}`;

  // Default to +91 for local input.
  if (digits.startsWith("91")) {
    return `+${digits.slice(0, 12)}`;
  }

  return `+91${digits.slice(0, 10)}`;
}

function formatIndianLocalDigits(localDigits: string): string {
  const local = localDigits.slice(0, 10);
  const part1 = local.slice(0, 2);
  const part2 = local.slice(2, 6);
  const part3 = local.slice(6, 10);
  return [part1, part2, part3].filter(Boolean).join(" ");
}

export function sanitizeIndianPhoneLocalInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  const local =
    digits.length > 10 && digits.startsWith("91")
      ? digits.slice(2, 12)
      : digits.slice(0, 10);
  return formatIndianLocalDigits(local);
}

export function formatIndianPhoneLocalDisplay(value: string): string {
  const normalized = normalizePhoneForPayload(value);
  if (!normalized) return "";

  const digits = normalized.replace(/\D/g, "");
  const local =
    digits.length > 10 && digits.startsWith("91")
      ? digits.slice(2, 12)
      : digits.slice(0, 10);
  return formatIndianLocalDigits(local);
}

export function normalizeIndianPhonePayloadFromLocal(value: string): string {
  const digits = value.replace(/\D/g, "");
  const local =
    digits.length > 10 && digits.startsWith("91")
      ? digits.slice(2, 12)
      : digits.slice(0, 10);

  if (!local) return "";
  return `+91${local}`;
}

export function formatPhoneForDisplay(value: string): string {
  const normalized = normalizePhoneForPayload(value);
  if (!normalized) return "";

  // Fixed display mask for Indian numbers: +91 XX XXXX XXXX
  if (normalized.startsWith("+91") && normalized.length >= 5) {
    const local = normalized.slice(3, 13);
    const part1 = local.slice(0, 2);
    const part2 = local.slice(2, 6);
    const part3 = local.slice(6, 10);

    let output = "+91";
    if (part1) output += ` ${part1}`;
    if (part2) output += ` ${part2}`;
    if (part3) output += ` ${part3}`;
    return output;
  }

  if (!normalized.startsWith("+")) {
    return normalized.replace(/(\d{3})(?=\d)/g, "$1 ");
  }

  const digits = normalized.slice(1);
  if (digits.length <= 3) return `+${digits}`;

  const countryCodeLength = Math.max(1, digits.length - 10);
  const countryCode = digits.slice(0, countryCodeLength);
  const localNumber = digits.slice(countryCodeLength);
  const groupedLocal = localNumber.replace(/(\d{3})(?=\d)/g, "$1 ");

  return `+${countryCode} ${groupedLocal}`.trim();
}
