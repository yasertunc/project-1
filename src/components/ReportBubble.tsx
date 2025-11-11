import React from "react";
import { useTranslation } from "react-i18next";

export const ReportBubble: React.FC<{ onClick?: () => void }> = ({
  onClick,
}) => {
  const { t } = useTranslation("common");
  return (
    <div
      className="sticky top-2 ml-auto flex items-center gap-2 rounded-pill bg-white px-3 py-1 text-xs shadow cursor-pointer select-none"
      onClick={onClick}
      title={t("report")}
      role="button"
      aria-label={t("report")}
    >
      <span aria-hidden>⚠️</span>
      <span>{t("report")}</span>
    </div>
  );
};
