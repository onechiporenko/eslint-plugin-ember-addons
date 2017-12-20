# Check `export` for each page-object (page-object-exports)

Each `page-object` has default export like `export default create({ ... })`. However sometimes not only `create`-result is needed exported and its definition to. In this case file should look like this:

```javascript
import {create} from 'ember-cli-page-object';

export const definition = { /* ... */ };
export default create(definition);
```

Rules expects that page-objects are located in the `tests/pages` (for routes) and `tests/pages/components` (for components).

## Rule Details

This rule aims enforces to do double-export from files with page-objects for components, pages or all of them.

Examples of **incorrect** code for this rule:

```javascript
/*eslint ember-addons/page-object-exports: ["error"]*/
/*eslint-env es6*/

import {create} from 'ember-cli-page-object';

export default create({});
```

Examples of **correct** code for this rule:

```javascript
/*eslint ember-addons/page-object-exports: ["error"]*/
/*eslint-env es6*/

import {create} from 'ember-cli-page-object';

export const definition = { /* ... */ };
export default create(definition);
```

### Options

This rule has one object-option with fields:

* `scope` - may be one of `"all"`, `"components"`, `"pages"`. It determines which files will be checked for double-export.

* `definition` - name of the exported definition. It's useful when all page-objects use the same one.

## When Not To Use It

You should not use this rule if you don't need definitions for page-objects.