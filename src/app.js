const express = require('express');
const path = require('path');
const ejs = require('ejs');

const authRoutes = require('../Routes/auth');
const chatRoutes = require('../Routes/chat');
const staticRoutes = require('../Routes/static');

const app = express();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../Public/templates'));

app.use(express.static(path.join(__dirname, '../Public')));

app.use('/', staticRoutes);
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/LandingPage.html'));
});

app.get('/styles', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/style.css'));
});

app.get('/support/contact', (req, res) => {
  res.render('support/contact.html', {
    process: {
      env: {
        HOST: process.env.HOST
      }
    }
  });
});

app.get('/terms', (req, res) => {
  res.render('info/terms.html', {
    process: {
      env: {
        HOST: process.env.HOST
      }
    }
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../Public/templates/404.html'));
});

module.exports = app;
