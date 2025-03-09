const { networkInterfaces } = require('os');

function getLocalIPv4() {
  const nets = networkInterfaces();
  let preferredIP = '127.0.0.1';

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (net.address.startsWith('192.168.')) {
          return net.address;
        }
        preferredIP = net.address;
      }
    }
  }

  return preferredIP;
}

module.exports = getLocalIPv4;