# Package.json Editor (Package Maestro)

package.jsonをGUI上で誰でも簡単に編集できるツールです。技術的な知識がなくても、直感的なインターフェースでpackage.jsonファイルを編集できます。

## 📋 概要

Package Maestroは、package.jsonファイルを視覚的なフォーム形式で編集できるWebアプリケーションです。JSONファイルを直接編集する必要がなく、カスタマイズ可能なプリセットを使用して、必要なフィールドだけを表示・編集できます。

## ✨ 主な機能

### ファイル操作
- **ドラッグ&ドロップ対応**: package.jsonファイルをドラッグ&ドロップで開く
- **ZIPファイル対応**: ZIPアーカイブ内のpackage.jsonも編集可能
- **File System Access API**: Chromium系ブラウザで直接ファイルを保存（ダウンロード不要）
- **フォールバック保存**: 対応ブラウザ以外では自動的にダウンロード形式で保存

### プリセット管理
- **複数プリセット**: 最大5つまでのプリセットを作成・管理
- **プリセット切り替え**: 用途に応じて異なるプリセットを切り替え
- **プリセットの複製**: 既存のプリセットをコピーして新規作成
- **プリセットのインポート/エクスポート**: JSON形式でプリセットを保存・共有

### フィールド定義
- **カスタマイズ可能なフィールド**: 編集したいpackage.jsonのフィールドを自由に定義
- **複数のフィールドタイプ**: 
  - テキスト (`text`)
  - 数値 (`number`)
  - 真偽値 (`boolean`)
  - 選択 (`select`)
- **ネストされたキーパス対応**: `config.theme.color` のような階層構造も編集可能
- **ドラッグ&ドロップで並び替え**: フィールドの表示順序を自由に変更
- **サンプルから自動生成**: 既存のpackage.jsonからフィールド定義を自動生成

### ユーザー体験
- **多言語対応**: 日本語と英語に対応
- **直感的なUI**: Material-UIベースのモダンなデザイン
- **リアルタイムプレビュー**: 設定したフィールドの構造をプレビュー
- **エラーハンドリング**: わかりやすいエラーメッセージ

## 🛠️ 技術スタック

### コア
- **React 18.3.1**: UIフレームワーク
- **TypeScript 5.8.3**: 型安全性
- **Vite 5.4.19**: ビルドツール

### UIライブラリ
- **Material-UI (MUI) 7.3.6**: メインUIコンポーネント
- **Radix UI**: アクセシブルなUIコンポーネント
- **Tailwind CSS 3.4.17**: ユーティリティCSS

### 機能ライブラリ
- **@dnd-kit**: ドラッグ&ドロップ機能
- **JSZip 3.10.1**: ZIPファイル処理
- **React Router 6.30.1**: ルーティング
- **React Query 5.83.0**: データフェッチング
- **React Hook Form 7.61.1**: フォーム管理
- **Zod 3.25.76**: スキーマバリデーション
- **Lodash-es 4.17.22**: ユーティリティ関数

### 開発ツール
- **ESLint**: コード品質チェック
- **TypeScript ESLint**: TypeScript用リンター

## 📁 プロジェクト構造

```
package-maestro/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── DropZone.tsx    # ファイルドロップゾーン
│   │   ├── EditorForm.tsx  # メインエディタフォーム
│   │   ├── SettingsPanel.tsx # プリセット設定パネル
│   │   ├── FieldDialog.tsx # フィールド追加/編集ダイアログ
│   │   ├── Header.tsx      # ヘッダーコンポーネント
│   │   └── ...
│   ├── hooks/              # カスタムフック
│   │   ├── usePresets.ts   # プリセット管理ロジック
│   │   └── useFileHandler.ts # ファイル操作ロジック
│   ├── i18n/               # 国際化
│   │   ├── LanguageContext.tsx
│   │   └── translations.ts
│   ├── pages/              # ページコンポーネント
│   │   ├── Index.tsx       # メインページ
│   │   └── NotFound.tsx
│   ├── types/              # TypeScript型定義
│   │   └── index.ts
│   ├── lib/                # ユーティリティ
│   │   └── utils.ts
│   ├── App.tsx             # アプリケーションルート
│   └── main.tsx            # エントリーポイント
├── public/                 # 静的ファイル
├── package.json
├── vite.config.ts          # Vite設定
├── tsconfig.json           # TypeScript設定
└── tailwind.config.ts     # Tailwind設定
```

## 🚀 セットアップと実行

### 前提条件
- Node.js 18以上（またはBun）
- パッケージマネージャー: npm, yarn, pnpm, または bun

### インストール

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install

# bun
bun install
```

### 開発サーバー起動

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev

# bun
bun run dev
```

開発サーバーは `http://localhost:8080` で起動します。

### ビルド

```bash
# 本番ビルド
npm run build

# 開発モードビルド
npm run build:dev
```

### プレビュー

```bash
npm run preview
```

## 💡 使い方

### 1. ファイルを開く
- ドラッグ&ドロップでpackage.jsonファイルを開く
- または「ファイルを開く」ボタンをクリック
- ZIPファイル内のpackage.jsonも編集可能

### 2. プリセットを設定
- ヘッダーの設定アイコンをクリック
- 「フィールドを追加」で編集したいフィールドを定義
- キーパス（例: `version`, `name`, `config.theme.color`）を指定
- フィールドタイプ（テキスト、数値、真偽値、選択）を選択

### 3. ファイルを編集
- 定義したフィールドがフォームとして表示される
- 値を変更して「保存する」をクリック
- File System Access API対応ブラウザでは直接保存
- それ以外のブラウザでは自動的にダウンロード

### 4. プリセットの管理
- 複数のプリセットを作成して用途別に使い分け
- プリセットをエクスポートして共有
- サンプルpackage.jsonから自動的にフィールドを生成

## 🌐 ブラウザ対応

### フル機能対応
- **Google Chrome** (推奨)
- **Microsoft Edge**
- **その他のChromium系ブラウザ**

これらのブラウザでは、File System Access APIを使用してファイルを直接保存できます。

### 制限付き対応
- **Firefox**: ファイルの直接保存はできませんが、ダウンロード形式で保存可能
- **Safari**: ファイルの直接保存はできませんが、ダウンロード形式で保存可能

## 📝 実装状況

### ✅ 実装済み機能

- [x] ファイルのドラッグ&ドロップ
- [x] JSONファイルの読み込み・編集・保存
- [x] ZIPファイル内のpackage.json編集
- [x] File System Access APIによる直接保存
- [x] プリセット管理（作成、削除、複製、切り替え）
- [x] フィールド定義（追加、編集、削除、並び替え）
- [x] 複数のフィールドタイプ（text, number, boolean, select）
- [x] ネストされたキーパス対応
- [x] サンプルファイルからのフィールド自動生成
- [x] プリセットのインポート/エクスポート
- [x] 多言語対応（日本語/英語）
- [x] レスポンシブデザイン
- [x] エラーハンドリング
- [x] ブラウザ互換性チェック

### 🔄 今後の改善案

- [ ] フィールドのバリデーションルール設定
- [ ] フィールドの条件付き表示
- [ ] プリセットのテンプレート機能
- [ ] 履歴管理（Undo/Redo）
- [ ] 複数ファイルの一括編集
- [ ] プラグインシステム
- [ ] クラウド同期機能

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。大きな変更を提案する場合は、まずイシューを開いて変更内容を議論してください。

## 📄 ライセンス

このプロジェクトはプライベートプロジェクトです。

## 👤 作成者

**Akimasa Sugai**

---

**Package Maestro** - package.json編集を簡単に、誰でも。
