# QChat - Real-time Secure Network Chat

QChat is a secure, real-time chat application designed for local network communication. Built with modern web technologies and emphasizing security, it provides a seamless, encrypted chatting experience within your network.

## 🔐 Security Features

- **SSL/TLS Encryption**: Secure communication using HTTPS and WSS (WebSocket Secure) with custom SSL certificates
- **Message Rate Limiting**: Protection against spam (limited to 5 messages per 10 seconds per user)
- **Message Size Limits**: Maximum message length of 5000 characters to prevent large payloads
- **Message Signing**: HMAC-SHA256 signature verification for message integrity using a secret key
- **Environment Security**: Sensitive configuration stored in `.env` files (SSL paths, secrets, ports)
- **HTTP Security Headers**: Using helmet middleware for enhanced HTTP security
- **CORS Protection**: Configurable allowed origins through environment variables
- **Input Sanitization**: Client-side message sanitization to prevent XSS attacks
- **Error Handling**: Custom 404 page and error routes to prevent information leakage

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