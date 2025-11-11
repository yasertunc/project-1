import React from "react";
export interface ChatBubbleProps {
  author?: "me" | "other" | "system";
  children: React.ReactNode;
}
export const ChatBubble: React.FC<ChatBubbleProps> = ({
  author = "other",
  children,
}) => {
  if (author === "system") {
    return <div className="text-[11px] text-ink-500 px-2 py-1">{children}</div>;
  }
  const isMe = author === "me";
  const wrap = `max-w-[70%] rounded-[20px] px-3 py-2 shadow ${isMe ? "ml-auto bg-primary-600 text-white" : "bg-white text-ink-900"}`;
  return <div className={wrap}>{children}</div>;
};
