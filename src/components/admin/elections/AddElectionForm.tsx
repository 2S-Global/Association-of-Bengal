"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import DatePicker from "@/components/admin/ui/DatePicker";

const rulesAndRegulations = [
  "Only eligible members of the selected wings may submit nominations and vote.",
  "All nominations must be submitted before the nomination closing date and time.",
  "Withdrawals received after the withdrawal deadline will not be accepted.",
  "The Election Committee's decision on election matters will be final.",
];

type Period = {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export type ElectionFormData = {
  _id?: string;
  name: string;
  description?: string;
  postDesignations: string[];
  nomination: Period;
  withdrawal: Period;
  voting: Period;
  wings: string[];
  location: string;
};

const emptyPeriod: Period = {
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
};

const inputClass =
  "mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-800 shadow-theme-xs outline-none transition-all placeholder:text-gray-400 focus:border-[#8b1a1a] focus:ring-3 focus:ring-[#8b1a1a]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500";

const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

const capitalizeSentences = (value: string) =>
  value.replace(
    /(^|[.!?]\s+)([a-z])/g,
    (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`
  );

export default function AddElectionForm({
  initialElection,
}: {
  initialElection?: ElectionFormData;
}) {
  const [name, setName] = useState(initialElection?.name ?? "");
  const [description, setDescription] = useState(initialElection?.description ?? "");
  const [postDesignations, setPostDesignations] = useState(
    initialElection?.postDesignations ?? [""]
  );

  const [nomination, setNomination] = useState<Period>(
    initialElection?.nomination ?? emptyPeriod
  );
  const [withdrawal, setWithdrawal] = useState<Period>(
    initialElection?.withdrawal ?? emptyPeriod
  );
  const [voting, setVoting] = useState<Period>(
    initialElection?.voting ?? emptyPeriod
  );

  const [wings, setWings] = useState<string[]>(initialElection?.wings ?? []);
  const [wingOptions, setWingOptions] = useState<string[]>([]);
  const [isLoadingWings, setIsLoadingWings] = useState(true);
  const [wingsError, setWingsError] = useState<string | null>(null);
  const [location, setLocation] = useState(initialElection?.location ?? "");

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadWings = async () => {
      try {
        const response = await fetch("/api/wings");
        const result: { data?: unknown; message?: string } = await response.json();

        if (!response.ok || !Array.isArray(result.data)) {
          throw new Error(result.message || "Unable to load member wings.");
        }

        if (isMounted) {
          setWingOptions(
            result.data.filter((wing): wing is string => typeof wing === "string")
          );
        }
      } catch (error) {
        if (isMounted) {
          setWingsError(
            error instanceof Error ? error.message : "Unable to load member wings."
          );
        }
      } finally {
        if (isMounted) setIsLoadingWings(false);
      }
    };

    loadWings();
    return () => {
      isMounted = false;
    };
  }, []);

  const updatePeriod = (
    setter: React.Dispatch<React.SetStateAction<Period>>,
    key: keyof Period,
    value: string
  ) => {
    setter((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateDesignation = (index: number, value: string) => {
    setPostDesignations((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? capitalizeSentences(value) : item
      )
    );
  };

  const addDesignation = () => {
    setPostDesignations((items) => [...items, ""]);
  };

  const removeDesignation = (index: number) => {
    setPostDesignations((items) =>
      items.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const toggleWing = (wing: string) => {
    setWings((current) =>
      current.includes(wing)
        ? current.filter((item) => item !== wing)
        : [...current, wing]
    );
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPostDesignations([""]);
    setNomination(emptyPeriod);
    setWithdrawal(emptyPeriod);
    setVoting(emptyPeriod);
    setWings([]);
    setLocation("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);

    try {
      const response = await fetch(
        initialElection?._id
          ? `/api/elections/${initialElection._id}`
          : "/api/elections",
        {
          method: initialElection?._id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            postDesignations,
            nomination,
            withdrawal,
            voting,
            wings,
            location,
            rulesAndRegulations,
          }),
        }
      );

      let result: { message?: string; error?: string } = {};
      try {
        result = await response.json();
      } catch {
        // non-JSON response
      }

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Unable to save the election."
        );
      }

      toast.success(
        result.message ||
          (initialElection?._id
            ? "Election updated successfully"
            : "Election created successfully")
      );

      if (!initialElection?._id) resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the election."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getPickerId = (section: string, field: string) =>
    `${section.toLowerCase().replace(/\s+/g, "-")}-${field}-date`;

  const renderPeriod = (
    title: string,
    period: Period,
    setter: React.Dispatch<React.SetStateAction<Period>>
  ) => (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Set the start and end date and time.
        </p>
      </div>

      <div className="p-5">
        <div className="space-y-5">
          {/* Start */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Start
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className={labelClass}>Start date</p>
                <DatePicker
                  id={getPickerId(title, "start")}
                  placeholder="Select start date"
                  defaultDate={period.startDate || undefined}
                  onChange={(_, dateStr) =>
                    updatePeriod(setter, "startDate", dateStr)
                  }
                />
              </div>
              <div>
                <p className={labelClass}>Start time</p>
                <DatePicker
                  id={`${getPickerId(title, "start")}-time`}
                  mode="time"
                  placeholder="Select start time"
                  defaultDate={period.startTime || undefined}
                  onChange={(_, time) =>
                    updatePeriod(setter, "startTime", time)
                  }
                />
              </div>
            </div>
          </div>

          {/* End */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              End
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className={labelClass}>End date</p>
                <DatePicker
                  id={getPickerId(title, "end")}
                  placeholder="Select end date"
                  defaultDate={period.endDate || undefined}
                  onChange={(_, dateStr) =>
                    updatePeriod(setter, "endDate", dateStr)
                  }
                />
              </div>
              <div>
                <p className={labelClass}>End time</p>
                <DatePicker
                  id={`${getPickerId(title, "end")}-time`}
                  mode="time"
                  placeholder="Select end time"
                  defaultDate={period.endTime || undefined}
                  onChange={(_, time) =>
                    updatePeriod(setter, "endTime", time)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* BASIC INFORMATION */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Election Information
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter the basic information for this election.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            <label className={labelClass}>
              Election name
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(capitalizeSentences(e.target.value))}
                placeholder="Enter election name"
                required
              />
            </label>

            <label className={labelClass}>
              Description
              <span className="ml-1 font-normal text-gray-400">(optional)</span>
              <textarea
                className="mt-2 min-h-28 w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-800 shadow-theme-xs outline-none transition-all placeholder:text-gray-400 focus:border-[#8b1a1a] focus:ring-3 focus:ring-[#8b1a1a]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500"
                value={description}
                onChange={(e) =>
                  setDescription(capitalizeSentences(e.target.value))
                }
                placeholder="Describe this election"
              />
            </label>

            {/* Post Designations */}
            <div>
              <div className="mb-3">
                <label className={labelClass}>Post designation</label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Add the posts available in this election.
                </p>
              </div>

              <div className="space-y-3">
                {postDesignations.map((designation, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                      {index + 1}
                    </div>

                    <input
                      className="h-11 w-full max-w-md rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-800 shadow-theme-xs outline-none transition-all placeholder:text-gray-400 focus:border-[#8b1a1a] focus:ring-3 focus:ring-[#8b1a1a]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500"
                      value={designation}
                      onChange={(e) => updateDesignation(index, e.target.value)}
                      placeholder={
                        index === 0 ? "e.g. President" : "Enter another designation"
                      }
                      required
                    />

                    {postDesignations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDesignation(index)}
                        className="inline-flex h-11 shrink-0 items-center rounded-lg border border-error-200 px-3.5 text-sm font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/40 dark:text-error-400 dark:hover:bg-error-500/10"
                      >
                        Remove
                      </button>
                    )}

                    {index === postDesignations.length - 1 && (
                      <button
                        type="button"
                        onClick={addDesignation}
                        className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg bg-[#8b1a1a] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#6d1414]"
                      >
                        <span className="text-base leading-none">+</span>
                        Add more
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ELECTION PERIODS */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {renderPeriod("Nomination period", nomination, setNomination)}
        {renderPeriod("Withdraw nomination period", withdrawal, setWithdrawal)}
        {renderPeriod("Voting period", voting, setVoting)}
      </section>

      {/* LOCATION + WINGS */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Election Venue & Wings
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Specify the voting location and applicable wings.
          </p>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <div>
            <label className={labelClass}>Location</label>
            <input
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(capitalizeSentences(e.target.value))}
              placeholder="Enter voting location"
              required
            />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800" />

          <div>
            <label className={labelClass}>Wings</label>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select one or more wings applicable to this election.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
              {isLoadingWings ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#8b1a1a] border-t-transparent" />
                  Loading member wings…
                </div>
              ) : wingsError ? (
                <p className="text-sm text-error-600 dark:text-error-400">
                  {wingsError}
                </p>
              ) : wingOptions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No wings are available in the members collection.
                </p>
              ) : (
                wingOptions.map((wing) => (
                  <label
                    key={wing}
                    className="group flex cursor-pointer items-center gap-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={wings.includes(wing)}
                      onChange={() => toggleWing(wing)}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#8b1a1a] focus:ring-[#8b1a1a] dark:border-gray-600 dark:bg-gray-800"
                    />
                    <span className="text-sm font-medium text-gray-700 transition group-hover:text-[#8b1a1a] dark:text-gray-300 dark:group-hover:text-[#e8b4b4]">
                      {wing}
                    </span>
                  </label>
                ))
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              You can select multiple wings.
            </p>
          </div>
        </div>
      </section>

      {/* RULES & REGULATIONS */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:px-6">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Rules and Regulations
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please review the rules applicable to this election.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/50">
            <ul className="space-y-3">
              {rulesAndRegulations.map((rule, index) => (
                <li
                  key={rule}
                  className="flex gap-3 text-sm leading-6 text-gray-600 dark:text-gray-400"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8b1a1a]/10 text-xs font-semibold text-[#8b1a1a] dark:bg-[#8b1a1a]/20 dark:text-[#e8b4b4]">
                    {index + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#8b1a1a] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#6d1414] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : initialElection?._id ? (
            "Update election"
          ) : (
            "Save election"
          )}
        </button>
      </div>
    </form>
  );
}