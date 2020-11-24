const help = require('./routes/help'),
  config = require('./config/config');

client = help.startMQTT();
client.end()

console.warn("\x1b[32mYour cerificate and secret seems to be fine... But to be 100% sure, \x1b[5m\x1b[34mget coding!\x1b[0m")
process.exit(0);