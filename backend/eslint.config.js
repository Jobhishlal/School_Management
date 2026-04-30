const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", "build/**"]
  }, 
 {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs
      },
      ecmaVersion: "latest",
      sourceType: "commonjs"
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn"
    }
  }
];

