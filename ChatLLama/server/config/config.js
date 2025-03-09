const dotenv = require('dotenv');
dotenv.config({path: '../../../../'});

const config = {
  OLLAMA_API_URL: process.env.OLLAMA_API_URL,
  ChatLLama_MONGODB_URI: process.env.ChatLLama_MONGODB_URI,
  PORT: 5000,
  HOST: process.env.HOST
};



module.exports = config;
