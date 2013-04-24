
/**
 * Module dependencies.
 */

exports = module.exports = debug;


/**
 * Expose log function. Default to `console.log`.
 */

exports.log = console.log.bind(console);


/**
 * Enabled debuggers.
 */

var names = []
  , skips = [];

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  function disabled(){}
  disabled.enabled = false;

  var match = skips.some(function(re){
    return re.test(name);
  });

  if (match) return disabled;

  match = names.some(function(re){
    return re.test(name);
  });

  if (!match) return disabled;

  function logger(msg) {
    msg = (msg instanceof Error) ? (msg.stack || msg.message) : msg;
    logger.log.apply(this, arguments);
  }

  logger.log = exports.log;
  logger.enabled = true;

  return logger;
}

exports.enable = function(name) {
  name = name.replace('*', '.*?');
  names.push(new RegExp('^' + name + '$'));
};

exports.enable.all = function() {
  exports.clear();
  exports.enable("*");
}

exports.disable = function(name) {
  name = name.replace('*', '.*?');
  skips.push(new RegExp('^' + name + '$'));
}

exports.disable.all = function() {
  exports.clear();
  exports.disable("*");
}

exports.clear = function() {
  skips = [];
  names = [];
}

exports.config = (process.env.DEBUG || '');

exports.reset = function() {
  skips = [];
  names = [];

  exports.config  
    .split(/[\s,]+/)
    .forEach(function(name){
      if (name[0] === '-') {
        exports.disable(name.substr(1));
      } else {
        exports.enable(name);
      }
    });
}

exports.reset();
