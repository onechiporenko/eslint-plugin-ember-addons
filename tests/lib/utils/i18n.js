"use strict";

const expect = require("chai").expect;
const i18n = require("../../../lib/utils/i18n");

describe("#i18n", () => {

  describe("#getTranslations", () => {

    it("should parse translations into single-level json", () => {
      const source = `export default {
        a: "b", 
        b: {
          c: "d"
        }
      }`;
      expect(i18n.getTranslations(source)).to.be.eql({
        a: "b",
        "b.c": "d"
      });
    });

  });

  describe("#getKeyName", () => {

    it("should return empty", () => {
      expect(i18n.getKeyName({})).to.be.empty;
    });

    it("should return `name`", () => {
      expect(i18n.getKeyName({
        key: {
          name: "name"
        }
      })).to.be.equal("name");
    });

    it("should return `value`", () => {
      expect(i18n.getKeyName({
        key: {
          value: "value"
        }
      })).to.be.equal("value");
    });

  });

  describe("#shouldSkipFile", () => {

    it("should return `true` for non-translation files", () => {
      expect(i18n.shouldSkipFile("/root/app/locales/en/config.js")).to.be.true;
    });

    it("should return `true` for default locale", () => {
      expect(i18n.shouldSkipFile("/root/app/locales/en/translations.js", "en")).to.be.true;
    });

    it("should return `false` for translation files", () => {
      expect(i18n.shouldSkipFile("/root/app/locales/ru/translations.js")).to.be.false;
    });

    it("should return `false` for translation files (2)", () => {
      expect(i18n.shouldSkipFile("/root/app/locales/ru/translations.js", "en")).to.be.false;
    });

  });

  describe("#getDefaultLocaleFileName", () => {

    it("should return filepath", () => {
      expect(i18n.getDefaultLocaleFileName("/root/app/locales/en-US/translations.js", "ru")).to.be.equal("/root/app/locales/ru/translations.js");
    });

  });

});