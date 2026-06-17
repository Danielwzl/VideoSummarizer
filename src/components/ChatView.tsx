import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface ChatViewProps {
  messages: ChatMessage[];
  loading: boolean;
  onSend: (text: string) => void;
  onEndChat: () => void;
}

export function ChatView({ messages, loading, onSend, onEndChat }: ChatViewProps) {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const visibleMessages = messages.filter((m) => m.role !== "system");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    onSend(text);
  };

  return (
    <div className="view chat-view">
      <div className="chat-header">
        <h2>{t("chatTitle")}</h2>
        <button className="btn btn-ghost btn-small" onClick={onEndChat}>
          {t("endChat")}
        </button>
      </div>

      <div className="chat-messages">
        {visibleMessages.length === 0 && !loading && (
          <div className="chat-empty">{t("generatingSummary")}</div>
        )}
        {visibleMessages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.role}`}>
            <div className="message-role">{msg.role === "user" ? t("you") : "DeepSeek"}</div>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="message message-assistant">
            <div className="message-role">DeepSeek</div>
            <div className="message-content typing">{t("thinking")}</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chatPlaceholder")}
          rows={2}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
          {t("send")}
        </button>
      </form>
    </div>
  );
}
