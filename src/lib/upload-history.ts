const STORAGE_KEY = "phototourl-upload-history";
const MAX_ITEMS = 10;

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

/** 获取最近 10 条上传记录（最新在前） */
export function getUploadHistory(): UploadHistoryItem[] {
  return getStored().slice(0, MAX_ITEMS);
}

/** 添加一条上传记录，超过 10 条时去掉最旧的 */
export function addUploadRecord(item: UploadHistoryItem) {
  const list = getStored();
  const next = [item, ...list.filter((x) => x.url !== item.url)].slice(0, MAX_ITEMS);
  setStored(next);
}
