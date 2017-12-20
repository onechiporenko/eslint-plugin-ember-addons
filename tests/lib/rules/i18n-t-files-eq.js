/**
 * @fileoverview Checks that translation-jsons match default one
 * @author onechiporenko
 */
"use strict";

const sinon = require("sinon");
const i18n = require("../../../lib/utils/i18n");

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/i18n-t-files-eq"),

  RuleTester = require("eslint").RuleTester;

RuleTester.it = function (text, method) {
  // more hacks!
  it(text, () => {
    try{
      sinon.stub(i18n, "shouldSkipFile").callsFake(() => false);
      sinon.stub(i18n, "readTranslationsFile").callsFake(() => `export default {
        a: "b",
        c: {
          d: "e"
        }
      };`);
      method.call(this);
    }
    catch(e) {
      throw e;
    }
    finally {
      i18n.shouldSkipFile.restore();
      i18n.readTranslationsFile.restore();
    }
  });
};


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  }
});
ruleTester.run("i18n-t-files-eq", rule, {

  valid: [
    `export default {
      a: "z",
      c: {
        d: "y"
      }
    }`,
    `export default {
      c: {
        d: "y"
      },
      a: "z"
    }`
  ],

  invalid: [
    {
      code: `export default {
        a: "z",
        c: {
        }
      }`,
      errors: [{
        message: "Key 'c.d' exists in the default locale (en) and is missing in this one",
        type: "Program"
      }]
    },
    {
      code: `export default {
        c: {
          d: "y"
        },
      }`,
      errors: [{
        message: "Key 'a' exists in the default locale (en) and is missing in this one",
        type: "Program"
      }]
    },
    {
      code: `export default {
        c: {
          d: "y"
        },
      }`,
      options: ["ru"],
      errors: [{
        message: "Key 'a' exists in the default locale (ru) and is missing in this one",
        type: "Program"
      }]
    },
    {
      code: `export default {
        a: "b",
        c: {
          d: "y"
        },
      }`,
      errors: [{
        message: "Translated value for key 'a' is equal to default one",
        type: "Property"
      }]
    },
    {
      code: `export default {
        a: "z",
        c: {
          d: "e"
        },
      }`,
      errors: [{
        message: "Translated value for key 'c.d' is equal to default one",
        type: "Property"
      }]
    },
    {
      code: `export default {
        a: "z",
        c: {
          d: "y"
        },
        f: "x"
      }`,
      errors: [{
        message: "Key 'f' doesn't exist in the default translations (en)",
        type: "Property"
      }]
    },
    {
      code: `export default {
        a: "z",
        c: {
          d: "y"
        },
        f: {
          g: "x"
        }
      }`,
      errors: [{
        message: "Key 'f.g' doesn't exist in the default translations (en)",
        type: "Property"
      }]
    },
    {
      code: `export default {
        a: "z",
        c: {
          d: "y"
        },
        f: "x"
      }`,
      options: ["ru"],
      errors: [{
        message: "Key 'f' doesn't exist in the default translations (ru)",
        type: "Property"
      }]
    }
  ]
});
