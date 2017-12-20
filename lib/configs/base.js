module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },

  env: {
    browser: true,
    node: true,
    es6: true
  },

  plugins: [
    "ember-addons"
  ],
};