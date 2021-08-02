module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "@vue/standard"],
    parserOptions: {
        parser: "babel-eslint"
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        quotes: "off",
        semi: "off",
        "comma-dangle": "off",
        "no-empty": "off",
        "no-regex-spaces": "off",
        indent: "off",
        "eol-last": "off",
        "func-call-spacing": "off",
        "spaced-comment": "off",
        "no-trailing-spaces": "off",
        "space-before-blocks": "off",
        "space-before-blocks": "off",
        "quote-props": "off",
        "no-useless-return": "off",
        "no-unused-vars": "off",
        "prefer-const": "off",
        "space-in-parens": "off",
        "space-before-function-paren": "off"
    }
}