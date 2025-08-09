import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  // Add this section to disable type-aware linting
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: null, // This is the key change
      },
    },
    rules: {
      // You can also specifically turn off the rule if needed, but the above is usually enough
      "@typescript-eslint/no-misused-promises": "off",
    },
  },
];

export default eslintConfig;
