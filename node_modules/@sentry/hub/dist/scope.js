"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var misc_1 = require("@sentry/utils/misc");
var object_1 = require("@sentry/utils/object");
/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
var Scope = /** @class */ (function () {
    function Scope() {
        /** Flag if notifiying is happening. */
        this.notifyingListeners = false;
        /** Callback for client to receive scope changes. */
        this.scopeListeners = [];
        /** Callback list that will be called after {@link applyToEvent}. */
        this.eventProcessors = [];
        /** Array of breadcrumbs. */
        this.breadcrumbs = [];
        /** User */
        this.user = {};
        /** Tags */
        this.tags = {};
        /** Extra */
        this.extra = {};
    }
    /** Add internal on change listener. */
    Scope.prototype.addScopeListener = function (callback) {
        this.scopeListeners.push(callback);
    };
    /** Add new event processor that will be called after {@link applyToEvent}. */
    Scope.prototype.addEventProcessor = function (callback) {
        this.eventProcessors.push(callback);
        return this;
    };
    /**
     * This will be called on every set call.
     */
    Scope.prototype.notifyScopeListeners = function () {
        var _this = this;
        if (!this.notifyingListeners) {
            this.notifyingListeners = true;
            setTimeout(function () {
                _this.scopeListeners.forEach(function (callback) {
                    callback(_this);
                });
                _this.notifyingListeners = false;
            }, 0);
        }
    };
    /**
     * This will be called after {@link applyToEvent} is finished.
     */
    Scope.prototype.notifyEventProcessors = function (event, hint) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, processedEvent, _b, _c, processor, e_2, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        processedEvent = event;
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 8, 9, 10]);
                        _b = __values(__spread(getGlobalEventProcessors(), this.eventProcessors)), _c = _b.next();
                        _d.label = 2;
                    case 2:
                        if (!!_c.done) return [3 /*break*/, 7];
                        processor = _c.value;
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, processor(__assign({}, processedEvent), hint)];
                    case 4:
                        processedEvent = _d.sent();
                        if (processedEvent === null) {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _d.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _c = _b.next();
                        return [3 /*break*/, 2];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/, processedEvent];
                }
            });
        });
    };
    /**
     * Updates user context information for future events.
     * @param user User context object to merge into current context.
     */
    Scope.prototype.setUser = function (user) {
        this.user = user;
        this.notifyScopeListeners();
        return this;
    };
    /**
     * Updates tags context information for future events.
     * @param tags Tags context object to merge into current context.
     */
    Scope.prototype.setTag = function (key, value) {
        var _a;
        this.tags = __assign({}, this.tags, (_a = {}, _a[key] = value, _a));
        this.notifyScopeListeners();
        return this;
    };
    /**
     * Updates extra context information for future events.
     * @param extra context object to merge into current context.
     */
    Scope.prototype.setExtra = function (key, extra) {
        var _a;
        this.extra = __assign({}, this.extra, (_a = {}, _a[key] = extra, _a));
        this.notifyScopeListeners();
        return this;
    };
    /**
     * Sets the fingerprint on the scope to send with the events.
     * @param fingerprint string[] to group events in Sentry.
     */
    Scope.prototype.setFingerprint = function (fingerprint) {
        this.fingerprint = fingerprint;
        this.notifyScopeListeners();
        return this;
    };
    /**
     * Sets the level on the scope for future events.
     * @param level string {@link Severity}
     */
    Scope.prototype.setLevel = function (level) {
        this.level = level;
        this.notifyScopeListeners();
        return this;
    };
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    Scope.clone = function (scope) {
        var newScope = new Scope();
        object_1.assign(newScope, scope, {
            scopeListeners: [],
        });
        if (scope) {
            newScope.extra = object_1.assign(scope.extra);
            newScope.tags = object_1.assign(scope.tags);
            newScope.breadcrumbs = __spread(scope.breadcrumbs);
            newScope.eventProcessors = __spread(scope.eventProcessors);
        }
        return newScope;
    };
    /** Clears the current scope and resets its properties. */
    Scope.prototype.clear = function () {
        this.breadcrumbs = [];
        this.tags = {};
        this.extra = {};
        this.user = {};
        this.level = undefined;
        this.fingerprint = undefined;
        this.notifyScopeListeners();
    };
    /**
     * Sets the breadcrumbs in the scope
     * @param breadcrumbs Breadcrumb
     * @param maxBreadcrumbs number of max breadcrumbs to merged into event.
     */
    Scope.prototype.addBreadcrumb = function (breadcrumb, maxBreadcrumbs) {
        this.breadcrumbs =
            maxBreadcrumbs !== undefined && maxBreadcrumbs >= 0
                ? __spread(this.breadcrumbs, [breadcrumb]).slice(-maxBreadcrumbs)
                : __spread(this.breadcrumbs, [breadcrumb]);
        this.notifyScopeListeners();
    };
    /**
     * Applies the current context and fingerprint to the event.
     * Note that breadcrumbs will be added by the client.
     * Also if the event has already breadcrumbs on it, we do not merge them.
     * @param event SentryEvent
     * @param hint May contain additional informartion about the original exception.
     * @param maxBreadcrumbs number of max breadcrumbs to merged into event.
     */
    Scope.prototype.applyToEvent = function (event, hint, maxBreadcrumbs) {
        return __awaiter(this, void 0, void 0, function () {
            var hasNoBreadcrumbs;
            return __generator(this, function (_a) {
                if (this.extra && Object.keys(this.extra).length) {
                    event.extra = __assign({}, this.extra, event.extra);
                }
                if (this.tags && Object.keys(this.tags).length) {
                    event.tags = __assign({}, this.tags, event.tags);
                }
                if (this.user && Object.keys(this.user).length) {
                    event.user = __assign({}, this.user, event.user);
                }
                if (this.fingerprint && event.fingerprint === undefined) {
                    event.fingerprint = this.fingerprint;
                }
                if (this.level) {
                    event.level = this.level;
                }
                hasNoBreadcrumbs = !event.breadcrumbs || event.breadcrumbs.length === 0;
                if (hasNoBreadcrumbs && this.breadcrumbs.length > 0) {
                    event.breadcrumbs =
                        maxBreadcrumbs !== undefined && maxBreadcrumbs >= 0
                            ? this.breadcrumbs.slice(-maxBreadcrumbs)
                            : this.breadcrumbs;
                }
                return [2 /*return*/, this.notifyEventProcessors(event, hint)];
            });
        });
    };
    return Scope;
}());
exports.Scope = Scope;
/**
 * Retruns the global event processors.
 */
function getGlobalEventProcessors() {
    var global = misc_1.getGlobalObject();
    global.__SENTRY__ = global.__SENTRY__ || {};
    global.__SENTRY__.globalEventProcessors = global.__SENTRY__.globalEventProcessors || [];
    return global.__SENTRY__.globalEventProcessors;
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
function addGlobalEventProcessor(callback) {
    getGlobalEventProcessors().push(callback);
}
exports.addGlobalEventProcessor = addGlobalEventProcessor;
//# sourceMappingURL=scope.js.map