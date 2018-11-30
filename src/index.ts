import sentry from '@sentry/node';
import { isError } from '@sentry/utils/is';
import _ from 'lodash';
import TransportStream = require('winston-transport');

import { Context } from './types';

const errorHandler = (err: any) => {
  // tslint:disable-next-line
  console.error(err);
};

export default class Sentry extends TransportStream {
  protected name: string;
  protected tags: {[s: string]: any};
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
      name: 'winston-sentry-log',
      silent: false,
      level: 'info',
      levelsMap: {
        silly: 'debug',
        verbose: 'debug',
        info: 'info',
        debug: 'debug',
        warn: 'warning',
        error: 'error',
      },
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

    this.sentryClient = options.sentryClient || require('@sentry/node');
    if (!!this.sentryClient) {
      this.sentryClient.init(options.config || {
        dsn: process.env.SENTRY_DSN || '',
      });

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
    context.extra = _.omit(meta, ['user']);
    context.fingerprint = [fingerprint, process.env.NODE_ENV];
    this.sentryClient.configureScope((scope: sentry.Scope) => {
      const user = _.get(meta, 'user');
      if (_.has(context, 'extra')) {
        Object.keys(context.extra).forEach((key) => {
          scope.setExtra(key, context.extra[key]);
        });
      }
      if (!_.isEmpty(this.tags)) {
        Object.keys(this.tags).forEach((key) => {
          scope.setTag(key, this.tags[key]);
        });
      }
      if (!!user) {
        scope.setUser(user);
      }
      if (context.level === 'error' || context.level === 'fatal') {
        this.sentryClient.captureException(isError(info) ? info : new Error(message));
        return callback(null, true);
      }
      this.sentryClient.captureMessage(message);
      return callback(null, true);
    });
  }
}
