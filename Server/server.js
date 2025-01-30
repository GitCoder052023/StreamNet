require('dotenv').config({ path: '../.env' });
const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors')
const { connectToDb } = require('./config/db');
const User = require('./models/User');
const AuthController = require('./controllers/authController');

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.SPORT;

const sslOptions = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CERT)
};

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `https://${process.env.HOST}:3000`);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({
  origin: [`https://${HOST}:3000`], 
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
    console.log(`Secure server running on https://${HOST}:${PORT}`);
  });
});