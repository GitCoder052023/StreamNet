const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/templates/LandingPage.html'));
});

router.get('/styles', (req, res) => {
  res.sendFile(path.join(__dirname, '../Public/style.css'));
});

router.get('/license', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Accept');

  const filePath = path.resolve(__dirname, '../LICENSE.md');

  if (!fs.existsSync(filePath)) {
    console.error('License file not found at:', filePath);
    return res.status(404).send('License file not found');
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading license file:', err);
      return res.status(500).send('Error reading license file');
    }
    res.type('text/plain').send(data);
  });
});

module.exports = router;
