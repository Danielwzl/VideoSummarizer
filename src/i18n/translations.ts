export type Language = "zh" | "en";

export type TranslationKey = keyof typeof translations.zh;

export const translations = {
  zh: {
    appTitle: "Video Summarizer",
    settingsTitle: "设置",
    apiKeyLabel: "DeepSeek API Key",
    apiKeyPlaceholder: "sk-...",
    getApiKey: "获取 API Key",
    save: "保存",
    languageLabel: "界面语言",
    languageZh: "中文",
    languageEn: "English",
    settingsSaved: "设置已保存",

    extractTitle: "YouTube 字幕提取",
    extractDesc: "在 YouTube 视频页面打开此扩展，点击下方按钮提取当前视频的字幕文稿。",
    extractButton: "提取 Transcript",
    extracting: "正在提取...",
    extractHint: "提示：如果提取失败，请先在视频下方展开「Transcript / 转录文稿」面板。",

    segmentCount: "条字幕",
    reExtract: "重新提取",
    copyTranscript: "复制文稿",
    copied: "已复制",
    aiSummary: "AI Summary",

    chatTitle: "DeepSeek 对话",
    endChat: "End Chat",
    generatingSummary: "正在生成总结...",
    you: "你",
    thinking: "思考中...",
    chatPlaceholder: "继续向 AI 提问...",
    send: "发送",

    errorNoYoutube: "请先打开一个 YouTube 视频页面",
    errorNoConnection: "无法连接到页面，请刷新 YouTube 页面后重试",
    errorExtractFailed: "提取失败",
    errorRequestFailed: "请求失败",
    errorPrefix: "错误：",
    errorApiEmpty: "DeepSeek 返回了空响应",
    errorApi: "DeepSeek API 错误",

    summaryUserPrompt: "请总结以上视频字幕的主要内容。",
  },
  en: {
    appTitle: "Video Summarizer",
    settingsTitle: "Settings",
    apiKeyLabel: "DeepSeek API Key",
    apiKeyPlaceholder: "sk-...",
    getApiKey: "Get API Key",
    save: "Save",
    languageLabel: "Language",
    languageZh: "中文",
    languageEn: "English",
    settingsSaved: "Settings saved",

    extractTitle: "YouTube Transcript",
    extractDesc: "Open this extension on a YouTube video page, then click below to extract the transcript.",
    extractButton: "Extract Transcript",
    extracting: "Extracting...",
    extractHint: "Tip: If extraction fails, expand the Transcript panel below the video first.",

    segmentCount: "segments",
    reExtract: "Re-extract",
    copyTranscript: "Copy",
    copied: "Copied",
    aiSummary: "AI Summary",

    chatTitle: "DeepSeek Chat",
    endChat: "End Chat",
    generatingSummary: "Generating summary...",
    you: "You",
    thinking: "Thinking...",
    chatPlaceholder: "Ask a follow-up question...",
    send: "Send",

    errorNoYoutube: "Please open a YouTube video page first",
    errorNoConnection: "Could not connect to the page. Refresh the YouTube tab and try again.",
    errorExtractFailed: "Extraction failed",
    errorRequestFailed: "Request failed",
    errorPrefix: "Error: ",
    errorApiEmpty: "DeepSeek returned an empty response",
    errorApi: "DeepSeek API error",

    summaryUserPrompt: "Please summarize the main content of the video transcript above.",
  },
} as const;

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key];
}
