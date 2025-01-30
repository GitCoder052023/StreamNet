const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, SALT_ROUNDS, TOKEN_EXPIRY } = require('../config/security');

class AuthController {
  constructor(userModel) {
    this.User = userModel;
  }

  async signup(req, res) {
    try {
      const { fullName, email, password } = req.body;
      
      const existingUser = await this.User.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const newUser = {
        fullName,
        email,
        password: hashedPassword,
        createdAt: new Date()
      };

      await this.User.createUser(newUser);

      const token = jwt.sign(
        { userId: email },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      res.status(201).json({ token });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await this.User.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.email },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = AuthController;