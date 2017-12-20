/**
 * @fileoverview Check `export` for each page-object
 * @author onechiporenko
 */
"use strict";

const pageObject = require("../utils/page-object");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Check `export` for each page-object",
      category: "ember-cli-page-object",
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      {
        type: "object",
        properties: {
          definition: {
            type: "string"
          },
          create: {
            type: "string"
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

    const opts = context.options[0] || {};

    const definitionName = opts.definition || "definition";
    const createName = opts.create || "create";
    const scope = opts.scope || "components";

    let skipFile = false;

    let namedExportIsValid = false;
    let defaultExportIsValid = false;
    let defaultExportIsReported = false;

    return {

      "ExportNamedDeclaration": function (node) {
        if (skipFile) {
          return;
        }
        let d = node.declaration;
        if (!d || d.type !== "VariableDeclaration") {
          return;
        }
        d = d.declarations;
        if (d.length !== 1) {
          return;
        }
        d = d[0];
        if (d.type !== "VariableDeclarator") {
          return;
        }
        if (d.id.type !== "Identifier" || d.id.name !== definitionName) {
          return;
        }
        namedExportIsValid = true;
      },

      "ExportDefaultDeclaration": function (node) {
        if (skipFile) {
          return;
        }
        let n = node.declaration;
        if (n.type !== "CallExpression") {
          return;
        }
        if (n.callee.name !== createName) {
          return;
        }
        let args = n.arguments;
        if (args.length !== 1) {
          return;
        }
        if (args[0].type !== "Identifier" || args[0].name !== definitionName) {
          return;
        }
        defaultExportIsValid = true;
      },

      "ExportDefaultDeclaration:exit": function (node) {
        if (skipFile) {
          return;
        }
        if (!defaultExportIsValid) {
          defaultExportIsReported = true;
          context.report({
            message: `Default export must be - "export default ${createName}(${definitionName});"`,
            node
          });
        }
      },

      "Program": function () {
        const fileName = pageObject.getFilename(context);
        if (pageObject.shouldSkipFile(fileName, scope)) {
          skipFile = true;
        }
      },

      "Program:exit": function (node) {
        if (skipFile) {
          return;
        }
        if (!namedExportIsValid) {
          context.report({
            message: `At least one export must be - "export const ${definitionName} = ...;"`,
            node
          });
        }
        if (!defaultExportIsValid && !defaultExportIsReported) {
          context.report({
            message: `Default export must be - "export default ${createName}(${definitionName});"`,
            node
          });
        }
      }

    };
  }
};
