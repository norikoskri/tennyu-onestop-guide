# 転入・引越しワンストップ支援

転入者向けの地域情報プラットフォーム。AIチャットでオンボーディングを行い、必要な手続きをタスク管理し、郵便局員の「現場知」を含む地域情報を提供します。

---

## 🎯 プロジェクト概要

引越しに伴う煩雑な手続きや地域情報収集を、AIアシスタントと郵便局ネットワークの知見でサポートするWebアプリケーション。

### 主な機能

- **AIオンボーディング**: チャット形式で転入情報を入力
- **タスク自動生成**: 家族構成に応じた手続きリストを自動作成
- **優先度計算**: 期限に基づいた優先順位付け
- **地域ガイド**: 郵便局員の「現場知」を含む生活情報
- **パーソナライズ**: 家族構成・関心事に応じたおすすめ表示

---

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **データ管理**: localStorage (クライアントサイド永続化)
- **デプロイ**: Vercel

---

## 🚀 セットアップ

### 前提条件

- Node.js 18以上
- npm

### インストール

```bash
npm install
```

### 環境変数

```bash
cp .env.example .env.local
```

`.env.local` を編集して必要な値を設定。

### 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認。

---

## 🌐 デプロイ

```bash
git add .
git commit -m "Update"
git push origin main
```

Vercel が自動でデプロイ。

---

## 📂 ディレクトリ構成

```text
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # チャット（オンボーディング）
│   ├── dashboard/          # ダッシュボード
│   ├── tasks/              # タスク管理
│   └── guide/              # 地域ガイド
├── components/             # Reactコンポーネント
│   ├── chat/               # チャット関連
│   ├── dashboard/          # ダッシュボード関連
│   ├── tasks/              # タスク関連
│   ├── guide/              # 地域ガイド関連
│   ├── layout/             # レイアウト関連
│   └── ui/                 # 汎用UI
├── contexts/               # React Context
├── hooks/                  # カスタムフック
├── lib/                    # ユーティリティ
│   ├── ai/                 # AI関連
│   ├── tasks/              # タスク生成・優先度計算
│   └── utils/              # その他ユーティリティ
├── data/                   # モックデータ
│   └── regions/            # 地域情報JSON
└── types/                  # TypeScript型定義
```

---

## 📖 カスタムコマンド

| コマンド | 説明 |
|---------|------|
| `/kiro` | Kiro式仕様書を生成 |
| `/commit` | コミット支援 |
| `/deploy` | デプロイ前チェック |

---

## 📄 ライセンス

MIT License
