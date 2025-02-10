# QChat - Secure, Real-time Chat for Local Networks

![QChat Interface](Media/preview.jpeg)

QChat is a secure, real-time chat application designed for local network communications. Built with modern web technologies and a focus on security, QChat delivers a seamless, encrypted messaging experience tailored for your local network. Enjoy features like instant messaging, robust security protocols, and an intuitive design.

## ✨ Key Features

### 💬 Messaging
- Real-time messaging powered by encrypted WebSockets.
- Message threading and reply functionality.
- Typing indicators and presence detection.
- Rate limiting: 5 messages per 10 seconds.
- Support for messages up to 5000 characters.

### 🛡️ Security
- End-to-end SSL/TLS encryption.
- Message signing with HMAC-SHA256.
- Comprehensive input sanitization against XSS attacks.
- Configurable CORS protection.
- Built-in rate limiting and spam prevention.
- Secure user authentication.

### 🎨 User Interface
- Modern, responsive design built with Tailwind CSS.
- Dark mode support for comfortable viewing.
- Animated transitions and interactive UI elements.
- Customizable user avatars.
- Real-time online/offline status indicators.
- Mobile-friendly layout.

## 🚀 Getting Started

### Prerequisites
- Node.js v14 or higher
- MongoDB
- SSL certificate and key
- npm or yarn
- Gmail account for OTP email integration

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GitCoder052023/QChat.git
   cd QChat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment:**
   ```bash
   cp .env.example .env
   ```

4. **Database Setup:**
   - Install and start MongoDB.
   - Open MongoDB Compass or your shell.
   - Create a new connection using: `mongodb://localhost:27017`.
   - Create a database named `QChat` with the following collections:
     - `Users` – for user accounts.
     - `Messages` – for chat messages.
     - `otps` – for OTP verification codes.

5. **Gmail App Password Setup:**
   - Sign in to your [Google Account](https://myaccount.google.com/).
   - Navigate to Security → 2-Step Verification.
   - Under "App passwords," select "Other" and enter a label (e.g., "QChat").
   - Copy the generated 16-character password.

### Environment Configuration

Update your `.env` file with your settings:

```env
HOST=YOUR_IP_ADDRESS
PORT=3000
SPORT=4000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/QChat
SSL_KEY=/path/to/key.pem
SSL_CERT=/path/to/cert.pem
JWT_SECRET=your_jwt_secret
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### Start Development Server
```bash
npm run dev
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build:css` - Build Tailwind CSS
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

### Project Structure

```
│
├───Public
│   │   style.css
│   │
│   ├───scripts
│   │   │   contact.js
│   │   │   LandingPage.js
│   │   │   main.js
│   │   │
│   │   ├───Auth
│   │   │       login.js
│   │   │       signup.js
│   │   │       verifyOtp.js
│   │   │
│   │   ├───chat
│   │   │       chat.js
│   │   │       elements.js
│   │   │       helpers.js
│   │   │       profile.js
│   │   │       socket.js
│   │   │       users.js
│   │   │
│   │   └───info
│   │           terms.js
│   │
│   ├───styles
│   │   │   404.css
│   │   │   index.css
│   │   │   LandingPage.css
│   │   │
│   │   └───info
│   │           terms.css
│   │
│   └───templates
│       │   404.html
│       │   index.html
│       │   LandingPage.html
│       │
│       ├───Auth
│       │       login.html
│       │       Reset_Password.html
│       │       signup.html
│       │
│       ├───info
│       │       terms.html
│       │
│       ├───support
│       │       contact.html
│       │
│       └───utility
│               Verify_OTP.html
│
├───Routes
│       auth.js
│       chat.js
│       static.js
│
├───Server
│   │   server.js
│   │
│   ├───config
│   │       db.js
│   │       security.js
│   │
│   ├───controllers
│   │       authController.js
│   │       queryController.js
│   │
│   ├───models
│   │       Message.js
│   │       OTP.js
│   │       Query.js
│   │       User.js
│   │
│   ├───routes
│   │       authRoutes.js
│   │       queryRoutes.js
│   │
│   └───utils
│           authMiddleware.js
│           emailService.js
│           ipConfig.js
│           validation.js
│
└───src
    │   app.js
    │   tailwind.css
    │
    └───Engine
        │   Engine.js
        │
        ├───config
        │       app.config.js
        │       ssl.config.js
        │
        ├───sockets
        │       connectionHandler.js
        │
        └───utils
                auth.utils.js
                rateLimit.utils.js
```

## 📝 Contributing

Please read our Contributing Guide and Code of Conduct before submitting pull requests.

## 🔒 Security

For security issues, please review our Security Policy and report vulnerabilities to hamdankhuabib959@gmail.com.

---

Built with ❤️ by Hamdan Khubaib
