/**
 * Warning! This file contains as many hacks as possible. You won't be glad to edit it
 *
 * @fileoverview Check if route for page object exists
 * @author onechiporenko
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require("fs");
const sinon = require("sinon");

const pageObject = require("../../../lib/utils/page-object");

const rule = require("../../../lib/rules/page-object-match"),

  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

let filenames = [
  "components/a-b.js",
  "components/a-b/c-d.js",
  "a-b.js",
  "a-b/c-d.js",
  "index.js",
  "loading.js",
  "error.js",
  "a-b/index.js",
  "a-b/loading.js",
  "a-b/error.js"
];
let i = 0;
RuleTester.it = function (text, method) {
  // more hacks!
  it(text, () => {
    try {
      sinon.stub(fs, "existsSync").callsFake(() => true);
      sinon.stub(pageObject, "getFilename").callsFake(() => "/root/tests/pages/" + filenames[i]);
      method.call(this);
    }
    catch (e) {
      throw e;
    }
    finally {
      i++;
      fs.existsSync.restore();
      pageObject.getFilename.restore();
    }
  });
};

let ruleTester = new RuleTester();
// no matter what is files content
ruleTester.run("page-object-match", rule, {
  valid: filenames.map(f => `/* '${f}' */`),
  invalid: []
});

/*                           *\
 * ***************************
 * Needed file doesn't exist *
 * ***************************
 \*                           */

filenames = [
  "index.js",
  "loading.js",
  "error.js",
  "a-b/index.js",
  "a-b/loading.js",
  "a-b/error.js",
  "components/a-b.js",
  "components/a-b/c-d.js",
  "a-b.js",
  "a-b/c-d.js"
];
const msgs = [
  "", "", "", "", "", "",
  "\"tests/pages/components/a-b.js\" doesn't match any component",
  "\"tests/pages/components/a-b/c-d.js\" doesn't match any component",
  "\"tests/pages/a-b.js\" doesn't match any route",
  "\"tests/pages/a-b/c-d.js\" doesn't match any route",
];
let j = 0;
RuleTester.it = function (text, method) {
  // more hacks!
  it(text, () => {
    try {
      sinon.stub(fs, "existsSync").callsFake(() => false);
      sinon.stub(pageObject, "getFilename").callsFake(() => "/root/tests/pages/" + filenames[j]);
      method.call(this);
    }
    catch (e) {
      throw e;
    }
    finally {
      j++;
      fs.existsSync.restore();
      pageObject.getFilename.restore();
    }
  });
};

const validCount = 6;
ruleTester = new RuleTester();
ruleTester.run("page-object-match", rule, {
  valid: filenames.slice(0, validCount).map(f => `/* '${f}' */`),
  invalid: filenames.slice(validCount).map((f, index) => {
    return {
      code: `/* '${f}' */`,
      errors: [
        {
          message: msgs[validCount + index],
          type: "Program"
        }
      ]
    }
  }),
});
