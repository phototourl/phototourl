const MAX_UPLOADS_PER_IP_PER_DAY = 20;

/** key: `${ip}-${yyyy-mm-dd}`, value: count */
const store = new Map<string, number>();

function getDateKey() {
  const d = new Date();
  return [
    d.getUTCFullYear(),
    String(d.getUTCMonth() + 1).padStart(2, "0"),
    String(d.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function storeKey(ip: string) {
  return `${ip}-${getDateKey()}`;
}

/** 清理过期 key（保留当天），避免内存无限增长 */
function prune() {
  const today = getDateKey();
  for (const key of Array.from(store.keys())) {
    const keyDate = key.slice(-10); // key 格式 "ip-yyyy-mm-dd"，日期为最后 10 位
    if (keyDate !== today) store.delete(key);
  }
}

export function getUploadCountToday(ip: string): number {
  if (!ip || ip === "unknown") return 0;
  return store.get(storeKey(ip)) ?? 0;
}

export function incrementUploadCount(ip: string): void {
  if (!ip || ip === "unknown") return;
  const key = storeKey(ip);
  store.set(key, (store.get(key) ?? 0) + 1);
  if (store.size > 10000) prune();
}

export function isOverLimit(ip: string): boolean {
  return getUploadCountToday(ip) >= MAX_UPLOADS_PER_IP_PER_DAY;
}

export { MAX_UPLOADS_PER_IP_PER_DAY };
