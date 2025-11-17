import i18n from "./setup";

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
) {
  const lng = i18n.language || "en";
  return new Intl.NumberFormat(lng, options).format(value);
}

export function formatDate(
  value: Date | number | string,
  options?: Intl.DateTimeFormatOptions
) {
  const lng = i18n.language || "en";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(lng, {
    dateStyle: "medium",
    ...options,
  }).format(date);
}

export function formatRelativeMinutes(minutes: number) {
  const lng = i18n.language || "en";
  const rtf = new Intl.RelativeTimeFormat(lng, {
    numeric: "auto",
    style: "short",
  });
  return rtf.format(minutes, "minute");
}
