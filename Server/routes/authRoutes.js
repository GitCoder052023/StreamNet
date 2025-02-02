const express = require('express');
const router = express.Router();
const {
  validateSignup,
  validateLogin,
  handleValidationErrors
} = require('../utils/validation');
const { authenticate } = require('../utils/authMiddleware');

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

  // Add the logout route
  router.post(
    '/logout',
    authenticate,
    authController.logout.bind(authController)
  );

  return router;
};