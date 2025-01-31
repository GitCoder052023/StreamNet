require('dotenv').config({ path: '../.env' });
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors')
const { connectToDb } = require('./config/db');
const User = require('./models/User');
const AuthController = require('./controllers/authController');
const { updateEnvFile } = require('./utils/ipConfig');

updateEnvFile();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.SPORT;

const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT)
};

const allowedOrigins = [
  'https://localhost:3000',
  `https://${process.env.HOST}:3000`
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.options('*', cors());

app.use(express.json());

connectToDb((err) => {
  if (err) {
    console.error('Failed to connect to database');
    process.exit(1);
  }

  const userModel = new User(require('./config/db').getDb());
  const authController = new AuthController(userModel);
  
  app.use('/api/auth', require('./routes/authRoutes')(authController));

  const server = https.createServer(sslOptions, app);
  server.listen(PORT, HOST, () => {
    console.log(`Server running on https://${HOST}:${PORT}`);
  });
});