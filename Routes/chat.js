const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index.html', {
    process: {
      env: {
        HOST: process.env.HOST
      }
    }
  });
});

module.exports = router;