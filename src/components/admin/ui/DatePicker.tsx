"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "@/components/admin/ui/Label";
import { CalenderIcon, TimeIcon } from "@/icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  minDate?: DateOption;
  maxDate?: DateOption;
  minTime?: string;
  maxTime?: string;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  defaultDate,
  minDate,
  maxDate,
  minTime,
  maxTime,
  placeholder,
}: PropsType) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<flatpickr.Instance | null>(null);
  const onChangeRef = useRef<Hook | Hook[] | undefined>(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const element = inputRef.current;

    if (!element) return;

    const isTimePicker = mode === "time";

    const flatPickr = flatpickr(element, {
      mode: isTimePicker ? "single" : mode,

      monthSelectorType: "static",

      // DATE
      dateFormat: isTimePicker ? "h:i K" : "Y-m-d",

      // Visible date format
      altInput: !isTimePicker,
      altFormat: "d-m-Y",

      // TIME
      enableTime: isTimePicker,
      noCalendar: isTimePicker,
      time_24hr: false,
      minuteIncrement: 5,
      allowInput: false,
      disableMobile: true,

      // Prevent previous dates
      minDate: isTimePicker ? undefined : "today",

      onChange: (selectedDates, dateStr, instance) => {
        const callback = onChangeRef.current;

        if (typeof callback === "function") {
          callback(selectedDates, dateStr, instance);
        } else if (Array.isArray(callback)) {
          callback.forEach((fn) =>
            fn(selectedDates, dateStr, instance)
          );
        }
      },
    });

    pickerRef.current = flatPickr;

    return () => {
      flatPickr.destroy();
      pickerRef.current = null;
    };
  }, [mode]);

  useEffect(() => {
    const picker = pickerRef.current;

    if (!picker) return;

    const isTimePicker = mode === "time";
    picker.set("minDate", isTimePicker ? undefined : minDate ?? "today");
    picker.set("maxDate", isTimePicker ? undefined : maxDate);
    picker.set("minTime", isTimePicker ? minTime : undefined);
    picker.set("maxTime", isTimePicker ? maxTime : undefined);
  }, [maxDate, maxTime, minDate, minTime, mode]);

  useEffect(() => {
    const picker = pickerRef.current;

    if (!picker) return;

    picker.setDate(defaultDate ?? [], false);
  }, [defaultDate, mode]);

  const openPicker = () => {
    pickerRef.current?.open();
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative mt-2">
        <input
          ref={inputRef}
          id={id}
          // Flatpickr creates a formatted display field for dates. Keeping the
          // underlying value field hidden prevents React re-renders from
          // making both fields visible after a date is selected.
          type={mode === "time" ? "text" : "hidden"}
          placeholder={placeholder}
          readOnly
          className="h-11 w-full rounded-lg border appearance-none px-4 pr-11 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-white text-gray-800 border-gray-300 focus:border-brand-500 focus:ring-brand-500/10 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-500"
        />

        <button
          type="button"
          onClick={openPicker}
          aria-label={`Open ${mode === "time" ? "time" : "date"} picker`}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500 transition hover:text-brand-500 focus:outline-none focus-visible:text-brand-500 dark:text-gray-400"
        >
          {mode === "time" ? (
            <TimeIcon className="h-5 w-5" />
          ) : (
            <CalenderIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
