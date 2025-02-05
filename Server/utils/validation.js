const { body, validationResult } = require('express-validator');

exports.validateSignup = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .custom(email => {
      if (!email.endsWith('@gmail.com')) {
        throw new Error('Only Gmail addresses are allowed');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
];

exports.validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
