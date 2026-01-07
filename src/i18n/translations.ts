export type Language = 'ja' | 'en';

export const translations = {
  ja: {
    // Header
    appTitle: 'Package.json Editor',
    appSubtitle: 'GUI設定ツール',
    backToEditor: 'エディタに戻る',
    presetSettings: 'プリセット設定',

    // DropZone
    dropzoneTitle: 'package.jsonをここにドロップ',
    dropzoneSubtitle: 'または下のボタンをクリックしてファイルを選択',
    openFile: 'ファイルを開く',
    supportedFormats: '対応形式: .json, .zip',
    loading: '読み込み中...',
    dropHere: 'ここにドロップしてください',

    // EditorForm
    editingFile: '編集中:',
    zipFile: 'ZIPファイル',
    noFieldsDefined: 'フィールドが定義されていません',
    goToSettings: '設定画面でフィールドを追加してください',
    openSettings: '設定を開く',
    save: '保存する',
    closeFile: 'ファイルを閉じる',
    saveSuccess: '保存しました！',
    saveError: '保存に失敗しました',
    selectOption: '選択してください',

    // SettingsPanel
    settingsTitle: 'プリセット設定',
    presetName: 'プリセット名',
    fieldList: 'フィールド一覧',
    addField: 'フィールドを追加',
    noFields: 'フィールドがありません。「フィールドを追加」ボタンから追加してください。',
    keyPath: 'キーパス',
    label: 'ラベル',
    type: '種類',
    actions: '操作',
    importExport: 'インポート / エクスポート',
    export: 'エクスポート',
    import: 'インポート',
    resetDefault: 'デフォルトに戻す',
    confirmReset: '設定をデフォルトに戻しますか？',
    importSuccess: '設定をインポートしました',
    importError: '設定のインポートに失敗しました',

    // FieldDialog
    addFieldTitle: 'フィールドを追加',
    editFieldTitle: 'フィールドを編集',
    keyPathHelper: '例: version, config.theme.color',
    labelHelper: 'フォームに表示される名前',
    fieldType: 'フィールドタイプ',
    selectOptions: '選択肢（カンマ区切り）',
    selectOptionsHelper: '例: option1, option2, option3',
    cancel: 'キャンセル',
    add: '追加',
    update: '更新',

    // Field Types
    typeText: 'テキスト',
    typeNumber: '数値',
    typeBoolean: '真偽値',
    typeSelect: '選択',

    // BrowserWarning
    browserNotSupported: 'ブラウザ非対応',
    browserWarningMessage: 'このアプリケーションはFile System Access APIを使用しており、Chromium系ブラウザでのみ動作します。',
    browserWarningInstruction: 'フル機能をご利用いただくには、Google ChromeまたはMicrosoft Edgeをお使いください。',
    downloadChrome: 'Chromeをダウンロード',
    downloadEdge: 'Edgeをダウンロード',
  },
  en: {
    // Header
    appTitle: 'Package.json Editor',
    appSubtitle: 'GUI Configuration Tool',
    backToEditor: 'Back to Editor',
    presetSettings: 'Preset Settings',

    // DropZone
    dropzoneTitle: 'Drop package.json here',
    dropzoneSubtitle: 'Or click the button below to select a file',
    openFile: 'Open File',
    supportedFormats: 'Supported formats: .json, .zip',
    loading: 'Loading...',
    dropHere: 'Drop here',

    // EditorForm
    editingFile: 'Editing:',
    zipFile: 'ZIP file',
    noFieldsDefined: 'No fields defined',
    goToSettings: 'Please add fields in the settings panel',
    openSettings: 'Open Settings',
    save: 'Save',
    closeFile: 'Close File',
    saveSuccess: 'Saved successfully!',
    saveError: 'Failed to save',
    selectOption: 'Select an option',

    // SettingsPanel
    settingsTitle: 'Preset Settings',
    presetName: 'Preset Name',
    fieldList: 'Field List',
    addField: 'Add Field',
    noFields: 'No fields defined. Click "Add Field" to create one.',
    keyPath: 'Key Path',
    label: 'Label',
    type: 'Type',
    actions: 'Actions',
    importExport: 'Import / Export',
    export: 'Export',
    import: 'Import',
    resetDefault: 'Reset to Default',
    confirmReset: 'Reset settings to default?',
    importSuccess: 'Settings imported successfully',
    importError: 'Failed to import settings',

    // FieldDialog
    addFieldTitle: 'Add Field',
    editFieldTitle: 'Edit Field',
    keyPathHelper: 'e.g., version, config.theme.color',
    labelHelper: 'Display name in the form',
    fieldType: 'Field Type',
    selectOptions: 'Options (comma separated)',
    selectOptionsHelper: 'e.g., option1, option2, option3',
    cancel: 'Cancel',
    add: 'Add',
    update: 'Update',

    // Field Types
    typeText: 'Text',
    typeNumber: 'Number',
    typeBoolean: 'Boolean',
    typeSelect: 'Select',

    // BrowserWarning
    browserNotSupported: 'Browser Not Supported',
    browserWarningMessage: 'This application requires the File System Access API, which is only available in Chromium-based browsers.',
    browserWarningInstruction: 'Please use Google Chrome or Microsoft Edge for full functionality.',
    downloadChrome: 'Download Chrome',
    downloadEdge: 'Download Edge',
  },
} as const;

export type TranslationKey = keyof typeof translations.ja;
