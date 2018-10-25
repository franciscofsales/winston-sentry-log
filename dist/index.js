"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const winston_transport_1 = __importDefault(require("winston-transport"));
const node_1 = __importDefault(require("@sentry/node"));
const errorHandler = (err) => {
    console.error(err);
};
class Sentry extends winston_transport_1.default {
    constructor(opts) {
        super(opts);
        this.name = "winston-sentry-log";
        const options = opts;
        lodash_1.default.defaultsDeep(opts, {
            dsn: process.env.SENTRY_DSN || "",
            config: {
                logger: "winston-sentry-log",
                captureUnhandledRejections: false
            },
            errorHandler,
            name: "winston-sentry-log",
            silent: false,
            level: "info",
            levelsMap: {
                silly: "debug",
                verbose: "debug",
                info: "info",
                debug: "debug",
                warn: "warning",
                error: "error"
            }
        });
        this.levelsMap = options.levelsMap;
        if (options.tags) {
            options.config.tags = options.tags;
        }
        else if (options.globalTags) {
            options.config.tags = options.globalTags;
        }
        if (options.extra) {
            options.config.extra = options.config.extra || {};
            options.config.extra = lodash_1.default.defaults(options.config.extra, options.extra);
        }
        this.sentryClient = options.sentryClient || node_1.default;
        if (!!this.sentryClient) {
            this.sentryClient.init({
                dsn: options.dsn
            });
        }
    }
    log(info, callback) {
        const { message, level, fingerprint } = info;
        const meta = Object.assign({}, lodash_1.default.omit(info, ["level", "message", "label"]));
        setImmediate(() => {
            this.emit("logged", level);
        });
        if (!!this.silent) {
            return callback(null, true);
        }
        if (!(level in this.levelsMap)) {
            return callback(null, true);
        }
        const context = {};
        context.level = this.levelsMap[level];
        context.extra = lodash_1.default.omit(meta, ["user"]);
        context.fingerprint = [fingerprint, process.env.NODE_ENV];
        this.sentryClient.configureScope((scope) => {
            const user = lodash_1.default.get(meta, "user");
            if (lodash_1.default.has(context, "extra")) {
                Object.keys(context.extra).forEach(key => {
                    scope.setExtra(key, context.extra[key]);
                });
            }
            if (!!user) {
                scope.setUser(user);
            }
            if (context.level === "error" || context.level === "fatal") {
                this.sentryClient.captureException(message);
                return callback(null, true);
            }
            this.sentryClient.captureMessage(message);
            return callback(null, true);
        });
    }
}
module.exports = Sentry;
