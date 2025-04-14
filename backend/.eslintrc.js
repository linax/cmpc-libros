{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "prettier"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": [
      "error",
      {
        "semi": false,
        "singleQuote": true,
        "trailingComma": "all"
      }
    ]
  }
}
