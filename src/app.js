const express = require('express');
const path = require('path');

const authRoutes = require('../Routes/auth');
const chatRoutes = require('../Routes/chat');

const app = express();

app.use(express.static(path.join(__dirname, '../Public')));

app.use('/auth', authRoutes); 
app.use('/chat', chatRoutes);  

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/LandingPage.html'));
});

app.get('/styles', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/style.css'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../Public/templates/404.html'));
});

module.exports = app;