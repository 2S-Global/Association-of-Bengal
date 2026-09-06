"use client";

import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers/TimePicker";

type Props = {
  id: string;
  value?: string;
  onChange?: (time: string) => void;
  minTime?: string;
  maxTime?: string;
  label?: string;
  placeholder?: string;
};

const to24HourTime = (value?: string) => {
  if (!value) return undefined;

  const twelveHourMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHourMatch) {
    const [, hourText, minute, meridiem] = twelveHourMatch;
    const hour = Number(hourText) % 12 + (meridiem.toUpperCase() === "PM" ? 12 : 0);
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }

  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : undefined;
};

const parseTime = (value?: string) => {
  const time = to24HourTime(value);
  if (!time) return null;

  const parsed = dayjs(`2000-01-01T${time}`);
  return parsed.isValid() ? parsed : null;
};

const pickerFieldSx = {
  width: "100%",
  "& .MuiPickersInputBase-root": {
    minHeight: "44px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#1f2937",
    fontSize: "0.875rem",
    boxShadow: "var(--shadow-theme-xs)",
    "& .MuiPickersOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
    "&:hover .MuiPickersOutlinedInput-notchedOutline": { borderColor: "#9ca3af" },
    "&.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
      borderColor: "#8b1a1a",
      borderWidth: "1px",
    },
    "&.Mui-focused": { boxShadow: "0 0 0 3px rgb(139 26 26 / 0.1)" },
  },
  "& .MuiPickersSectionList-root": { padding: "10px 0 10px 14px" },
  "& .MuiPickersInputBase-sectionContent": { color: "inherit", fontSize: "0.875rem" },
  "& .MuiIconButton-root": { color: "#6b7280", marginRight: "2px" },
  ".dark & .MuiPickersInputBase-root": {
    backgroundColor: "#111827",
    color: "rgb(255 255 255 / 0.9)",
    "& .MuiPickersOutlinedInput-notchedOutline": { borderColor: "#374151" },
    "&:hover .MuiPickersOutlinedInput-notchedOutline": { borderColor: "#4b5563" },
  },
  ".dark & .MuiIconButton-root": { color: "#9ca3af" },
};

const pickerPopperSx = {
  zIndex: 1500,
  "& .MuiPaper-root": {
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgb(0 0 0 / 0.12)",
  },
  ".dark & .MuiPaper-root": {
    backgroundColor: "#111827",
    color: "rgb(255 255 255 / 0.9)",
  },
};

export default function TimePicker({
  id,
  value,
  onChange,
  minTime,
  maxTime,
  label,
  placeholder,
}: Props) {
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MuiTimePicker
          value={parseTime(value)}
          onChange={(time) => onChange?.(time?.format("hh:mm A") ?? "")}
          minTime={parseTime(minTime) ?? undefined}
          maxTime={parseTime(maxTime) ?? undefined}
          ampm
          format="hh:mm A"
          timeSteps={{ minutes: 5 }}
          slotProps={{
            textField: {
              id,
              fullWidth: true,
              size: "small",
              sx: pickerFieldSx,
              slotProps: { htmlInput: { placeholder } },
            },
            popper: { sx: pickerPopperSx },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
