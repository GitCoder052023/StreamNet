# StreamNet – Secure, Real-Time Chat for Local Networks with AI Support

![Real-Time Messaging](https://img.shields.io/badge/Real--Time%20Messaging-Instant-blue)
![AI Chat](https://img.shields.io/badge/AI%20Chat-Ollama%20Powered-8A2BE2?logo=openai)
![End-to-End Encryption](https://img.shields.io/badge/Security-E2E%20Encryption-00C853?logo=shield)
![Local Network](https://img.shields.io/badge/Local%20Network-Offline%20Chat-FF9800?logo=wifi)
![Dark Mode](https://img.shields.io/badge/UI-Dark%20Mode-212121?logo=visualstudiocode)
![Mobile-Friendly](https://img.shields.io/badge/Responsive-Mobile%20Optimized-4CAF50?logo=android)
![Community Driven](https://img.shields.io/badge/Community-Open%20for%20Feedback-1E88E5?logo=github)
![MIT License](https://img.shields.io/badge/License-MIT-FDD835?logo=book)

![StreamNet Interface](Media/preview.png)

StreamNet is a secure, real-time chat application designed for local network communications with integrated AI capabilities. Built with modern web technologies and a focus on security, StreamNet delivers a seamless, encrypted messaging experience tailored for your local network. Enjoy features like instant messaging, AI-powered conversations through ChatLLama, robust security protocols, and an intuitive design.

## Table of Contents

### Overview
- [About StreamNet](#streamnet--secure-real-time-chat-for-local-networks-with-ai-support)
- [Preview](#streamnet-interface)

### Features
- [Key Features Overview](#-key-features)
  - [Real-Time Messaging](#-messaging)
  - [ChatLLama Integration](#-chatllama)
  - [Security Features](#-security)
  - [User Interface](#-user-interface)

### Setup Guide
- [Getting Started](#-getting-started)
  - [System Requirements](#prerequisites)
  - [Installation Guide](#installation-steps)
  - [Configuration](#environment-configuration)
  - [Development Server](#start-development-server)
  - [First Launch](#accessing-the-application)

### Development Resources
- [Development Guide](#-development)
  - [NPM Scripts](#available-scripts)
  - [Database Setup](#database-setup)
  - [SSL Configuration](#ssl-certificate-setup)
  - [Gmail Integration](#gmail-app-password-setup)
  - [Ollama Setup](#ollama-setup-for-chatllama)

### Project Info
- [License Information](#-license)
- [Contribution Guidelines](#-contributing)
- [Security Policy](#-security)
  - [Vulnerability Reporting](#reporting-a-vulnerability)
  - [Security Features](#security-measures)
  - [Disclosure Policy](#responsible-disclosure)

### Community
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Support](#built-with-️-by-hamdan-khubaib)

## Key Features

### 💬 Messaging
- Real-time messaging powered by encrypted WebSockets.
- Message threading and reply functionality.
- Typing indicators and presence detection.
- Rate limiting: 5 messages per 10 seconds.
- Support for messages up to 5000 characters.

### ChatLLama
- **Local AI Integration:** Chat with Ollama models running on your local network.
- **Real-Time Streaming:** Experience character-by-character AI responses powered by Socket.io.
- **Model Selection:** Choose from various Ollama models for different conversation needs.
- **Advanced Formatting:** Full markdown support with code syntax highlighting.
- **Streaming Controls:** Pause or stop AI responses at any time.
- **Conversation Management:** Auto-generated titles and searchable history.
- **Theme Customization:** Light, Dark, and System theme options.

### Security
- End-to-end SSL/TLS encryption.
- Message signing with HMAC-SHA256.
- Comprehensive input sanitization against XSS attacks.
- Configurable CORS protection.
- Built-in rate limiting and spam prevention.
- Secure user authentication.

### User Interface
- Modern, responsive design built with Tailwind CSS.
- Dark mode support for comfortable viewing.
- Animated transitions and interactive UI elements.
- Customizable user avatars.
- Real-time online/offline status indicators.
- Mobile-friendly layout.

## Getting Started

### Prerequisites
- Node.js v14 or higher
- MongoDB
- SSL certificate and key
- npm or yarn
- Gmail account for OTP email integration
- Ollama installed locally (for ChatLLama functionality)

#### Node.js and npm
- Download Node.js v14+ from [nodejs.org](https://nodejs.org/)
- Run the installer and follow the prompts

#### MongoDB and Compass
- Install MongoDB Community Server:
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Run installer with "Complete" setup
   - Install MongoDB Compass when prompted

#### SSL Certificate Setup
1. Install OpenSSL for Windows:
   - Download from [slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)
   - Choose Win64 OpenSSL v1.1.1 or later

2. Generate SSL certificate (run in project root):
   ```bash
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ssl/private.key -out ./ssl/certificate.crt
   ```

> [!TIP]
> For Windows users: Run all commands in PowerShell or Command Prompt as Administrator


### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GitCoder052023/StreamNet.git
   cd StreamNet
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
   - Install and start MongoDB
   - Open MongoDB Compass or your shell
   - Create a new connection using: `mongodb://localhost:27017`
   - Create the following databases and collections:

     **StreamNet Database:**
     ```bash
     Database: StreamNet
     Collections:
     - Users
     - Messages
     - otps
     - Conversations
     ```

     **ChatLLama Database:**
     ```bash
     Database: ChatLLama
     Collections:
     - users
     - conversations
     ```

> [!NOTE]
> Both databases must be created before starting the application. The collections will be automatically created if they don't exist.

5. **Gmail App Password Setup:**
   - Sign in to your [Google Account](https://myaccount.google.com/).
   - Navigate to Security → 2-Step Verification.
   - Under "App passwords," select "Other" and enter a label (e.g., "StreamNet").
   - Copy the generated 16-character password.

6. **Ollama Setup (for ChatLLama):**
   - Install Ollama from [ollama.ai](https://ollama.ai).
   - Pull your preferred models:
     ```bash
     ollama pull llama2
     ollama pull llama2-uncensored
     ollama pull mistral
     ```
   - Ensure Ollama is running before starting StreamNet.

### Environment Configuration

Update your `.env` file with your settings:

```env
PORT=3000
SPORT=4000
HOST="System will configure it automatically"
NODE_ENV=development
JWT_SECRET="your_secure_jwt_secret"
ALLOWED_ORIGINS="System will configure it automatically"
SSL_KEY="path to your ssl key"
SSL_CERT="path to your ssl cert"
SECRET_KEY="your_secure_secret_key"
TOKEN_EXPIRY="24h"
SALT_ROUNDS=10
EMAIL_USER="your_email_address"
EMAIL_PASSWORD="your_app_password"
MONGODB_URI=mongodb://localhost:27017/StreamNet
FRONTEND_ORIGIN="System will configure it automatically"
OLLAMA_API_URL="http://localhost:11434"
ChatLLama_MONGODB_URI="mongodb://localhost:27017/ChatLLama"
```

### Start Development Server
```bash
npm run dev
```

After running the development server, you'll see output similar to this:

```bash
[ChatLLama:start] ChatLLama app running on port http://192.168.1.5:3001
[start] Connected to MongoDB
[start] Engine is running on port 3000
[server] Connected to MongoDB
[server] Server is running on https://192.168.1.5:4000
[server] [NETWORK INTERFACE] - StreamNet is running on https://192.168.1.5:3000
[server] [LOCAL INTERFACE] - StreamNet is running on https://localhost:3000
[ChatLLama:server] ChatLLama Server running on port http://192.168.1.5:5000
[ChatLLama:server] MongoDB connected
```

### Accessing the Application

1. Open your browser and navigate to the Network Interface URL shown in the console (e.g., `https://192.168.1.5:3000`).

> [!IMPORTANT]
> You may see a security warning like "Your connection is not private" or "This connection is not secure". This is normal when using self-signed SSL certificates in development.

2. To proceed:
   - On Chrome: Click "Advanced" and then "Proceed to site"
   - On Firefox: Click "Advanced..." and then "Accept the Risk and Continue"
   - On Edge: Click "Continue to site"

The warning appears because we're using a self-signed certificate for local development. The connection is still encrypted and safe for local network use.

## Development

### Available Scripts

- `npm run dev` - Start all services concurrently (recommended for development)
- `npm start` - Start the main Engine service
- `npm run server` - Start the WebSocket server
- `npm run ChatLLama:start` - Start the ChatLLama frontend
- `npm run ChatLLama:server` - Start the ChatLLama backend server
- `npm run build:css` - Build and watch Tailwind CSS changes
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes

> [!TIP]
> For development, using `npm run dev` is recommended as it starts all required services simultaneously.

## License

This project is licensed under the MIT License.

## Contributing

We welcome contributions from the community! Here's how you can help make StreamNet better:

### Getting Started

1. **Fork the Repository**
   - Click the 'Fork' button on GitHub
   - Clone your fork locally:
     ```bash
     git clone https://github.com/GitCoder052023/StreamNet.git
     ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Guidelines

- Follow our coding style and conventions
- Write clear, documented code
- Add unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Pull Request Process

1. Update your fork with the latest changes:
   ```bash
   git remote add upstream https://github.com/GitCoder052023/StreamNet.git
   git fetch upstream
   git merge upstream/main
   ```

2. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request with:
   - Clear title and description
   - Screenshots for UI changes
   - List of changes made

### Types of Contributions

- Bug fixes
- New features
- Documentation improvements
- UI/UX enhancements
- Performance improvements
- Test coverage

For detailed guidelines, please read our [Contributing Guide](https://github.com/GitCoder052023/StreamNet/blob/main/CONTRIBUTING.md).

> [!NOTE]
> By contributing, you agree to follow our [Code of Conduct](https://github.com/GitCoder052023/StreamNet/blob/main/CODE_OF_CONDUCT.md).

## Security

### Reporting a Vulnerability

If you discover a security vulnerability in StreamNet, please report it to us immediately. We take all security issues seriously and will address them as quickly as possible.

To report a vulnerability, please email us at `contact.khub.dev@gmail.com` with the subject line "Security Vulnerability in StreamNet". Please include the following details in your report:

- A description of the vulnerability
- Steps to reproduce the issue
- Any potential impact of the vulnerability
- Your contact information (optional)

We will acknowledge receipt of your report within 48 hours and provide a timeline for addressing the issue.

### Security Measures

- **Encryption**: All communications are encrypted using WebSockets (wss://).
- **Input Validation**: User inputs are validated to prevent injection attacks.
- **Dependency Monitoring**: We regularly update dependencies to ensure no known vulnerabilities are present.

### Responsible Disclosure

We follow the principle of responsible disclosure. We ask that you do not publicly disclose the vulnerability until we have had a chance to address it and provide a fix.

Thank you for helping us keep StreamNet secure!

---

Built with ❤️ by Hamdan Khubaib for the community.
