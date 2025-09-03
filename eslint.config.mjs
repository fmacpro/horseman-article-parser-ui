import js from "@eslint/js"
import pluginN from "eslint-plugin-n"
import pluginPromise from "eslint-plugin-promise"
import pluginJson from "eslint-plugin-json"

export default [
  {
    ignores: ["public/**", "eslint.config.mjs"]
  },
  js.configs.recommended,
  pluginN.configs["flat/recommended"],
  pluginPromise.configs["flat/recommended"],
  {
    rules: {
      "promise/always-return": "off",
      "promise/catch-or-return": "off"
    }
  },
  pluginJson.configs.recommended
]

