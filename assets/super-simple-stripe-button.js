"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/.pnpm/@stripe+stripe-js@4.1.0/node_modules/@stripe/stripe-js/dist/pure.js
  var require_pure = __commonJS({
    "node_modules/.pnpm/@stripe+stripe-js@4.1.0/node_modules/@stripe/stripe-js/dist/pure.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      var V3_URL = "https://js.stripe.com/v3";
      var V3_URL_REGEX = /^https:\/\/js\.stripe\.com\/v3\/?(\?.*)?$/;
      var EXISTING_SCRIPT_MESSAGE = "loadStripe.setLoadParameters was called but an existing Stripe.js script already exists in the document; existing script parameters will be used";
      var findScript = function findScript2() {
        var scripts = document.querySelectorAll('script[src^="'.concat(V3_URL, '"]'));
        for (var i = 0; i < scripts.length; i++) {
          var script = scripts[i];
          if (!V3_URL_REGEX.test(script.src)) {
            continue;
          }
          return script;
        }
        return null;
      };
      var injectScript = function injectScript2(params) {
        var queryString = params && !params.advancedFraudSignals ? "?advancedFraudSignals=false" : "";
        var script = document.createElement("script");
        script.src = "".concat(V3_URL).concat(queryString);
        var headOrBody = document.head || document.body;
        if (!headOrBody) {
          throw new Error("Expected document.body not to be null. Stripe.js requires a <body> element.");
        }
        headOrBody.appendChild(script);
        return script;
      };
      var registerWrapper = function registerWrapper2(stripe, startTime) {
        if (!stripe || !stripe._registerWrapper) {
          return;
        }
        stripe._registerWrapper({
          name: "stripe-js",
          version: "4.0.0",
          startTime
        });
      };
      var stripePromise = null;
      var onErrorListener = null;
      var onLoadListener = null;
      var onError = function onError2(reject) {
        return function() {
          reject(new Error("Failed to load Stripe.js"));
        };
      };
      var onLoad = function onLoad2(resolve, reject) {
        return function() {
          if (window.Stripe) {
            resolve(window.Stripe);
          } else {
            reject(new Error("Stripe.js not available"));
          }
        };
      };
      var loadScript = function loadScript2(params) {
        if (stripePromise !== null) {
          return stripePromise;
        }
        stripePromise = new Promise(function(resolve, reject) {
          if (typeof window === "undefined" || typeof document === "undefined") {
            resolve(null);
            return;
          }
          if (window.Stripe && params) {
            console.warn(EXISTING_SCRIPT_MESSAGE);
          }
          if (window.Stripe) {
            resolve(window.Stripe);
            return;
          }
          try {
            var script = findScript();
            if (script && params) {
              console.warn(EXISTING_SCRIPT_MESSAGE);
            } else if (!script) {
              script = injectScript(params);
            } else if (script && onLoadListener !== null && onErrorListener !== null) {
              var _script$parentNode;
              script.removeEventListener("load", onLoadListener);
              script.removeEventListener("error", onErrorListener);
              (_script$parentNode = script.parentNode) === null || _script$parentNode === void 0 ? void 0 : _script$parentNode.removeChild(script);
              script = injectScript(params);
            }
            onLoadListener = onLoad(resolve, reject);
            onErrorListener = onError(reject);
            script.addEventListener("load", onLoadListener);
            script.addEventListener("error", onErrorListener);
          } catch (error) {
            reject(error);
            return;
          }
        });
        return stripePromise["catch"](function(error) {
          stripePromise = null;
          return Promise.reject(error);
        });
      };
      var initStripe = function initStripe2(maybeStripe, args, startTime) {
        if (maybeStripe === null) {
          return null;
        }
        var stripe = maybeStripe.apply(void 0, args);
        registerWrapper(stripe, startTime);
        return stripe;
      };
      var validateLoadParams = function validateLoadParams2(params) {
        var errorMessage = "invalid load parameters; expected object of shape\n\n    {advancedFraudSignals: boolean}\n\nbut received\n\n    ".concat(JSON.stringify(params), "\n");
        if (params === null || _typeof(params) !== "object") {
          throw new Error(errorMessage);
        }
        if (Object.keys(params).length === 1 && typeof params.advancedFraudSignals === "boolean") {
          return params;
        }
        throw new Error(errorMessage);
      };
      var loadParams;
      var loadStripeCalled = false;
      var loadStripe2 = function loadStripe3() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        loadStripeCalled = true;
        var startTime = Date.now();
        return loadScript(loadParams).then(function(maybeStripe) {
          return initStripe(maybeStripe, args, startTime);
        });
      };
      loadStripe2.setLoadParameters = function(params) {
        if (loadStripeCalled && loadParams) {
          var validatedParams = validateLoadParams(params);
          var parameterKeys = Object.keys(validatedParams);
          var sameParameters = parameterKeys.reduce(function(previousValue, currentValue) {
            var _loadParams;
            return previousValue && params[currentValue] === ((_loadParams = loadParams) === null || _loadParams === void 0 ? void 0 : _loadParams[currentValue]);
          }, true);
          if (sameParameters) {
            return;
          }
        }
        if (loadStripeCalled) {
          throw new Error("You cannot change load parameters after calling loadStripe");
        }
        loadParams = validateLoadParams(params);
      };
      exports.loadStripe = loadStripe2;
    }
  });

  // node_modules/.pnpm/@stripe+stripe-js@4.1.0/node_modules/@stripe/stripe-js/pure/index.js
  var require_pure2 = __commonJS({
    "node_modules/.pnpm/@stripe+stripe-js@4.1.0/node_modules/@stripe/stripe-js/pure/index.js"(exports, module) {
      module.exports = require_pure();
    }
  });

  // src/super-simple-stripe-button.ts
  var import_pure = __toESM(require_pure2());
  var s3bValidStates = ["complete", "interactive"];
  async function s3bApiCall(rpc, params) {
    if (window.S3B == null) throw new Error("S3B not initialized");
    const requestUri = "".concat(window.S3B.siteurl, "/wp-content/plugins/super-simple-stripe-button/handler.php?cmd=").concat(rpc);
    const requestResult = params != null ? await fetch(requestUri, params) : await fetch(requestUri);
    const requestData = await requestResult.json();
    if (requestData.result === "ERROR")
      throw new Error("API Error: ".concat(requestData.message));
    return requestData.data;
  }
  async function s3bInit() {
    console.log("Fetching Stripe key");
    const keyResult = await s3bApiCall("get-stripe-key");
    window.S3B.Stripe = await (0, import_pure.loadStripe)(keyResult);
    await s3bAttachListeners();
  }
  async function s3bButtonListener(self) {
    var _a;
    if (window.S3B == null) throw new Error("S3B not initialized");
    if (window.S3B.Stripe == null) throw new Error("Stripe not initialized");
    const priceId = jQuery(self).data("price-id");
    const quantity = Number((_a = jQuery(self).data("quantity")) != null ? _a : 1);
    const mode = jQuery(self).data("mode");
    console.log("s3bCreateCheckoutSession", priceId, mode, quantity);
    const sessionId = await s3bCreateCheckoutSession(priceId, mode, quantity);
    console.log("s3bCreateCheckoutSession", "sessionId", sessionId);
    const redirectResult = await window.S3B.Stripe.redirectToCheckout({
      sessionId
    });
    if (redirectResult != null) await s3bHandleResult(redirectResult);
  }
  var s3bAttachListeners = async () => {
    jQuery(".s3b-button").on("click", (e) => {
      void s3bButtonListener(e.target);
    });
  };
  async function s3bCreateCheckoutSession(priceId, mode, quantity) {
    mode = mode != null ? mode : "payment";
    quantity = quantity != null ? quantity : 1;
    const result = await s3bApiCall("create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        priceId,
        mode,
        quantity
      })
    });
    return result.id;
  }
  async function s3bHandleResult(result) {
    if ((result == null ? void 0 : result.error) != null) alert(result.error.message);
  }
  function s3bDocReady(initializer) {
    s3bValidStates.includes(document.readyState) ? setTimeout(initializer, 1) : document.addEventListener("DOMContentLoaded", () => {
      void initializer();
    });
  }
  s3bDocReady(s3bInit);
})();
//# sourceMappingURL=super-simple-stripe-button.js.map
