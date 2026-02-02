# 多语言未应用的 key 汇总

以下 key 仅在 **en**、**zh**、**pl** 中已配置，其余 33 个语言会回退到默认语言（英文）或显示 key 本身。

---

## 1. 上传记录（头部 + 抽屉）

| Key | 说明 | 已配置 | 未配置（33 个） |
|-----|------|--------|-----------------|
| `common.header.history` | 头部「上传记录」按钮文案 | en, zh, pl | ar, bg, ca, cs, da, de, el, es, fi, fr, he, hi, hr, hu, id, it, jp, ko, ms, nl, no, pt, rm, ro, ru, sk, sv, th, tl, tr, uk, vi, zh-TW |
| `common.history.drawerTitle` | 抽屉标题「上传记录」 | en, zh, pl | 同上 |
| `common.history.hint` | 抽屉内提示「展示最近10条上传记录」 | en, zh, pl | 同上 |
| `common.history.close` | 关闭按钮 | en, zh, pl | 同上 |
| `common.history.empty` | 空状态「暂无上传记录」 | en, zh, pl | 同上 |
| `common.history.copy` | 复制链接 | en, zh, pl | 同上 |
| `common.history.copied` | 已复制 | en, zh, pl | 同上 |
| `common.history.open` | 新标签打开 | en, zh, pl | 同上 |

---

## 2. 每日上传限制提示

| Key | 说明 | 已配置 | 未配置（33 个） |
|-----|------|--------|-----------------|
| `home.result.dailyLimitReached` | 429 时提示「今日上传已达上限（20条）」 | en, zh, pl | ar, bg, ca, cs, da, de, el, es, fi, fr, he, hi, hr, hu, id, it, jp, ko, ms, nl, no, pt, rm, ro, ru, sk, sv, th, tl, tr, uk, vi, zh-TW |

---

## 3. 头部「照片圆形裁剪」说明

头部导航的「照片圆形裁剪」使用的是 **`circleCrop.title`**（各语言在 `circleCrop` 块里已有），不是 `common.header.circleCrop`。  
因此「照片圆形裁剪」在所有语言下都会正常显示，无需补 `common.header.circleCrop`。

---

## 未配置语言列表（33 个）

ar, bg, ca, cs, da, de, el, es, fi, fr, he, hi, hr, hu, id, it, jp, ko, ms, nl, no, pt, rm, ro, ru, sk, sv, th, tl, tr, uk, vi, zh-TW

---

## 建议

- 若希望所有语言都有上传记录和每日限制的完整体验，需在上述 33 个 `messages/*.json` 中补充：
  - `common.header.history`
  - `common.history` 整块（drawerTitle, hint, close, empty, copy, copied, open）
  - `home.result.dailyLimitReached`
- 不补的话，这些语言会使用 next-intl 的 fallback（一般为 en），功能正常，只是文案为英文。
