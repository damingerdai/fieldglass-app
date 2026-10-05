# Fieldglass Mobile

Flutter 客户端，支持 iOS 和 Android。与根目录的 Next.js 网站共用 Supabase Auth、数据库和 RLS。

## 环境

- Flutter stable 3.47.3 / Dart 3.13.3（本次生成和验证版本）。
- Android：Android Studio、Android SDK、Flutter 支持的 JDK 和模拟器或真机。
- iOS：macOS、Xcode 和 iOS Simulator；真机运行需在 Xcode 配置开发团队及签名。
- 先运行 `flutter doctor -v` 检查平台工具链，`flutter devices` 查看设备。

## 连接现有 Supabase

```bash
bun run mobile:setup
cp apps/mobile/.env.example apps/mobile/.env
```

编辑 `apps/mobile/.env`：

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-publishable-or-anon-key
```


- `SUPABASE_URL`：与网站的 `NEXT_PUBLIC_SUPABASE_URL` 相同，使用 HTTPS。
- `SUPABASE_ANON_KEY`：与网站的 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 相同，也支持 publishable key。
- **不要填入 service role key、secret key 或 Resend 密钥**。编译参数会包含在客户端产物中。

`apps/mobile/.env` 已被 Git 忽略；客户端不读取根目录 `.env.local`。

```bash
bun run mobile:dev
```

使用现有账号的邮箱和密码登录。会话由 Supabase Flutter SDK 持久化和刷新，退出仅清理当前客户端会话。需要保证已有 `db/migrations/` 对应的数据库结构和 RLS 已部署；此改动不新增数据库迁移。

## 当前范围

- 邮箱密码登录、输入校验、加载和错误反馈、密码可见性切换。
- 会话恢复和退出登录。
- Dashboard：总额度、已使用、剩余天数、分类余额和最近 5 条请假记录。
- 汉堡侧边菜单：在 Dashboard、Leave Entitlements、Leave Requests 间切换，保留已加载的页面状态。
- Profile 固定在侧边栏底部，显示当前账号邮箱，支持退出登录。
- 额度与请假记录：查看日期、天数、备注和申请状态，支持下拉刷新、失败重试和每页 20 条的加载更多。
- 下拉刷新、空数据、请求失败重试。
- 已启用验证器 MFA 的账号登录后输入 6 位 OTP，验证成功才进入 Dashboard；支持粘贴、自动填充、失败重试和退出。恢复未完成验证的会话时也会进入 OTP 页面。
- 注册、找回密码、OAuth/链接回跳、请假申请及额度修改暂由网页完成。

## 目录与边界

```text
lib/
  main.dart                        # 编译配置和 SDK 初始化
  app.dart                         # Material 3 主题与入口
  features/auth/                   # 登录与会话门禁
  features/dashboard/              # 页面、模型及数据仓库
.env.example                # 可提交的配置模板
android/                           # Android 原生工程
ios/                              # iOS 原生工程
test/                             # Widget 和数据测试
```

移动端使用用户会话直接读取 `user_leave_balances` 与 `leave_requests`，查询明确过滤 `user_id`，权限由服务端 RLS 强制执行。它不调用 Next.js Server Actions，当前没有业务数据写入。未来增加移动端写操作时需单独设计共享 HTTP/RPC 接口及鉴权；网站现有 Server Actions 约定继续适用。

Dart 与 TypeScript 各自管理模型和依赖。数据库 schema 是共同的数据契约，变更表或字段时需同步两端模型。

## 检查与构建

仓库根目录：

```bash
bun run mobile:analyze
bun run mobile:test
bun run mobile:format
```

本目录：

```bash
dart format lib test
flutter build apk --dart-define-from-file=.env
flutter build ios --no-codesign --dart-define-from-file=.env
```

默认 Android application ID 是 `com.fieldglass.fieldglass_mobile`，iOS bundle ID 是 `com.fieldglass.fieldglassMobile`。发布前配置正式 ID、图标及 Android/iOS 签名。模板 Android release 仍使用 debug 签名，仅供开发构建。`--no-codesign` 不生成可分发的 iOS 签名包。

接入方式参考 [Supabase Flutter quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/flutter) 和 [Flutter 平台配置](https://docs.flutter.dev/platform-integration)。
