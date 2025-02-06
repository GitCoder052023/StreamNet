// Server/routes/queryRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/authMiddleware');

module.exports = (queryController) => {
    router.post('/submit', authenticate, queryController.submitQuery.bind(queryController));
    return router;
};
