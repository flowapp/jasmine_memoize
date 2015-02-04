var set = function(key, value) {
  this.beforeAll(function() {
    this.__jasmine_memoize__ = clone(this.__jasmine_memoize__ || {});
    this.__jasmine_memoize__[key] = {
      value: value,
      cache: null,
      populated: false
    };
  });
};

var clone = function(object) {
  var value = {};
  Object.keys(object).forEach(function(key) {
    value[key] = object[key];
  });
  return value;
};

var define = function(context, key, value) {
  Object.defineProperty(context, key, {
    get: function() {
      if (value.populated) {
        return value.cache;
      }
      value.populated = true;
      return value.cache = value.value.call(this);
    },
    enumerable: true,
    configurable: false
  });
};

function globalObject() {
  if (typeof window !== "undefined") {
    return window;
  } else if (typeof global !== "undefined") {
    return global;
  }
}

function installHooks(env) {
  var last;
  env.beforeEach(function() {
    if (this.__jasmine_memoize__) {
      Object.keys(this.__jasmine_memoize__).forEach(function(key) {
        var value = this.__jasmine_memoize__[key];
        define(this, key, value);
      }.bind(this));
      last = this.__jasmine_memoize__;
      delete this.__jasmine_memoize__;
    }
  });

  env.afterEach(function() {
    this.__jasmine_memoize__ = last;
    if (this.__jasmine_memoize__) {
      Object.keys(this.__jasmine_memoize__).forEach(function(key) {
        var value = this.__jasmine_memoize__[key];
        value.cache = null;
        value.populated = false;
      }.bind(this));
    }
    last = null;
  });
}

function install(env) {
  var exports = globalObject();
  var installGlobally = false;
  if (!env) {
    env = exports.jasmine.getEnv();
    installGlobally = true;
  }

  env.set = set.bind(env);
  installHooks(env);
  if (installGlobally) {
    exports.set = env.set;
  }
  return {
    set: env.set
  };
}
if (typeof define == "function" && define.amd) {
  define(function() {
    return {install: install}
  });
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = {install: install};
} else {
  window.jasmineMemoize = {install: install};
}
