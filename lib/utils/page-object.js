"use strict";

const opmPagesPath = "tests/pages";
const opmComponentsPath = `${opmPagesPath}/components`;

const appRoutesPath = "app/routes";
const appComponentsPath = "app/components";

/**
 *
 * @param {string} fileName
 * @param {string} testedScope
 * @returns {boolean}
 */
function shouldSkipFile(fileName, testedScope) {
  const isPage = isPageOpm(fileName);
  const isComponent = isComponentOpm(fileName);
  return testedScope === "components" && !isComponent ||
    testedScope === "pages" && !(isPage && !isComponent) ||
    testedScope === "all" && !isPage;
}

/**
 *
 * @param {string} opmComponentPath
 * @returns {{fullPath: string, appPath: string}}
 */
function getComponentPathsByItsOpmPath(opmComponentPath) {
  const parentPath = opmComponentPath.substr(0, opmComponentPath.indexOf(opmComponentsPath));
  const componentPath = opmComponentPath.replace(parentPath, "").replace(opmComponentsPath, "").slice(1);
  return {
    fullPath: `${parentPath}${appComponentsPath}/${componentPath}`,
    appPath: componentPath
  };
}

/**
 *
 * @param {string} opmPagePath
 * @returns {{fullPath: string, appPath: string}}
 */
function getRoutePathsByItsOpmPath(opmPagePath) {
  const parentPath = opmPagePath.substr(0, opmPagePath.indexOf(opmPagesPath));
  const pagePath = opmPagePath.replace(parentPath, "").replace(opmPagesPath, "").slice(1);
  return {
    fullPath: `${parentPath}${appRoutesPath}/${pagePath}`,
    appPath: pagePath
  };
}

/**
 *
 * @param {string} path
 * @returns {boolean}
 */
function isComponentOpm(path) {
  return path.indexOf(opmComponentsPath) !== -1;
}

/**
 *
 * @param {string} path
 * @returns {boolean}
 */
function isPageOpm(path) {
  return path.indexOf(opmPagesPath) !== -1
}

/**
 *
 * @param {object} context
 * @returns {string}
 */
function getFilename(context) {
  return context.getFilename();
}

function addExtension(fileName, ext) {
  ext = ext || ".js";
  return fileName.indexOf(ext) === -1 ? fileName + ext : fileName;
}

module.exports = {
  getComponentPathsByItsOpmPath,
  getRoutePathsByItsOpmPath,
  isComponentOpm,
  isPageOpm,
  shouldSkipFile,
  getFilename,
  addExtension,
  opmPagesPath,
  opmComponentsPath
};