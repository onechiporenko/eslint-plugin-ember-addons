/**
 * @fileoverview Check if page or component for page-object exists
 * @author onechiporenko
 */
"use strict";

const fs = require("fs");
const path = require("path");
const pageObject = require("../utils/page-object");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Check if page or component for page-object exists",
      category: "ember-cli-page-object",
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      {
        type: "object",
        properties: {
          ignoredComponents: {
            type: "array",
            items: {
              type: "string"
            }
          },
          ignoredPages: {
            type: "array",
            items: {
              type: "string"
            }
          },
          scope: {
            type: "string",
            enum: ["all", "components", "pages"]
          }
        },
        additionalProperties: false
      }
    ]
  },

  create: function (context) {

    const ignoredEmberRoutes = ["index.js", "loading.js", "error.js"];
    const opts = context.options[0] || {};

    const ignoredComponents = opts.hasOwnProperty("ignoredComponents") ? opts.ignoredComponents.map(c => pageObject.addExtension(c)) : [];
    const ignoredPages = opts.hasOwnProperty("ignoredPages") ? opts.ignoredPages.map(p => pageObject.addExtension(p)) : [];
    const scope = opts.scope || "all";

    return {

      "Program": function (node) {
        const fileName = pageObject.getFilename(context);
        if (pageObject.shouldSkipFile(fileName, scope)) {
          return;
        }
        if (pageObject.isComponentOpm(fileName)) {
          const cPaths = pageObject.getComponentPathsByItsOpmPath(fileName);
          if (ignoredComponents.indexOf(cPaths.appPath) !== -1) {
            return;
          }
          if (!fs.existsSync(cPaths.fullPath)) {
            context.report({
              message: `"${pageObject.opmComponentsPath}/${cPaths.appPath}" doesn't match any component`,
              node
            });
          }
          return;
        }
        if (pageObject.isPageOpm(fileName)) {
          if (ignoredEmberRoutes.indexOf(path.basename(fileName)) !== -1) {
            return;
          }
          const rPaths = pageObject.getRoutePathsByItsOpmPath(fileName);
          if (ignoredPages.indexOf(rPaths.appPath) !== -1) {
            return;
          }
          if (!fs.existsSync(rPaths.fullPath)) {
            context.report({
              message: `"${pageObject.opmPagesPath}/${rPaths.appPath}" doesn't match any route`,
              node
            });
          }
        }
      }

    };
  }
};
