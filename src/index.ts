import sentry from '@sentry/node';
import _ from 'lodash';
import TransportStream = require('winston-transport');

import { Context } from './types';

const errorHandler = (err: any) => {
  // eslint-disable-next-line
  console.error(err);
};

export default class Sentry extends TransportStream {
  protected name: string;
  protected tags: { [s: string]: any };
  protected sentryClient: typeof sentry;
  protected levelsMap: any;

  constructor(opts: any) {
    super(opts);
    this.name = 'winston-sentry-log';
    this.tags = {};
    const options = opts;

    _.defaultsDeep(opts, {
      errorHandler,
      config: {
        dsn: process.env.SENTRY_DSN || '',
        logger: 'winston-sentry-log',
        captureUnhandledRejections: false,
      },
      isClientInitialized: false,
      level: 'info',
      levelsMap: {
        silly: 'debug',
        verbose: 'debug',
        info: 'info',
        debug: 'debug',
        warn: 'warning',
        error: 'error',
      },
      name: 'winston-sentry-log',
      silent: false,
    });

    this.levelsMap = options.levelsMap;

    if (options.tags) {
      this.tags = options.tags;
    } else if (options.globalTags) {
      this.tags = options.globalTags;
    } else if (options.config.tags) {
      this.tags = options.config.tags;
    }

    if (options.extra) {
      options.config.extra = options.config.extra || {};
      options.config.extra = _.defaults(options.config.extra, options.extra);
    }

    this.sentryClient = options.sentryClient;

    if (!options.isClientInitialized) {
      this.sentryClient = this.sentryClient || require('@sentry/node');

      this.sentryClient.init(options.config || {
        dsn: process.env.SENTRY_DSN || '',
      });
    }

    if (!!this.sentryClient) {
      this.sentryClient.configureScope((scope: any) => {
        if (!_.isEmpty(this.tags)) {
          Object.keys(this.tags).forEach((key) => {
            scope.setTag(key, this.tags[key]);
          });
        }
      });
    }
  }

  public log(info: any, callback: any) {
    const { message, fingerprint } = info;
    const level = Object.keys(this.levelsMap).find(key => info.level.toString().includes(key));
    if (!level) {
      return callback(null, true);
    }

    const meta = Object.assign({}, _.omit(info, ['level', 'message', 'label']));
    setImmediate(() => {
      this.emit('logged', level);
    });

    if (!!this.silent) {
      return callback(null, true);
    }

    const context: Context = {};
    context.level = this.levelsMap[level];
    context.extra = _.omit(meta, ['user', 'tags']);
    context.fingerprint = [fingerprint, process.env.NODE_ENV];
    this.sentryClient.withScope((scope: sentry.Scope) => {
      const user = _.get(meta, 'user');
      if (_.has(context, 'extra')) {
        Object.keys(context.extra).forEach((key) => {
          scope.setExtra(key, context.extra[key]);
        });
      }

      if (!_.isEmpty(meta.tags) && _.isObject(meta.tags)) {
        Object.keys(meta.tags).forEach((key) => {
          scope.setTag(key, meta.tags[key]);
        });
      }

      if (!!user) {
        scope.setUser(user);
      }

      if (context.level === 'error' || context.level === 'fatal') {
        let err = null;
        if (_.isError(info)) {
          err = info;
        } else {
          err = new Error(message);
          if (info.stack) {
            err.stack = info.stack;
          }
        }
        this.sentryClient.captureException(err);
        return callback(null, true);
      }
      this.sentryClient.captureMessage(message, context.level);
      return callback(null, true);
    });
  }
}

module.exports = Sentry;
