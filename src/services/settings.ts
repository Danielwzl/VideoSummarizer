import type { Language } from "../i18n/translations";

const LANGUAGE_KEY = "language";
const API_KEY = "deepseekApiKey";

export async function getLanguage(): Promise<Language> {
  const result = await chrome.storage.local.get(LANGUAGE_KEY);
  const lang = result[LANGUAGE_KEY];
  return lang === "en" ? "en" : "zh";
}

export async function setLanguage(lang: Language): Promise<void> {
  await chrome.storage.local.set({ [LANGUAGE_KEY]: lang });
}

export async function getApiKey(): Promise<string | null> {
  const result = await chrome.storage.local.get(API_KEY);
  return (result[API_KEY] as string | undefined) ?? null;
}

export async function setApiKey(key: string): Promise<void> {
  await chrome.storage.local.set({ [API_KEY]: key });
}
