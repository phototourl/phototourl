const STORAGE_KEY = "phototourl-upload-history";

/** 展示最近一周（7 天）内的记录 */
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
/** 存储时最多保留最近 30 天，避免 localStorage 无限增长 */
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export type UploadHistoryItem = {
  url: string;
  fileName: string;
  timestamp: number;
};

function getStored(): UploadHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStored(items: UploadHistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

/** 获取最近一周内的上传记录（最新在前） */
export function getUploadHistory(): UploadHistoryItem[] {
  const now = Date.now();
  const cutoff = now - ONE_WEEK_MS;
  return getStored().filter((item) => item.timestamp >= cutoff);
}

/** 添加一条上传记录；存储时去掉超过 30 天的旧记录 */
export function addUploadRecord(item: UploadHistoryItem) {
  const now = Date.now();
  const list = getStored();
  const trimmed = list.filter((x) => x.timestamp >= now - MAX_AGE_MS);
  const next = [item, ...trimmed.filter((x) => x.url !== item.url)];
  setStored(next);
}
