export interface DiffOptions {
  locale?: string;
  thresholds?: {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
  };
}

export interface DurationBreakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const DEFAULT_THRESHOLDS = {
  seconds: 45,
  minutes: 45,
  hours: 22,
  days: 26,
};

/**
 * Format relative time difference: diff(a, b) -> "3 days ago" / "in 2 hours"
 * Uses Intl.RelativeTimeFormat if available, fallback to manual strings
 */
export function diff(from: Date, to: Date = new Date(), opts: DiffOptions = {}): string {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...opts.thresholds };
  const locale = opts.locale ?? "en-US";

  const msPerUnit = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30.44 * 24 * 60 * 60 * 1000, // Documented approximation
    year: 365.25 * 24 * 60 * 60 * 1000,
  };

  const delta = to.getTime() - from.getTime();
  const absDelta = Math.abs(delta);
  const isFuture = delta < 0; // If 'from' is in the future relative to 'to'

  // Determine unit and value
  let unit: Intl.RelativeTimeFormatUnit = "second";
  let value = Math.round(absDelta / msPerUnit.second);

  if (absDelta > thresholds.seconds! * msPerUnit.second) {
    value = Math.round(absDelta / msPerUnit.minute);
    unit = "minute";
  }
  if (absDelta > thresholds.minutes! * msPerUnit.minute) {
    value = Math.round(absDelta / msPerUnit.hour);
    unit = "hour";
  }
  if (absDelta > thresholds.hours! * msPerUnit.hour) {
    value = Math.round(absDelta / msPerUnit.day);
    unit = "day";
  }
  if (absDelta > thresholds.days! * msPerUnit.day) {
    value = Math.round(absDelta / msPerUnit.week);
    unit = "week";
  }

  // Use Intl if available
  if (typeof Intl !== "undefined" && Intl.RelativeTimeFormat) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    return rtf.format(isFuture ? value : -value, unit);
  }

  // Fallback strings
  const fallbackStrings: Record<string, [string, string]> = {
    second: ["a few seconds ago", "in a few seconds"],
    minute: [`${value} minute${value !== 1 ? "s" : ""} ago`, `in ${value} minute${value !== 1 ? "s" : ""}`],
    hour: [`${value} hour${value !== 1 ? "s" : ""} ago`, `in ${value} hour${value !== 1 ? "s" : ""}`],
    day: [`${value} day${value !== 1 ? "s" : ""} ago`, `in ${value} day${value !== 1 ? "s" : ""}`],
    week: [`${value} week${value !== 1 ? "s" : ""} ago`, `in ${value} week${value !== 1 ? "s" : ""}`],
  };

  const [past, future] = fallbackStrings[unit] || ["a while ago", "in a while"];
  return isFuture ? future : past;
}

/**
 * Break down millisecond delta into {days, hours, minutes, seconds}
 */
export function breakdown(ms: number): DurationBreakdown {
  const absDelta = Math.abs(ms);
  
  let remaining = absDelta;
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  remaining -= days * 24 * 60 * 60 * 1000;

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  remaining -= hours * 60 * 60 * 1000;

  const minutes = Math.floor(remaining / (60 * 1000));
  remaining -= minutes * 60 * 1000;

  const seconds = Math.floor(remaining / 1000);

  return { days, hours, minutes, seconds };
}
