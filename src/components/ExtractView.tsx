import { useState } from "react";
import type { TranscriptResult } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface ExtractViewProps {
  onExtract: () => void;
  loading: boolean;
  error: string | null;
}

export function ExtractView({ onExtract, loading, error }: ExtractViewProps) {
  const { t } = useLanguage();

  return (
    <div className="view extract-view">
      <div className="hero">
        <div className="hero-icon">▶</div>
        <h2>{t("extractTitle")}</h2>
        <p>{t("extractDesc")}</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <button className="btn btn-primary btn-large" onClick={onExtract} disabled={loading}>
        {loading ? t("extracting") : t("extractButton")}
      </button>

      <p className="hint">{t("extractHint")}</p>
    </div>
  );
}

interface PreviewViewProps {
  transcript: TranscriptResult;
  onAiSummary: () => void;
  onBack: () => void;
}

export function PreviewView({ transcript, onAiSummary, onBack }: PreviewViewProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="view preview-view">
      <div className="preview-header">
        <h2>{transcript.videoTitle}</h2>
        <span className="segment-count">
          {transcript.segments.length} {t("segmentCount")}
        </span>
      </div>

      <div className="transcript-preview">
        <pre>{transcript.fullText}</pre>
      </div>

      <div className="action-row">
        <button className="btn btn-secondary" onClick={onBack}>
          {t("reExtract")}
        </button>
        <button className="btn btn-secondary" onClick={handleCopy}>
          {copied ? t("copied") : t("copyTranscript")}
        </button>
        <button className="btn btn-primary" onClick={onAiSummary}>
          {t("aiSummary")}
        </button>
      </div>
    </div>
  );
}
