# KAMO LIFE｜加茂市移住相談Webアプリ

加茂市に特化した、スマートフォン対応の移住相談PWAです。

## 主な機能
- 8問の加茂暮らし相性診断（点数・理由・次の行動）
- 移住準備チェックリスト
- OpenAI APIを利用できるAI移住相談
- LIFULL HOME'S 加茂市空き家バンクからの空き家一覧取得
- 加茂市公式イベント情報の月別取得
- 加茂市の公開募集・地域おこし・採用情報検索＋ハローワーク導線
- 住宅取得補助金の簡易条件チェック
- 支援制度、住まい、仕事、子育て、交通情報
- 月々の生活費シミュレーター
- OpenStreetMap地図表示
- 相談メモ保存、加茂市政策推進課宛てメール作成
- 自治体向け管理画面 `admin.html`
- 日別PV、AI相談、空き家・求人・イベント閲覧数のプライバシー配慮型アクセス分析
- PWA対応

## 構成
- `index.html` 公開画面
- `app.js` 公開画面ロジック
- `config.js` API接続先設定
- `admin.html` 自治体向け管理画面
- `admin.js` 管理画面ロジック
- `worker.js` Cloudflare Worker用バックエンド
- `wrangler.toml.example` Worker設定例

## OpenAI APIを本番有効化する方法
GitHub PagesだけではAPIキーを安全に保持できないため、`worker.js` をCloudflare Worker等のサーバーレス環境に配置します。

1. CloudflareでWorkerを作成し、このリポジトリの `worker.js` をデプロイ
2. Secret `OPENAI_API_KEY` にOpenAI APIキーを登録
3. Secret `ADMIN_TOKEN` に管理画面用の長いランダム文字列を登録
4. Variable `ALLOWED_ORIGIN` を `https://czwaew.github.io` に設定
5. 必要に応じて `OPENAI_MODEL` を利用可能なモデル名に設定
6. アクセス分析を使う場合はCloudflare KVを作成し、binding名を `ANALYTICS` に設定
7. WorkerのURLを `config.js` の `apiBase` に設定

APIキーや管理トークンを `config.js` や `app.js` に直接書かないでください。

## バックエンドAPI
- `POST /api/ai` OpenAI APIによる移住相談
- `GET /api/akiyas` 加茂市空き家バンク掲載情報
- `GET /api/events?year=2026&month=8` 加茂市イベント
- `GET /api/jobs?q=協力隊` 公開求人・募集検索
- `POST /api/track` 匿名集計イベント記録
- `GET /api/stats` 管理トークン必須の30日集計

## 管理画面
`https://czwaew.github.io/otamesi-iju-app/admin.html`

管理画面ではAPI URLと `ADMIN_TOKEN` を入力して利用します。トークンはブラウザのsessionStorageにのみ保持します。

## GitHub Pagesへの公開
Settings → Pages → Deploy from a branch → main / root を利用します。

## 注意
非公式の試作アプリです。物件、求人、イベント、補助制度等は変更・終了する可能性があります。最終判断や申請・契約の前に必ず加茂市および各掲載元の最新公式情報をご確認ください。
