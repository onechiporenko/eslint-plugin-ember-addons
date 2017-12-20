/**
 * @fileoverview Checks translations-json format
 * @author onechiporenko
 */
"use strict";

const i18n = require("../utils/i18n");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Checks translations-json format",
      category: "ember-i18n",
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      {
        enum: ["nested", "dotted"]
      }
    ]
  },

  create: function (context) {

    const neededType = context.options[0] || "nested";

    let skipFile = false;
    let isInsideTranslations = false;

    return {

      "Program": function () {
        if (i18n.shouldSkipFile(context.getFilename())) {
          skipFile = true;
        }
      },

      "ExportDefaultDeclaration": function(node) {
        if (skipFile) {
          return;
        }
        const d = node.declaration;
        if(d.type !== "ObjectExpression") {
          return;
        }
        isInsideTranslations = true;
      },

      "ExportDefaultDeclaration:exit": function() {
        isInsideTranslations = false;
      },

      "Property": function (node) {
        if (!isInsideTranslations) {
          return;
        }
        const keyName = i18n.getKeyName(node);
        const keyType = node.key.type;
        const valueType = node.value.type;
        if (neededType === "nested") {
          if (keyType !== "Literal" && keyType !== "Identifier") {
            return;
          }
          if (keyName.indexOf(".") !== -1) {
            context.report({
              message: "Dot is not allowed for translation keys. Use nested objects",
              node
            });
          }
        }
        if (neededType === "dotted") {
          if (valueType === "ObjectExpression") {
            context.report({
              message: "Nested objects are not allowed for translations. Use keys with dots",
              node
            });
          }
        }
      }

    };
  }
};
