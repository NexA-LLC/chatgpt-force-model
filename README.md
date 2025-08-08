# ChatGPT Model Selector

ChatGPTで使用するモデルを自動的に選択するChrome拡張機能

## 機能

- ChatGPT (chatgpt.com) にアクセスした際、URLに自動的にモデルパラメータを追加
- デフォルトモデルを設定画面から選択可能
- 対応モデル: GPT-5 Thinking, GPT-5 Pro, GPT-5, GPT-4, GPT-4 Turbo, GPT-3.5 Turbo, o1, o1-preview, o1-mini, o3, o3-mini

## インストール方法

### 開発版として使用

1. このリポジトリをクローン
2. Chrome で `chrome://extensions/` を開く
3. 右上の「デベロッパーモード」をONにする
4. 「パッケージ化されていない拡張機能を読み込む」をクリック
5. このリポジトリのフォルダを選択

### Chrome Web Store から（準備中）

近日公開予定

## 使い方

1. 拡張機能のアイコンをクリック
2. ドロップダウンからデフォルトモデルを選択
3. 「設定を保存」をクリック
4. ChatGPTにアクセスすると、選択したモデルが自動的に使用される

## 開発者向け

### Chrome Web Store への申請

この拡張機能をChrome Web Storeに申請する場合は、[申請ガイド](docs/SUBMISSION_GUIDE.md)を参照してください。

### ファイル構成

```
chatgpt-force-model/
├── manifest.json      # 拡張機能のマニフェスト
├── content.js         # メインロジック
├── options.html       # 設定画面
├── options.js         # 設定画面のロジック
├── icon16.png         # 16x16 アイコン
├── icon48.png         # 48x48 アイコン
├── icon128.png        # 128x128 アイコン
├── build.sh           # ビルドスクリプト
├── .gitignore         # Git除外設定
├── README.md          # このファイル
└── docs/
    └── SUBMISSION_GUIDE.md  # Chrome Web Store 申請ガイド
```

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照