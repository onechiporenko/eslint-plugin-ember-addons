# Checks that translation-jsons match default one (i18n-t-files-eq)

Rule compares translation-files with default translations-file.

## Rule Details

Rule will alert next:

* Key exists in the default translations-file but it's not found in the current translations-file.

* Key exists in the current translations-file but it's not found in the default translations-file.

* Values from default and current locales for same key are equal.

### Options

This rule has one string option. It's name of your default translation. Value `en` is used by default. This value is used to get content of default translations-file (for `en` it will be `app/locales/en/translations.js`).

Example of the default locale (`app/locales/en/translations.js`):

```javascript
export default {
  reg: "Registration",
  labels: {
    firstName: "First Name"
  }
};
```

Examples of **incorrect** locale `app/locales/fr/translations.js`:

```javascript
/*eslint ember-addons/i18n-t-files-eq: ["error", "en"]*/
/*eslint-env es6*/

// `reg` key is missing
export default {
  labels: {
    firstName: "Prénom"
  }
};
```

```javascript
/*eslint ember-addons/i18n-t-files-eq: ["error", "en"]*/
/*eslint-env es6*/

export default {
  reg: "Enregistrement",
  labels: {
    firstName: "Prénom",
    lastName: "Nom de famille" // `labels.lastName` doesn't exists in the default locale
  }
};
```

```javascript
/*eslint ember-addons/i18n-t-files-eq: ["error", "en"]*/
/*eslint-env es6*/

export default {
  reg: "Enregistrement",
  labels: {
    firstName: "First Name", // `labels.firstName` is the same as in the default locale
  }
};
```

Example of **correct** locale `app/locales/fr/translations.js`:

```javascript
/*eslint ember-addons/i18n-t-files-eq: ["error", "en"]*/
/*eslint-env es6*/

export default {
  reg: "Enregistrement",
  labels: {
    firstName: "Prénom"
  }
};
```