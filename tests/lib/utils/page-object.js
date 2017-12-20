"use strict";

const expect = require("chai").expect;
const pageObject = require("../../../lib/utils/page-object");

describe("#pageObject", () => {

  describe("#shouldSkipFile", () => {

    const testCases = {
      pages: [
        {
          fileName: "/project/tests/pages/components/a-b.js",
          e: true
        },
        {
          fileName: "/project/tests/a-b.js",
          e: true
        },
        {
          fileName: "/project/tests/pages/a.js",
          e: false
        }
      ],
      components: [
        {
          fileName: "/project/tests/pages/components/a-b.js",
          e: false
        },
        {
          fileName: "/project/tests/pages/components/a-b/c-d.js",
          e: false
        },
        {
          fileName: "/project/tests/pages/a.js",
          e: true
        }
      ],
      all: [
        {
          fileName: "/project/tests/pages/components/a-b.js",
          e: false
        },
        {
          fileName: "/project/tests/pages/components/a-b/c-d.js",
          e: false
        },
        {
          fileName: "/project/tests/pages/a.js",
          e: false
        },
        {
          fileName: "/project/tests/a-b.js",
          e: true
        }
      ]
    };

    Object.keys(testCases).forEach(scope => {
      describe(`scope - ${scope}`, () => {
        testCases[scope].forEach(test => {
          it(`should be "${test.e}" for "${test.fileName}"`, () => {
            expect(pageObject.shouldSkipFile(test.fileName, scope)).to.be.equal(test.e);
          });
        });
      });
    });

  });

  describe("#getComponentPathsByItsOpmPath", () => {

    it("top level component", () => {
      expect(pageObject.getComponentPathsByItsOpmPath("/root/tests/pages/components/a-b.js")).to.be.eql({
        fullPath: "/root/app/components/a-b.js",
        appPath: "a-b.js"
      });
    });

    it("nested component", () => {
      expect(pageObject.getComponentPathsByItsOpmPath("/root/tests/pages/components/a-b/c-d.js")).to.be.eql({
        fullPath: "/root/app/components/a-b/c-d.js",
        appPath: "a-b/c-d.js"
      });
    });

  });

  describe("#getRoutePathsByItsOpmPath", () => {

    it("top level route", () => {
      expect(pageObject.getRoutePathsByItsOpmPath("/root/tests/pages/a-b.js")).to.be.eql({
        fullPath: "/root/app/routes/a-b.js",
        appPath: "a-b.js"
      });
    });

    it("nested route", () => {
      expect(pageObject.getRoutePathsByItsOpmPath("/root/tests/pages/a-b/c-d.js")).to.be.eql({
        fullPath: "/root/app/routes/a-b/c-d.js",
        appPath: "a-b/c-d.js"
      });
    });

  });

  describe("#addExtension", () => {
    it("should add extension", () => {
      expect(pageObject.addExtension("components/a-b")).to.be.equal("components/a-b.js");
    });
    it("should not add extension", () => {
      expect(pageObject.addExtension("components/a-b.js")).to.be.equal("components/a-b.js");
    });
  });

});