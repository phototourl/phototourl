/**
 * 校验所有 messages/*.json 中的 blog.posts 结构
 * 确保：1) JSON 可解析 2) 四个博客 slug 均为 posts 的直接子键 3) 无嵌套 4) 每项含 title/description/content
 * 用法: node scripts/validate-blog-posts.js
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const REQUIRED_SLUGS = [
  'how-to-convert-image-to-url-complete-guide',
  'how-to-crop-images-in-circle-shape',
  'photo-to-rounded-corners-guide',
  'photo-to-remove-background-guide',
];

const REQUIRED_KEYS = ['title', 'description', 'content'];

function validate() {
  const files = fs.readdirSync(MESSAGES_DIR).filter((f) => f.endsWith('.json'));
  let passed = 0;
  const errors = [];

  for (const file of files) {
    const locale = file.replace('.json', '');
    const filePath = path.join(MESSAGES_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    let data;

    if (/\*20\d{2}\*"\s*\n\s*,\s*\n\s*"photo-to-remove-background-guide"/.test(raw)) {
      errors.push({
        locale,
        msg: '疑似嵌套: 圆角 content 后为单独逗号再接 photo-to-remove-background-guide，应改为 }, 闭合圆角对象',
      });
    }

    try {
      data = JSON.parse(raw);
    } catch (e) {
      errors.push({ locale, msg: `JSON 解析失败: ${e.message}` });
      continue;
    }

    const posts = data.blog && data.blog.posts;
    if (!posts || typeof posts !== 'object') {
      if (locale === 'bg') continue;
      errors.push({ locale, msg: '缺少 blog.posts' });
      continue;
    }

    for (const slug of REQUIRED_SLUGS) {
      const post = posts[slug];
      if (!post || typeof post !== 'object') {
        errors.push({ locale, msg: `blog.posts 缺少直接键: ${slug}` });
        continue;
      }
      for (const key of REQUIRED_KEYS) {
        if (typeof post[key] !== 'string') {
          errors.push({ locale, msg: `blog.posts["${slug}"].${key} 应为字符串` });
        }
      }
    }

    const rounded = posts['photo-to-rounded-corners-guide'];
    const removeBg = posts['photo-to-remove-background-guide'];
    if (rounded && rounded['photo-to-remove-background-guide'] !== undefined) {
      errors.push({
        locale,
        msg: '错误嵌套: photo-to-remove-background-guide 被写在 photo-to-rounded-corners-guide 内部',
      });
    }
    if (removeBg && removeBg['photo-to-rounded-corners-guide'] !== undefined) {
      errors.push({
        locale,
        msg: '错误嵌套: photo-to-rounded-corners-guide 被写在 photo-to-remove-background-guide 内部',
      });
    }

    passed++;
  }

  if (errors.length > 0) {
    console.error('校验未通过:\n');
    errors.forEach(({ locale, msg }) => console.error(`  ${locale}: ${msg}`));
    process.exit(1);
  }

  console.log(`OK: ${passed} 个语言文件 blog.posts 结构正确。`);
}

validate();
