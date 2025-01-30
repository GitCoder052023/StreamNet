const express = require('express');
const router = express.Router();
const {
  validateSignup,
  validateLogin,
  handleValidationErrors
} = require('../utils/validation');

module.exports = (authController) => {
  router.post(
    '/signup',
    validateSignup,
    handleValidationErrors,
    authController.signup.bind(authController)
  );

  router.post(
    '/login',
    validateLogin,
    handleValidationErrors,
    authController.login.bind(authController)
  );

  return router;
};