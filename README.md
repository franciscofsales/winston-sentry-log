# winston-sentry-log

[Sentry](https://sentry.io) transport for the [winston](https://github.com/winstonjs/winston) v3 logger using [@sentry/node](https://github.com/getsentry/sentry-javascript).

## Index

- [Install](#install)
- [Usage](#usage)
- [Options](#options-options)
  - [Default Raven Options](#default-raven-options-optionsconfig)
  - [Default Error Handler](#default-error-handler-optionserrorhandler)
  - [Uncaught Exceptions](#uncaught-exceptions)
  - [Unhandled Promise Rejections](#unhandled-promise-rejections)
  - [Log Level Mapping](#log-level-mapping)
- [License](#license)

## Install

```bash
yarn add winston winston-sentry-log
```

## Usage

You can configure `winston-sentry-log` in two different ways.

With `new winston.Logger`:

```js
const winston = require("winston");
const Sentry = require("winston-sentry-log");

const options = {
  dsn: "https://******@sentry.io/12345",
  level: "info"
};

const logger = new winston.Logger({
  transports: [new Sentry(options)]
});
```

Or with winston's `add` method:

```js
const winston = require("winston");
const Sentry = require("winston-sentry-log");

const logger = new winston.Logger();

logger.add(Sentry, options);
```

See [Options](#options-options) below for custom configuration.

## Options (`options`)

Per `options` variable above, here are the default options provided:

Default Sentry options:

- `dsn` (String) - your Sentry DSN or Data Source Name (defaults to `process.env.SENTRY_DSN`)
- `config` (Object) - a Raven configuration object (see [Default Raven Options](#default-raven-options-optionsconfig) below)

Transport related options:

- `name` (String) - transport's name (defaults to `winston-sentry-log`)
- `silent` (Boolean) - suppress logging (defaults to `false`)
- `level` (String) - transport's level of messages to log (defaults to `info`)
- `levelsMap` (Object) - log level mapping to Sentry (see [Log Level Mapping](#log-level-mapping) below)

### Default Sentry Options (`options.config`)

- `logger` (String) - defaults to `winston-sentry-log`
- `server_name` (String) - defaults to `process.env.SENTRY_NAME` or `os.hostname()`
- `release` (String) - defaults to `process.env.SENTRY_RELEASE`
- `environment` (String) - defaults to `process.env.SENTRY_ENVIRONMENT`)
- `modules` (Object) - defaults to `package.json` dependencies
- `extra` (Object) - no default value
- `fingerprint` (Array) - no default value

For a full list of Sentry options, please visit <https://docs.sentry.io/clients/node/config/>.

### Log Level Mapping

Winston logging levels are mapped by default to Sentry's acceptable levels.

These defaults are set as `options.levelsMap' and are:

```js
{
  silly: 'debug',
  verbose: 'debug',
  info: 'info',
  debug: 'debug',
  warn: 'warning',
  error: 'error'
}
```

You can customize how log levels are mapped using the `levelsMap` option:

```js
new Sentry({
  levelsMap: {
    verbose: "info"
  }
});
```

If no log level mapping was found for the given `level` passed, then it will not log anything.

## License

[MIT License][license-url]

[license-url]: LICENSE
