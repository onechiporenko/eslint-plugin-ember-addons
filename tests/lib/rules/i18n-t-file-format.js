/**
 * @fileoverview Checks translations-json format
 * @author onechiporenko
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const sinon = require("sinon");
const i18n = require("../../../lib/utils/i18n");

const rule = require("../../../lib/rules/i18n-t-file-format"),

  RuleTester = require("eslint").RuleTester;


RuleTester.it = function (text, method) {
  // more hacks!
  it(text, () => {
    try{
      sinon.stub(i18n, "shouldSkipFile").callsFake(() => false);
      method.call(this);
    }
    catch(e) {
      throw e;
    }
    finally {
      i18n.shouldSkipFile.restore();
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
ruleTester.run("i18n-t-file-format", rule, {

  valid: [
    `export default {
      a: "a",
      b: {c: "d"}
    };`,
    {
      code: `export default {
        a: "a",
        "b.c": "d",
        "e": "f"
      };`,
      options: ["dotted"]
    }
  ],

  invalid: [
    {
      code: `export default {
        "a.b": "c"
      };`,
      errors: [{
        message: "Dot is not allowed for translation keys. Use nested objects",
        type: "Property"
      }]
    },
    {
      code: `export default {
        a: {
          b: "c"
        }
      };`,
      options: ["dotted"],
      errors: [{
        message: "Nested objects are not allowed for translations. Use keys with dots",
        type: "Property"
      }]
    }
  ]
});
