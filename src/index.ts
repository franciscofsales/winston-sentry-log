import _ from "lodash";
import TransportStream from "winston-transport";
import sentry from "@sentry/node";

import { Context } from "./types";

function errorHandler(err: any) {
  console.error(err);
}

class Sentry extends TransportStream {
  protected name: string;
  protected sentryClient: typeof sentry;
  protected levelsMap: any;

  constructor(opts: any) {
    super(opts);
    this.name = "winston-sentry-log";
    const options = opts;

    _.defaultsDeep(opts, {
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
    } else if (options.globalTags) {
      options.config.tags = options.globalTags;
    }

    if (options.extra) {
      options.config.extra = options.config.extra || {};
      options.config.extra = _.defaults(options.config.extra, options.extra);
    }

    this.sentryClient = options.sentryClient || sentry;
    if (!!this.sentryClient) {
      this.sentryClient.init({
        dsn: options.dsn
      });
    }
  }

  log(info: any, callback: any) {
    const { message, level, fingerprint } = info;

    const meta = Object.assign({}, _.omit(info, ["level", "message", "label"]));
    setImmediate(() => {
      this.emit("logged", level);
    });

    if (!!this.silent) {
      return callback(null, true);
    }

    if (!(level in this.levelsMap)) {
      return callback(null, true);
    }

    const context: Context = {};
    context.level = this.levelsMap[level];
    context.extra = _.omit(meta, ["user"]);
    context.fingerprint = [fingerprint, process.env.NODE_ENV];
    this.sentryClient.configureScope((scope: any) => {
      const user = _.get(meta, "user");
      if (_.has(context, "extra")) {
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
