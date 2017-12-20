/**
 * @fileoverview Check `export` for each page-object
 * @author onechiporenko
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const sinon = require("sinon");
const pageObject = require("../../../lib/utils/page-object");

const rule = require("../../../lib/rules/page-object-exports"),

  RuleTester = require("eslint").RuleTester;

RuleTester.it = function (text, method) {
  // more hacks!
  it(text, () => {
    try{
      sinon.stub(pageObject, "shouldSkipFile").callsFake(() => false);
      method.call(this);
    }
    catch(e) {
      throw e;
    }
    finally {
      pageObject.shouldSkipFile.restore();
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

ruleTester.run("page-object-exports", rule, {

  valid: [
    `export const definition = {};
    export default create(definition);`,

    `export let definition = {};
    export default create(definition);`,

    `export var definition = {};
    export default create(definition);`,

    {
      code: `export const d = {};
      export default c(d);`,
      options: [{
        definition: "d",
        create: "c"
      }]
    },

    `export const definition = {};
    export const something = [];
    export default create(definition);`
  ],

  invalid: [
    {
      code: "export const definition = {};",
      errors: [{
        message: "Default export must be - \"export default create(definition);\"",
        type: "Program"
      }]
    },
    {
      code: "export const d = {};",
      options: [{
        definition: "d",
        create: "c"
      }],
      errors: [{
        message: "Default export must be - \"export default c(d);\"",
        type: "Program"
      }]
    },
    {
      code: "export default create(fake);",
      errors: [{
        message: "Default export must be - \"export default create(definition);\"",
        type: "ExportDefaultDeclaration"
      },{
        message: "At least one export must be - \"export const definition = ...;\"",
        type: "Program"
      }]
    },
    {
      code: "export default c(fake);",
      options: [{
        definition: "d",
        create: "c"
      }],
      errors: [{
        message: "Default export must be - \"export default c(d);\"",
        type: "ExportDefaultDeclaration"
      },{
        message: "At least one export must be - \"export const d = ...;\"",
        type: "Program"
      }]
    }
  ]
});