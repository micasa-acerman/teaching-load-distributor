module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        'jest/globals': true,
    },
    extends: ['eslint:recommended', 'prettier'],
    plugins: ['jest'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {},
}
