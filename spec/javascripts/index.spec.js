var jasmineMemo = require("../../index");
jasmineMemo.install();

var setup = function() {
  beforeAll(function() {
    this.setSpy = jasmine.createSpy("SetSpy");
  });
  set("variable", function() { this.setSpy() });
};

describe("jasmine-set", function() {
  describe("#install", function() {
    describe("in environment", function() {
      beforeEach(function() {
        this.env = new jasmine.Env();
        jasmineMemo.install(this.env);
      });
      it("defines `set`", function() {
        expect(this.env.set).toBeDefined();
      });
    });
    describe("globally", function() {
      it("defines `set`", function() {
        expect(set).toBeDefined();
        expect(jasmine.getEnv().set).toBeDefined();
      });
    });
  });

  describe("#set", function() {
    describe("lazily executed", function() {
      setup();
      it("runs body only if excecuted", function() {
        expect(this.setSpy).not.toHaveBeenCalled();
      });
    });

    describe("lazily executed", function() {
      setup();
      it("calls body when requesting `variable`", function() {
        this.variable;
        expect(this.setSpy).toHaveBeenCalled();
      });
    });
    describe("memoizes results", function() {
      setup();
      it("calls set body only once", function() {
        this.variable;
        this.variable;
        expect(this.setSpy.calls.count()).toEqual(1);
      });
    });

    describe("return value", function() {
      set("variable", function() { return "value" });
      it("calls set body only once", function() {
        expect(this.variable).toEqual("value");
      });
    });
  });

  describe("behaviour", function() {
    beforeEach(function() {
      this.env = new jasmine.Env();
      jasmineMemo.install(this.env);
    });
    it("temporarily overwrites `set` variable", function(done) {
      var env = this.env;
      env.set("variable", function() { return "value 1"});
      env.describe("description", function() {
        env.set("variable", function() { return "value 2"});
        env.it("spec name", function() {
          expect(this.variable).toEqual("value 2");
        });
      });
      env.it("spec name", function() {
        expect(this.variable).toEqual("value 1");
      });
      env.addReporter({jasmineDone: done});
      env.execute();
    });

    it("calls once per `it` block", function(done) {
      var env = this.env;
      var spy = jasmine.createSpy("SetSpy");

      env.set("variable", spy);
      env.it("spec name", function() {
        this.variable;
      });
      env.it("spec name", function() {
        this.variable;
      });
      env.addReporter({jasmineDone: function() {
        expect(spy.calls.count()).toEqual(2);
        done();
      }});
      env.execute();
    });

    it("doesn’t leak between describe blocks", function(done) {
      var env = this.env;
      env.describe("description", function() {
        env.set("variable", function() { return null; });
        env.it("spec name", function() {
          expect(this.variable).toBeDefined();
        });
      });
      env.it("spec name 2", function() {
        expect(this.variable).not.toBeDefined();
      });
      env.addReporter({jasmineDone: done});
      env.execute();
    });
  });
});
