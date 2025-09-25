import js from "@eslint/js"
import pluginN from "eslint-plugin-n"
import pluginPromise from "eslint-plugin-promise"
import pluginJson from "eslint-plugin-json"
import nextPlugin from "@next/eslint-plugin-next"

export default [
  {
    ignores: ["public/.next/**", "eslint.config.mjs"]
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  js.configs.recommended,
  pluginPromise.configs["flat/recommended"],
  {
    ...nextPlugin.flatConfig.coreWebVitals,
    files: [
      "public/**/*.{js,jsx,ts,tsx}",
      "pages/**/*.{js,jsx,ts,tsx}",
      "app/**/*.{js,jsx,ts,tsx}",
      "components/**/*.{js,jsx,ts,tsx}"
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      next: {
        rootDir: ["./public"]
      }
    }
  },
  {
    files: [
      "public/**/*.{js,jsx,ts,tsx}",
      "pages/**/*.{js,jsx,ts,tsx}",
      "app/**/*.{js,jsx,ts,tsx}",
      "components/**/*.{js,jsx,ts,tsx}"
    ],
    rules: {
      "no-unused-vars": "off"
    }
  },
  {
    rules: {
      "promise/always-return": "off",
      "promise/catch-or-return": "off"
    }
  },
  pluginJson.configs.recommended,
  {
    ...pluginN.configs["flat/recommended"],
    files: ["./index.js"],
    languageOptions: {
      ...(pluginN.configs["flat/recommended"].languageOptions || {}),
      parserOptions: {
        ...(pluginN.configs["flat/recommended"].languageOptions?.parserOptions || {}),
        sourceType: "commonjs"
      }
    }
  }
]

