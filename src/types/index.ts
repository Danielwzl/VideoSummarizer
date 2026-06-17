export type AppView = "extract" | "preview" | "chat";

export interface TranscriptSegment {
  timestamp: string;
  text: string;
}

export interface TranscriptResult {
  videoTitle: string;
  videoUrl: string;
  segments: TranscriptSegment[];
  fullText: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export type MessageType =
  | { type: "EXTRACT_TRANSCRIPT" }
  | { type: "TRANSCRIPT_RESULT"; payload: TranscriptResult }
  | { type: "TRANSCRIPT_ERROR"; payload: string };
