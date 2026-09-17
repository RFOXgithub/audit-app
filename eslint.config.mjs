import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: { "react-hooks/set-state-in-effect": "off", "react-hooks/preserve-manual-memoization": "off", "@next/next/no-html-link-for-pages": "off" } },
  globalIgnores([".next/**", "generated/**"])
]);
