const fs = require('fs');
const path = require('path');
const getLocalIPv4 = require('../utils/getLocalIPv4');

function updateEnvFile() {
  const localIP = getLocalIPv4();
  const frontendOrigin = `http://${localIP}:3001`;
  const host = localIP;

  const envFilePath = path.join(__dirname, '../../../', '.env');

  try {
    let envData = '';
    if (fs.existsSync(envFilePath)) {
      envData = fs.readFileSync(envFilePath, 'utf8');
    }

    const keys = {
      FRONTEND_ORIGIN: frontendOrigin,
      HOST: host
    };

    for (const key in keys) {
      const value = keys[key];
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(envData)) {
        envData = envData.replace(regex, `${key}=${value}`);
      } else {
        if (envData.length > 0 && envData[envData.length - 1] !== '\n') {
          envData += '\n';
        }
        envData += `${key}=${value}\n`;
      }
    }
    fs.writeFileSync(envFilePath, envData, 'utf8');
  } catch (err) {
    console.error('Error updating .env file:', err);
  }
}

module.exports = updateEnvFile;