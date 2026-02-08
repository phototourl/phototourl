# Google AdSense 403 错误修复指南

## 生产环境 403 错误的原因

生产环境出现 AdSense 403 错误通常由以下原因导致：

### 1. AdSense 账户设置问题 ⚠️

**最常见原因：**
- AdSense 账户中开启了"仅授权已验证站点使用我的广告代码"
- 域名 `phototourl.com` 未添加到授权站点列表

**解决方法：**
1. 登录 [Google AdSense](https://www.google.com/adsense/)
2. 进入 **设置** → **我的网站** → **管理网站**
3. 确保 **"仅授权已验证站点使用我的广告代码"** 选项为 **关闭** 状态
4. 或者将 `phototourl.com` 添加到授权站点列表

### 2. 域名验证问题 🔍

**检查清单：**
- [ ] `phototourl.com` 是否已添加到 AdSense 账户
- [ ] 域名是否已验证所有权
- [ ] 是否包含 `www.phototourl.com` 变体

**解决方法：**
1. 在 AdSense 中添加网站：**设置** → **我的网站** → **添加网站**
2. 按照提示验证域名所有权
3. 等待验证通过（通常需要几小时到几天）

### 3. AdSense 账户状态 📊

**可能情况：**
- 账户还在审核中
- 新账户需要等待 AdSense 爬虫更新
- 账户被暂停或限制

**检查方法：**
1. 登录 AdSense 查看账户状态
2. 检查是否有未解决的警告或限制
3. 查看账户是否已完全激活

### 4. 自动广告功能冲突 ⚙️

**问题：**
- 如果启用了 AdSense 自动广告，可能与手动广告代码冲突
- 自动广告可能尝试在不支持的页面加载

**解决方法：**
1. 检查 AdSense 账户中的自动广告设置
2. 确保自动广告已正确配置
3. 如果不需要自动广告，可以禁用它

## 代码层面的处理

当前代码已经添加了环境检查，只在生产环境加载 AdSense。如果仍然出现 403 错误，可以：

### 选项 1：添加错误处理（推荐）

在页面中添加错误处理，静默处理 AdSense 加载失败：

```typescript
// 可以添加错误处理脚本
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('adsbygoogle')) {
          // 静默处理 AdSense 错误，不显示在控制台
          e.preventDefault();
          return true;
        }
      }, true);
    `,
  }}
/>
```

### 选项 2：暂时禁用 AdSense

如果问题持续，可以暂时禁用 AdSense，等待账户问题解决：

```typescript
const shouldLoadAdSense = false; // 暂时禁用
```

## 联系 AdSense 支持

如果以上方法都无法解决，建议：

1. 使用 [AdSense 故障排除工具](https://support.google.com/adsense/troubleshooter/6384782)
2. 在 [AdSense 帮助论坛](https://support.google.com/adsense/community) 发帖
3. 通过 AdSense 账户内的"帮助"联系支持团队

## 注意事项

- 403 错误不会影响网站功能，只是广告无法显示
- 新账户可能需要等待 24-48 小时才能正常显示广告
- 确保网站内容符合 AdSense 政策
- 检查网站是否有足够的原创内容

## 验证修复

修复后，可以通过以下方式验证：

1. 检查浏览器控制台是否还有 403 错误
2. 使用 AdSense 的"检查广告"功能
3. 等待几小时后查看 AdSense 报告，确认广告展示
