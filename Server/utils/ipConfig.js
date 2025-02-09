const fs = require('fs');
const path = require('path');
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

function updateEnvFile() {
    const ipAddress = getLocalIPv4();
    const envPath = path.join(__dirname, '../../.env');

    try {
        let envContent = fs.readFileSync(envPath, 'utf8');

        envContent = envContent.replace(/HOST=.*$/m, `HOST=${ipAddress}`);
        envContent = envContent.replace(/ALLOWED_ORIGINS=.*$/m, `ALLOWED_ORIGINS=https://${ipAddress}:3000`);

        fs.writeFileSync(envPath, envContent);
    } catch (error) {
        console.error('Error updating .env file:', error);
    }
}

module.exports = { getLocalIPv4, updateEnvFile };
