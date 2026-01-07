import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "out", "coverage"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // 未使用変数はエラー（_プレフィックスで無視可能）
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      // 警告コメント禁止
      "no-warning-comments": [
        "error",
        {
          terms: ["fixme", "xxx", "todo"],
          location: "anywhere",
        },
      ],

      // IDの使用禁止
      "id-denylist": [
        "error",
        "useEffectOnce",
        "window", // windowの再定義を禁止
      ],

      // React関連ルール
      "react/jsx-uses-react": "off",
      "react/prop-types": "off", // TypeScriptで型チェックするため不要
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],

      // sxプロパティ禁止（パフォーマンス問題のため）
      "react/forbid-component-props": [
        "error",
        {
          forbid: [
            {
              propName: "sx",
              message:
                "Use of the sx prop is not advised due to performance issues. Consider using alternative styling methods instead.",
            },
          ],
        },
      ],

      // Hooksの依存配列チェック
      "react-hooks/exhaustive-deps": "error",

      // 制限付きインポート（MUIのパフォーマンス問題のあるAPIを禁止）
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@emotion/styled",
              importNames: ["styled"],
              message: "@emotion/styled has performance implications. Use tss-react/mui instead.",
            },
            {
              name: "@mui/material",
              importNames: ["styled"],
              message: "@mui/styled has performance implications. Use tss-react/mui instead.",
            },
            {
              name: "@mui/system",
              importNames: ["styled"],
              message: "@mui/styled has performance implications. Use tss-react/mui instead.",
            },
            {
              name: "@mui/material/styles/styled",
              message: "@mui/styled has performance implications. Use tss-react/mui instead.",
            },
            {
              name: "@mui/material",
              importNames: ["Box"],
              message: "@mui/Box has performance implications. Use tss-react/mui instead.",
            },
            {
              name: "@mui/system",
              importNames: ["Box"],
              message: "@mui/Box has performance implications. Use tss-react/mui instead.",
            },
          ],
        },
      ],

      // 制限付き構文
      "no-restricted-syntax": [
        "error",
        // ゲッター/セッター禁止
        {
          selector: "MethodDefinition[kind='get'], Property[kind='get']",
          message: "Property getters are not allowed; prefer function syntax instead.",
        },
        {
          selector: "MethodDefinition[kind='set'], Property[kind='set']",
          message: "Property setters are not allowed; prefer function syntax instead.",
        },
        // console制限（warn, error, debug, assertのみ許可）
        {
          selector:
            "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|debug|assert)$/]",
          message: "Unexpected property on console object was called",
        },
        // null禁止（undefinedを推奨）
        // ただし、JSON.stringifyの第2引数とブラウザAPIの型定義は除外
        {
          selector: "TSNullKeyword[parent.parent.callee.name!='JSON.stringify'], Literal[raw='null'][parent.parent.callee.name!='JSON.stringify']",
          message:
            "Prefer undefined instead of null. When required for React refs/components, use the `ReactNull` alias. Otherwise, if strictly necessary, disable this error with `// eslint-disable-next-line no-restricted-syntax`.",
        },
        // setTimeout/setIntervalの引数チェック
        {
          selector: "CallExpression[callee.name='setTimeout'][arguments.length<2]",
          message: "`setTimeout()` must be invoked with at least two arguments.",
        },
        {
          selector: "CallExpression[callee.name='setInterval'][arguments.length<2]",
          message: "`setInterval()` must be invoked with at least two arguments.",
        },
        // Promise.race禁止
        {
          selector: "CallExpression[callee.object.name='Promise'][callee.property.name='race']",
          message:
            "Promise.race is banned due to potential issues. Use alternative async patterns instead.",
        },
      ],

      // TypeScript固有のルール
      "@typescript-eslint/explicit-member-accessibility": "error",
      // 型情報が必要なルール（パフォーマンスに影響する可能性があるため、オフにしています）
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-inferrable-types": "off", // 明示的な型指定を許可
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/switch-exhaustiveness-check": "off",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/prefer-regexp-exec": "off",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
        },
      ],

      // ループ内の関数禁止
      "no-loop-func": "error",
    },
  },
  // テストファイルとストーリーファイル用のオーバーライド
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "react/forbid-component-props": "off",
    },
  },
);
