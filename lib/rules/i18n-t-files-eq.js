/**
 * @fileoverview Checks that translation-jsons match default one
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
      description: "Checks that translation-jsons match default one",
      category: "ember-i18n",
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: [
      {type: "string"}
    ]
  },

  create: function (context) {
    let skipFile = false;
    let isInsideTranslations = false;

    const defaultLocale = context.options[0] || "en";

    let defaultTranslations = {};
    const currentTranslations = {};

    return {

      "Program": function () {
        const fileName = context.getFilename();
        if (i18n.shouldSkipFile(fileName, defaultLocale)) {
          skipFile = true;
          return;
        }
        const defaultLocalFileName = i18n.getDefaultLocaleFileName(fileName, defaultLocale);
        defaultTranslations = i18n.getTranslations(i18n.readTranslationsFile(defaultLocalFileName));
      },

      "Program:exit": function (node) {
        Object.keys(defaultTranslations).forEach(key => {
          if (!currentTranslations[key]) {
            context.report({
              message: "Key '{{key}}' exists in the default locale ({{defaultLocale}}) and is missing in this one",
              data: {key, defaultLocale},
              node
            });
          }
        });
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
        const key = i18n.getTranslationFullKey(node);
        if (node.value.type !== "ObjectExpression") {
          currentTranslations[key] = node.value.value;
          if (defaultTranslations[key]) {
            if (defaultTranslations[key] === currentTranslations[key]) {
              context.report({
                message: "Translated value for key '{{key}}' is equal to default one",
                data: {key},
                node
              });
            }
          }
          else {
            context.report({
              message: "Key '{{key}}' doesn't exist in the default translations ({{defaultLocale}})",
              data: {key, defaultLocale},
              node
            });
          }
        }
      }

    };
  }
};
