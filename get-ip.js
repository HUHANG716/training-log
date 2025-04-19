// @ts-nocheck
import os from 'os';
const interfaces = os.networkInterfaces();
let localIp = 'localhost';

Object.keys(interfaces).forEach((iface) => {
  interfaces[iface].forEach((details) => {
    if (details.family === 'IPv4' && !details.internal) {
      if (details.address.startsWith('192.168') || details.address.startsWith('10.')) {
        localIp = details.address;
      }
    }
  });
});

console.log(`\n> 内网访问地址: http://${localIp}:3000`);
