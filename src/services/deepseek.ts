import type { ChatMessage } from "../types";
import type { Language } from "../i18n/translations";
import { getTranslation } from "../i18n/translations";
import { getApiKey, setApiKey } from "./settings";

export { getApiKey, setApiKey };

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";

export async function chatWithDeepSeek(
  messages: ChatMessage[],
  apiKey: string,
  language: Language
): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = `${getTranslation(language, "errorApi")} (${response.status})`;
    try {
      const parsed = JSON.parse(errorText) as { error?: { message?: string } };
      if (parsed.error?.message) message = parsed.error.message;
    } catch {
      if (errorText) message = errorText;
    }
    throw new Error(message);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(getTranslation(language, "errorApiEmpty"));
  return content;
}

export function buildSummarySystemPrompt(
  transcript: string,
  videoTitle: string,
  language: Language
): string {
  if (language === "en") {
    return `You are a professional video content analyst. The user has extracted the transcript from the YouTube video "${videoTitle}".
Please provide a clear, structured summary of the transcript below in English, including:
1. Overview of the video topic
2. Main points (as a bullet list)
3. Key conclusions

The user may continue to ask questions about the video content. Answer based on the transcript.

--- Transcript ---
${transcript}`;
  }

  return `你是一位专业的视频内容分析师。用户刚刚提取了 YouTube 视频「${videoTitle}」的字幕文稿。
请用中文对以下字幕内容进行清晰、结构化的总结，包括：
1. 视频主题概述
2. 主要观点/要点（分条列出）
3. 关键结论

之后用户可能会继续就视频内容向你提问，请基于字幕内容回答。

--- 字幕文稿 ---
${transcript}`;
}
