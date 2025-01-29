const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/LandingPage.html'));
});

router.get('/styles', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/style.css'));
});

module.exports = router;