import sentry from '@sentry/node';
import _ from 'lodash';
import TransportStream from 'winston-transport';

import { Context } from './types';

const errorHandler = (err: any) => {
  // tslint:disable-next-line
  console.error(err);
};

class Sentry extends TransportStream {
  protected name: string;
  protected sentryClient: typeof sentry;
  protected levelsMap: any;

  constructor(opts: any) {
    super(opts);
    this.name = 'winston-sentry-log';
    const options = opts;

    _.defaultsDeep(opts, {
      errorHandler,
      dsn: process.env.SENTRY_DSN || '',
      config: {
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
      options.config.tags = options.tags;
    } else if (options.globalTags) {
      options.config.tags = options.globalTags;
    }

    if (options.extra) {
      options.config.extra = options.config.extra || {};
      options.config.extra = _.defaults(options.config.extra, options.extra);
    }

    this.sentryClient = options.sentryClient || require('@sentry/node');
    if (!!this.sentryClient) {
      this.sentryClient.init({
        dsn: options.dsn,
      });
    }
  }

  public log(info: any, callback: any) {
    this.sentryClient.init({
      dsn: process.env.SENTRY_DSN || '',
    });
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
    this.sentryClient.configureScope((scope: any) => {
      const user = _.get(meta, 'user');
      if (_.has(context, 'extra')) {
        Object.keys(context.extra).forEach((key) => {
          scope.setExtra(key, context.extra[key]);
        });
      }
      if (!!user) {
        scope.setUser(user);
      }
      if (context.level === 'error' || context.level === 'fatal') {
        this.sentryClient.captureException(info);
        return callback(null, true);
      }
      this.sentryClient.captureMessage(message);
      return callback(null, true);
    });
  }
}

module.exports = Sentry;
