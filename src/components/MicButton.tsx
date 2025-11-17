import React from "react";
import { useTranslation } from "react-i18next";

export const MicButton: React.FC<{
  recording?: boolean;
  onPress?: () => void;
  onRelease?: () => void;
}> = ({ recording = false, onPress, onRelease }) => {
  const { t } = useTranslation("common");
  return (
    <button
      aria-pressed={recording}
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onTouchStart={onPress}
      onTouchEnd={onRelease}
      className={`rounded-pill px-3 py-2 inline-flex items-center gap-2 ${
        recording
          ? "bg-semantic-error text-white"
          : "bg-background-light text-text-secondary hover:bg-surface-gray"
      }`}
    >
      <span aria-hidden>🎤</span>
      <span>{recording ? t("mic.recording") : t("mic.idle")}</span>
    </button>
  );
};
