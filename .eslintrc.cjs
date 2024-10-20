module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "@electron-toolkit",
    "@electron-toolkit/eslint-config-prettier"
  ],

  rules: {
    "linebreak-style": 0,
    "react/prop-types": 0
  }
};
