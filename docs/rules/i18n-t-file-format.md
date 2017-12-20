# Checks translations-json format (i18n-t-file-format)

Translation-files may contain nested objects and dotted keys (see [ember-i18n: Defining Translations](https://github.com/jamesarosen/ember-i18n/wiki/Doc:-Defining-Translations)). Combining both styles inside one file is not a good idea.  

Rule is applied only for `app/locales/**/translations.js`-files!

## Rule Details

This rule enforces the consistent use of nested object or dotted keys.

### Options

This rule has one string option:

* `nested` dot is not allowed in the translation keys.

* `dotted` nested objects are not allowed. All translation keys must be on the top level. 

### `nested`

Examples of **incorrect** code for this rule with the default `"nested"` option:

```javascript
/*eslint ember-addons/i18n-t-file-format: ["error", "nested"]*/
/*eslint-env es6*/
export default {
  "a.b": "some message"
};
```

Examples of **correct** code for this rule with the default `"nested"` option:

```javascript
/*eslint ember-addons/i18n-t-file-format: ["error", "nested"]*/
/*eslint-env es6*/
export default {
  a: {
    b: "some message"
  }
};
```

### `dotted`

Examples of **incorrect** code for this rule with the `"dotted"` option:

```javascript
/*eslint ember-addons/i18n-t-file-format: ["error", "dotted"]*/
/*eslint-env es6*/
export default {
  a: {
    b: "some message"
  }
};
```

Examples of **correct** code for this rule with the `"dotted"` option:

```javascript
/*eslint ember-addons/i18n-t-file-format: ["error", "dotted"]*/
/*eslint-env es6*/
export default {
  "a.b": "some message"
};
```