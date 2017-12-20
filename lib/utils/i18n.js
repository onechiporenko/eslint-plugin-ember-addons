"use strict";

const fs = require("fs");
const esprima = require("esprima");
const estraverse = require("estraverse");

/**
 *
 * @param {string} path
 * @param {string} [locale]
 * @returns {boolean}
 */
function shouldSkipFile(path, locale) {
  locale = locale || "";
  if(path.indexOf("/translations.js") === -1) {
    return true;
  }
  return !!(locale && path.indexOf(`${locale}/translations.js`) !== -1);
}

/**
 *
 * @param {string} customLocaleFileName
 * @param {string} defaultLocaleName
 * @returns {string}
 */
function getDefaultLocaleFileName(customLocaleFileName, defaultLocaleName) {
  return customLocaleFileName.replace(/locales\/\w{2}(-\w{2})?\//, `locales/${defaultLocaleName}/`);
}

/**
 * Can't be used inside `estraverse.traverse` because `node` must have a `parent`-property
 *
 * @param {ASTNode} node
 * @returns {string}
 */
function getTranslationFullKey(node) {
  let parent = node.parent;
  let path = [getKeyName(node)];
  while (parent) {
    path.push(getKeyName(parent));
    parent = parent.parent;
  }
  return path.reverse().filter(p => !!p).join(".");
}

/**
 *
 * Get name for nodes like property names in the
 *
 * ```json
 * {
 *   "a.b": "",
 *   c: ""
 * }
 * ```
 *
 * Here `a.b` and `c` are searched
 *
 * @param {ASTNode} node
 * @returns {string}
 */
function getKeyName(node) {
  return node.key ? node.key.name || node.key.value : "";
}

/**
 * Parse content of `app/locales/../translations.js` and return json with translations
 *
 * Example:
 *
 * ```js
 * export default {
 *   a: "a",
 *   b: {
 *     c: "c"
 *   }
 * };
 * ```
 *
 * Output:
 *
 * ```json
 * {
 *   "a": "a",
 *   "b.c": "c"
 * }
 * ```
 *
 * @param {string} fileContent
 * @returns object
 */
function getTranslations(fileContent) {
  const translations = {};
  if (!fileContent) {
    return {};
  }
  const ast = esprima.parseModule(fileContent);
  let insideTranslations = false;
  let namespace = [];
  estraverse.traverse(ast, {
    enter(node) {
      if (node.type === "ExportDefaultDeclaration") {
        insideTranslations = true;
      }
      if (node.type === "Property") {
        if(insideTranslations) {
          if (node.value.type === "ObjectExpression") {
            namespace.push(node.key.name || node.key.value);
          }
          else {
            let path = namespace.slice();
            path.push(getKeyName(node));
            path = path.join(".");
            translations[path] = node.value.value;
          }
        }
      }
    },
    leave(node) {
      if (node.type === "ExportDefaultDeclaration") {
        insideTranslations = false;
      }
      if (node.type === "ObjectExpression") {
        namespace = namespace.slice(0, -1);
      }
    }
  });
  return translations;
}

/**
 *
 * @param fileName
 * @returns {string}
 */
function readTranslationsFile(fileName) {
  return fs.existsSync(fileName) ? fs.readFileSync(fileName, "utf-8") : "";
}

module.exports = {
  getTranslations,
  getTranslationFullKey,
  readTranslationsFile,
  getDefaultLocaleFileName,
  getKeyName,
  shouldSkipFile
};