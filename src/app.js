const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '../Public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/index.html'));
});

app.get('/styles', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/index.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../Public/templates/404.html'));
});

module.exports = app;
