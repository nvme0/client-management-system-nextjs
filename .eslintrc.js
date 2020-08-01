module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "react/react-in-jsx-scope": "off", // needed for NextJS's jsx without react import
    "react/prop-types": "off", // Disable prop-types as we use TypeScript for type checking
    "@typescript-eslint/explicit-function-return-type": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    // more config...
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/camelcase": 1,
    "react/display-name": "off",
    "react/jsx-key": "off",
    "react/jsx-space-before-closing": ["error", "always"],
    "react/jsx-equals-spacing": ["error", "never"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn"],
    "no-alert": ["warn"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "never",
        named: "never",
        asyncArrow: "always"
      }
    ],
    "spaced-comment": ["error", "always", { markers: ["="] }],
    "object-curly-spacing": ["error", "always"],
    "space-in-parens": ["error", "never"],
    "comma-spacing": ["error", { before: false, after: true }],
    camelcase: [1, { properties: "always" }]
  },
  globals: { React: "writable" }
};
