import React, { useEffect, useRef } from "react";

import { useI18n } from "../i18n/useI18n";

export type ReportCategory =
  | "harassment"
  | "hate"
  | "self-harm"
  | "spam"
  | "personal-info"
  | "other";

const ORDER: ReportCategory[] = [
  "harassment",
  "hate",
  "self-harm",
  "spam",
  "personal-info",
  "other",
];

export const ReportCategoryModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSelect: (category: ReportCategory) => void;
}> = ({ open, onClose, onSelect }) => {
  const { t } = useI18n();
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const id = setTimeout(() => firstBtnRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(id);
    };
  }, [open, onClose]);

  if (!open) return null;

  const labelFor = (category: ReportCategory) => {
    switch (category) {
      case "harassment":
        return t("report.category.harassment");
      case "hate":
        return t("report.category.hate");
      case "self-harm":
        return t("report.category.self_harm");
      case "spam":
        return t("report.category.spam");
      case "personal-info":
        return t("report.category.personal_info");
      default:
        return t("report.category.other");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-title"
      className="fixed inset-0 z-50 grid place-items-center"
    >
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-[360px] rounded-2xl bg-white p-4 shadow">
        <div
          id="report-title"
          className="mb-2 text-base font-semibold text-ink-900"
        >
          {t("report.modal.title")}
        </div>

        <div className="grid gap-2">
          {ORDER.map((key, idx) => (
            <button
              key={key}
              ref={idx === 0 ? firstBtnRef : undefined}
              className="w-full rounded-xl border border-ink-700/10 bg-muted-50 px-3 py-2 text-left hover:bg-muted-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              onClick={() => onSelect(key)}
            >
              <div className="font-medium text-ink-900">{labelFor(key)}</div>
            </button>
          ))}
        </div>

        <div className="mt-3 flex justify-end">
          <button
            className="rounded-pill bg-muted-100 px-3 py-1.5 text-ink-700 hover:bg-muted-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            onClick={onClose}
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};
