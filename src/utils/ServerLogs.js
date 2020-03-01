const moment = require('moment');
const morgan = require('morgan');
const chalk = require('chalk');
const _ = require('lodash');

const dateLog = () =>
  moment.locale('pt-BR') &&
  chalk.black.bgCyanBright(`[${moment().format('DD-MM-YYYY hh:mm:ss')}]`);

module.exports = class ServerLogs {
  morganLog(req, res, next) {
    return morgan((tokens, req, res) => {
      console.debug();
      return [
        dateLog(),
        tokens.method(req, res),
        tokens.url(req, res),
        '-',
        'IP',
        tokens['remote-addr'](req, res),
        '-',
        'Code',
        '-',
        tokens.status(req, res),
        '-',
        'Size',
        tokens.res(req, res, 'content-length'),
        '-',
        'B',
        '-',
        'Handled in',
        tokens['response-time'](req, res),
        'ms'
      ].join(' ');
    })(req, res, next);
  }

  /**
   * @param {boolean} error
   * @param {string} msg Mensagem fornecida pelo devido erro.
   * @param {object} opts
   * @param {string[]} [opts.tags] - Tags to identify the log entry
   * @param {boolean} [opts.bold] - If message will be bold
   * @param {boolean} [opts.italic] - If message will be italic
   * @param {boolean} [opts.underline] - If message will be underline
   * @param {boolean} [opts.reversed] - If message will be reversed
   * @param {'bgBlack'|'bgBlackBright'|'bgRed'|'bgRedBright'|'bgGreen'|'bgGreenBright'|'bgYellow'|'bgYellowBright'|'bgBlue'|'bgBlueBright'|'bgMagenta'|'bgMagentaBright'|'bgCyan'|'bgCyanBright'|'bgWhite'|'bgWhiteBright'} [opts.bgColor] - Cor do fundo da mensagem
   * @param {'black'|'blackBright'|'red'|'redBright'|'green'|'greenBright'|'yellow'|'yellowBright'|'blue'|'blueBright'|'magenta'|'magentaBright'|'cyan'|'cyanBright'|'white'|'whiteBright'} [opts.color] - Cor da mensagem
   */
  log(error, msg, opts) {
    console.debug();
    const isError = [true, false].includes(error) && error;
    const message = typeof error === 'boolean' ? msg : error;
    const options = typeof error === 'boolean' ? opts : msg;

    const {
      tags = ['CLIENT'],
      bold = false,
      italic = false,
      underline = false,
      reversed = false,
      bgColor = false,
      color = 'whiteBright'
    } = options instanceof Object ? options : {};

    const colorFunction = _.get(
      chalk,
      [bold, italic, underline, reversed, bgColor, color]
        .filter(Boolean)
        .join('.')
    );

    console.log(
      isError
        ? `${dateLog()} ${chalk.black.bgRedBright('[ErrorLog]')}`
        : dateLog(),
      tags.map(t => chalk.black.bgGreenBright(`[${t}]`)).join(' '),
      colorFunction(message)
    );
  }
};
