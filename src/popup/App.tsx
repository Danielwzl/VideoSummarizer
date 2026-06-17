import { useEffect, useState } from "react";
import type { AppView, ChatMessage, TranscriptResult } from "../types";
import { ExtractView, PreviewView } from "../components/ExtractView";
import { ChatView } from "../components/ChatView";
import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/translations";
import {
  buildSummarySystemPrompt,
  chatWithDeepSeek,
  getApiKey,
  setApiKey,
} from "../services/deepseek";

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function getActiveYouTubeTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.includes("youtube.com/watch")) {
    throw new Error("NO_YOUTUBE");
  }
  return tab;
}

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [view, setView] = useState<AppView>("extract");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [apiKey, setApiKeyState] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    void getApiKey().then((key) => {
      if (key) setApiKeyState(key);
      else setShowSettings(true);
    });
  }, []);

  const handleSaveSettings = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    await setApiKey(trimmed);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
  };

  const handleExtract = async () => {
    setExtracting(true);
    setExtractError(null);

    try {
      const tab = await getActiveYouTubeTab();
      const response = await chrome.tabs.sendMessage(tab.id!, { type: "EXTRACT_TRANSCRIPT" });

      if (!response) {
        throw new Error(t("errorNoConnection"));
      }
      if (response.type === "TRANSCRIPT_ERROR") {
        throw new Error(response.payload);
      }

      setTranscript(response.payload);
      setView("preview");
    } catch (err) {
      if (err instanceof Error && err.message === "NO_YOUTUBE") {
        setExtractError(t("errorNoYoutube"));
      } else {
        setExtractError(err instanceof Error ? err.message : t("errorExtractFailed"));
      }
    } finally {
      setExtracting(false);
    }
  };

  const handleAiSummary = async () => {
    if (!transcript) return;

    const key = apiKey.trim() || (await getApiKey());
    if (!key) {
      setShowSettings(true);
      return;
    }

    const systemMessage: ChatMessage = {
      id: createId(),
      role: "system",
      content: buildSummarySystemPrompt(transcript.fullText, transcript.videoTitle, language),
    };

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: t("summaryUserPrompt"),
    };

    const initialMessages = [systemMessage, userMessage];
    setMessages(initialMessages);
    setView("chat");
    setChatLoading(true);

    try {
      const reply = await chatWithDeepSeek(initialMessages, key, language);
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "assistant", content: reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: `${t("errorPrefix")}${err instanceof Error ? err.message : t("errorRequestFailed")}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    const key = apiKey.trim() || (await getApiKey());
    if (!key) {
      setShowSettings(true);
      return;
    }

    const userMessage: ChatMessage = { id: createId(), role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setChatLoading(true);

    try {
      const reply = await chatWithDeepSeek(nextMessages, key, language);
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "assistant", content: reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: `${t("errorPrefix")}${err instanceof Error ? err.message : t("errorRequestFailed")}`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleEndChat = () => {
    setMessages([]);
    setTranscript(null);
    setExtractError(null);
    setView("extract");
  };

  const handleBackToExtract = () => {
    setTranscript(null);
    setView("extract");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t("appTitle")}</h1>
        <button
          className="btn btn-ghost btn-small"
          onClick={() => setShowSettings((v) => !v)}
          title={t("settingsTitle")}
        >
          ⚙
        </button>
      </header>

      {showSettings && (
        <div className="settings-panel">
          <label htmlFor="language">{t("languageLabel")}</label>
          <select
            id="language"
            className="settings-select"
            value={language}
            onChange={(e) => void handleLanguageChange(e.target.value as Language)}
          >
            <option value="zh">{t("languageZh")}</option>
            <option value="en">{t("languageEn")}</option>
          </select>

          <label htmlFor="api-key">{t("apiKeyLabel")}</label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            placeholder={t("apiKeyPlaceholder")}
          />
          <button className="btn btn-primary btn-small" onClick={handleSaveSettings}>
            {t("save")}
          </button>
          <a
            href="https://platform.deepseek.com/api_keys"
            target="_blank"
            rel="noreferrer"
            className="settings-link"
          >
            {t("getApiKey")}
          </a>
        </div>
      )}

      {settingsSaved && <div className="success-banner">{t("settingsSaved")}</div>}

      <main className="app-main">
        {view === "extract" && (
          <ExtractView onExtract={handleExtract} loading={extracting} error={extractError} />
        )}
        {view === "preview" && transcript && (
          <PreviewView
            transcript={transcript}
            onAiSummary={handleAiSummary}
            onBack={handleBackToExtract}
          />
        )}
        {view === "chat" && (
          <ChatView
            messages={messages}
            loading={chatLoading}
            onSend={handleSendMessage}
            onEndChat={handleEndChat}
          />
        )}
      </main>
    </div>
  );
}
