# eslint-plugin-ember-addons

[![Build Status](https://travis-ci.org/onechiporenko/eslint-plugin-ember-addons.svg?branch=master)](https://travis-ci.org/onechiporenko/eslint-plugin-ember-addons)
[![npm version](https://badge.fury.io/js/eslint-plugin-ember-addons.png)](http://badge.fury.io/js/eslint-plugin-ember-addons)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
[![Downloads](http://img.shields.io/npm/dm/eslint-plugin-ember-addons.svg)](https://www.npmjs.com/package/eslint-plugin-ember-addons)

Several rules for ember-addons:

* [ember-cli-page-object](https://github.com/san650/ember-cli-page-object)
* [ember-i18n](https://github.com/jamesarosen/ember-i18n)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-ember-addons`:

```
$ npm install eslint-plugin-ember-addons --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-ember-addons` globally.

## Usage

Add `ember-addons` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": [
    "ember-addons"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:ember-addons/recommended"
  ]
}
```

## Supported Rules

| Rule | Description |
|----- | ------------|
| [i18n-t-file-format](./docs/rules/i18n-t-file-format.md)| Checks translations-json format |
| [i18n-t-files-eq](./docs/rules/i18n-t-files-eq.md) | Checks that translation-jsons match default one |
| [page-object-exports](./docs/rules/page-object-exports.md) | Check `export` for each page-object |
| [page-object-match](./docs/rules/page-object-match.md) | Check if page or component for page-object exists |