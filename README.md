# QChat - Real-time Secure Network Chat

QChat is a secure, real-time chat application designed for local network communication. Built with modern web technologies and emphasizing security, it provides a seamless, encrypted chatting experience within your network.

![QChat Interface](Media/preview.jpeg)

## Features

### 💬 Chat Features
- Real-time messaging using WebSocket
- Reply to messages
- Typing indicators
- User presence notifications
- Message rate limiting
- Support for long messages (up to 5000 characters)

### 🎨 UI Features
- Modern, responsive design with Tailwind CSS
- Dark mode interface
- Smooth animations and transitions
- User-friendly landing page
- Custom 404 error page

### 🔐 Security Features
- SSL/TLS encryption with custom certificates
- Message signing with HMAC-SHA256
- Rate limiting (5 messages/10 seconds)
- Input sanitization against XSS
- Configurable CORS protection
- Environment-based configuration

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm
- SSL certificate and key files

### Installation

1. Clone the repository:
```bash
git clone https://github.com/GitCoder052023/QChat.git
cd QChat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update .env with your configuration:

```env
HOST=YOUR_IP_ADDRESS
PORT=3000
SPORT=4000
NODE_ENV=development
ALLOWED_ORIGINS="https://<YOUR_IP_ADDRESS>:3000"
SSL_KEY="/path/to/your/ssl/key.pem"
SSL_CERT="/path/to/your/ssl/cert.pem"
SECRET_KEY="your_secret_key_here"
JWT_SECRET="your_jwt_secret_here"
TOKEN_EXPIRY="24h"
SALT_ROUNDS=10
```

5. Start the development server:
```bash
npm start
```

6. In a separate terminal, build CSS:
```bash
npm run build:css
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start the development server
- `npm run build:css` - Build Tailwind CSS
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting


## 🔧 Technologies

- **Frontend**:
  - Vanilla JavaScript
  - Tailwind CSS
  - Socket.IO Client

- **Backend**:
  - Node.js
  - Express.js
  - Socket.IO
  - HTTPS

## 📝 Contributing

1. Read our Contributing Guide
2. Fork the repository
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## 🔒 Security

Please report security vulnerabilities as described in our Security Policy.

## 📄 License

MIT License © 2025 Hamdan Khubaib

---

Built with ❤️ by Hamdan Khubaib