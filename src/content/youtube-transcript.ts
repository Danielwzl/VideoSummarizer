const TRANSCRIPT_CONTAINER_SELECTOR =
  'yt-section-list-renderer[panel-target-id="PAmodern_transcript_view"], yt-section-list-renderer[data-target-id="PAmodern_transcript_view"]';
const SEGMENT_SELECTOR = "div.ytwTimelineItemViewModelContentItems";
const TIMESTAMP_SELECTOR = "div.ytwTranscriptSegmentViewModelTimestamp";
const TEXT_SELECTOR = 'span.ytAttributedStringHost[role="text"]';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getVideoTitle(): string {
  const titleEl =
    document.querySelector("h1.ytd-watch-metadata yt-formatted-string") ??
    document.querySelector("h1 yt-formatted-string") ??
    document.querySelector("title");
  return titleEl?.textContent?.trim() ?? "Unknown Video";
}

function parseSegment(segmentDiv: Element): { timestamp: string; text: string } | null {
  const textEl = segmentDiv.querySelector(TEXT_SELECTOR);
  const text = textEl?.textContent?.trim() ?? "";
  if (!text) return null;

  const timestampEl = segmentDiv.querySelector(TIMESTAMP_SELECTOR);
  const timestamp = timestampEl?.textContent?.trim() ?? "";

  return { timestamp, text };
}

function collectSegments(): { timestamp: string; text: string }[] {
  const container = document.querySelector(TRANSCRIPT_CONTAINER_SELECTOR);
  if (!container) return [];

  const segmentDivs = container.querySelectorAll(SEGMENT_SELECTOR);
  const segments: { timestamp: string; text: string }[] = [];

  segmentDivs.forEach((segmentDiv) => {
    const segment = parseSegment(segmentDiv);
    if (segment) segments.push(segment);
  });

  return segments;
}

async function tryOpenTranscriptPanel(): Promise<void> {
  const expandButton = document.querySelector<HTMLButtonElement>(
    'button[aria-label*="transcript" i], button[aria-label*="字幕" i], button[aria-label*="轉錄" i], button[aria-label*="转录" i]'
  );
  if (expandButton) {
    expandButton.click();
    await sleep(800);
  }
}

async function waitForSegments(maxAttempts = 20): Promise<{ timestamp: string; text: string }[]> {
  for (let i = 0; i < maxAttempts; i++) {
    const segments = collectSegments();
    if (segments.length > 0) return segments;
    await sleep(400);
  }
  return [];
}

function buildFullText(segments: { timestamp: string; text: string }[]): string {
  return segments
    .map((s) => (s.timestamp ? `[${s.timestamp}] ${s.text}` : s.text))
    .join("\n");
}

async function extractTranscript(): Promise<{
  videoTitle: string;
  videoUrl: string;
  segments: { timestamp: string; text: string }[];
  fullText: string;
}> {
  await tryOpenTranscriptPanel();
  const segments = await waitForSegments();

  if (segments.length === 0) {
    throw new Error(
      "无法找到字幕内容。请先在 YouTube 视频页面展开「Transcript / 转录文稿」面板，然后重试。"
    );
  }

  return {
    videoTitle: getVideoTitle(),
    videoUrl: window.location.href,
    segments,
    fullText: buildFullText(segments),
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "EXTRACT_TRANSCRIPT") return;

  extractTranscript()
    .then((result) => sendResponse({ type: "TRANSCRIPT_RESULT", payload: result }))
    .catch((err: Error) =>
      sendResponse({
        type: "TRANSCRIPT_ERROR",
        payload: err.message ?? "提取字幕失败",
      })
    );

  return true;
});
