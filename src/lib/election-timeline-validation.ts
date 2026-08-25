export type ElectionPeriod = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export type ElectionTimeline = {
  nomination: ElectionPeriod;
  withdrawal: ElectionPeriod;
  voting: ElectionPeriod;
};

export function hasElectionPeriodEnded(period: ElectionPeriod) {
  const endTimestamp = getElectionTimestamp(period.endDate, period.endTime);
  return endTimestamp !== null && Date.now() >= endTimestamp;
}

type ValidationResult = { valid: true } | { valid: false; message: string };

const periodLabels = {
  nomination: "Nomination",
  withdrawal: "Withdrawal",
  voting: "Voting",
} as const;

const requiredPeriodFields: Array<keyof ElectionPeriod> = [
  "startDate",
  "startTime",
  "endDate",
  "endTime",
];

function isElectionPeriod(value: unknown): value is ElectionPeriod {
  if (!value || typeof value !== "object") return false;

  const period = value as Record<string, unknown>;
  return requiredPeriodFields.every(
    (field) => typeof period[field] === "string" && period[field].trim().length > 0
  );
}

function parseCalendarDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? { year, month, day }
    : null;
}

function parseTime(value: string) {
  const twelveHourMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    const [, hourText, minuteText, meridiem] = twelveHourMatch;
    const hour = Number(hourText);
    const minute = Number(minuteText);

    if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
      return { hour: (hour % 12) + (meridiem.toUpperCase() === "PM" ? 12 : 0), minute };
    }
  }

  const twentyFourHourMatch = value.match(/^(\d{2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const [, hourText, minuteText] = twentyFourHourMatch;
    const hour = Number(hourText);
    const minute = Number(minuteText);

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return { hour, minute };
    }
  }

  return null;
}

function toTimestamp(dateValue: string, timeValue: string) {
  const date = parseCalendarDate(dateValue);
  const time = parseTime(timeValue);

  if (!date || !time) return null;

  return Date.UTC(date.year, date.month - 1, date.day, time.hour, time.minute);
}

export function getElectionTimestamp(dateValue: string, timeValue: string) {
  return toTimestamp(dateValue, timeValue);
}

function validatePeriod(period: unknown, label: string): ValidationResult {
  if (!isElectionPeriod(period)) {
    return { valid: false, message: `Please complete all ${label.toLowerCase()} dates and times.` };
  }

  const start = toTimestamp(period.startDate, period.startTime);
  const end = toTimestamp(period.endDate, period.endTime);

  if (start === null || end === null) {
    return { valid: false, message: `${label} contains an invalid date or time.` };
  }

  if (start >= end) {
    return { valid: false, message: `${label} start must be before its end.` };
  }

  return { valid: true };
}

export function validateElectionTimeline(timeline: unknown): ValidationResult {
  if (!timeline || typeof timeline !== "object") {
    return { valid: false, message: "Please complete all election dates and times." };
  }

  const periods = timeline as Record<keyof ElectionTimeline, unknown>;
  for (const key of Object.keys(periodLabels) as Array<keyof ElectionTimeline>) {
    const result = validatePeriod(periods[key], periodLabels[key]);
    if (!result.valid) return result;
  }

  const nomination = periods.nomination as ElectionPeriod;
  const withdrawal = periods.withdrawal as ElectionPeriod;
  const voting = periods.voting as ElectionPeriod;

  if (nomination.endDate >= withdrawal.startDate) {
    return {
      valid: false,
      message: "Withdrawal start date must be after the nomination end date.",
    };
  }

  if (withdrawal.endDate >= voting.startDate) {
    return {
      valid: false,
      message: "Voting start date must be after the withdrawal end date.",
    };
  }

  return { valid: true };
}
