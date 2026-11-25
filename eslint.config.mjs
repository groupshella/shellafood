import js from "@eslint/js";
import tseslint from "typescript-eslint";

const noopRule = {
  meta: { type: "suggestion", schema: [] },
  create() {
    return {};
  },
};

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "postman/**",
      "next.config.mjs",
      "postcss.config.mjs",
      "eslint.config.mjs",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": { rules: { "exhaustive-deps": noopRule } },
      "@next/next": { rules: { "no-img-element": noopRule } },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
    },
  },
);
