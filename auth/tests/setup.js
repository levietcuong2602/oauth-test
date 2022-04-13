const DebugControl = require('../utilities/debug');

DebugControl.setLevel(DebugControl.levels.NONE);

module.exports = {
  // eslint-disable-next-line global-require
  server: require('../app'),
};
