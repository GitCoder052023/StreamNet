# QChat - Real-time Secure Network Chat

QChat is a secure, real-time chat application designed for local network communication. Built with modern web technologies and emphasizing security, it provides a seamless, encrypted chatting experience within your network.

## 🔐 Security Features

- **SSL/TLS Encryption**: Secure WebSocket (WSS) communications
- **Message Signing**: HMAC-SHA256 signature verification for message integrity
- **Rate Limiting**: Protection against message flooding (5 messages/10 seconds)
- **Environment Configuration**: Secure configuration management
- **Static File Protection**: ESLint ignore patterns for compiled assets

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- SSL Certificate and Key

### Installation

1. Clone the repository
2. Install dependencies:
```sh
npm install
```

3. Configure environment variables:
```sh
cp .env.example .env
```

Update the following

- .env
- PORT (default: 3000)
- `NODE_ENV`
- `JWT_SECRET`
- `ALLOWED_ORIGINS`
- SSL_KEY
- SSL_CERT
- SECRET_KEY

4. Start the development server:
```sh
npm start
```

5. Build CSS (in a separate terminal):
```sh
npm run build:css
```

## 🛠️ Technology Stack

- **Frontend**:
  - Tailwind CSS for styling
  - Socket.IO Client for real-time communication
  - Vanilla JavaScript

- **Backend**:
  - Express.js server
  - Socket.IO for WebSocket handling
  - HTTPS for secure communication
  - Crypto for message signing

## 💻 Development

- Run linting:
```sh
npm run lint
```

- Fix linting issues:
```sh
npm run lint:fix
```

## 📜 License

MIT Licensed © 2025 Hamdan Khubaib

## 🤝 Contributing

Please read our Contributing Guide and Code of Conduct before submitting pull requests.

## 🔒 Security

For security concerns, please review our Security Policy and report any vulnerabilities following the outlined procedure.

---

Built with ❤️ by Hamdan Khubaib