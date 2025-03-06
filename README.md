# LChat - Secure, Real-time Chat with AI for Local Networks

![LChat Interface](Media/preview.png)

LChat is a secure, real-time chat application designed for local network communications with integrated AI capabilities. Built with modern web technologies and a focus on security, LChat delivers a seamless, encrypted messaging experience tailored for your local network. Enjoy features like instant messaging, AI-powered conversations through ChatLLama, robust security protocols, and an intuitive design.

## ✨ Key Features

### 💬 Messaging
- Real-time messaging powered by encrypted WebSockets.
- Message threading and reply functionality.
- Typing indicators and presence detection.
- Rate limiting: 5 messages per 10 seconds.
- Support for messages up to 5000 characters.

### 🤖 ChatLLama
- **Local AI Integration:** Chat with Ollama models running on your local network.
- **Real-Time Streaming:** Experience character-by-character AI responses powered by Socket.io.
- **Model Selection:** Choose from various Ollama models for different conversation needs.
- **Advanced Formatting:** Full markdown support with code syntax highlighting.
- **Streaming Controls:** Pause or stop AI responses at any time.
- **Conversation Management:** Auto-generated titles and searchable history.
- **Theme Customization:** Light, Dark, and System theme options.

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
- Ollama installed locally (for ChatLLama functionality)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GitCoder052023/LChat.git
   cd LChat
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
   - Create a database named `LChat` with the following collections:
     - `Users` – for user accounts.
     - `Messages` – for chat messages.
     - `otps` – for OTP verification codes.
     - `Conversations` – for ChatLLama conversation history.

5. **Gmail App Password Setup:**
   - Sign in to your [Google Account](https://myaccount.google.com/).
   - Navigate to Security → 2-Step Verification.
   - Under "App passwords," select "Other" and enter a label (e.g., "LChat").
   - Copy the generated 16-character password.

6. **Ollama Setup (for ChatLLama):**
   - Install Ollama from [ollama.ai](https://ollama.ai).
   - Pull your preferred models:
     ```bash
     ollama pull llama2
     ollama pull llama2-uncensored
     ollama pull mistral
     ```
   - Ensure Ollama is running before starting LChat.

### Environment Configuration

Update your `.env` file with your settings:

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
EMAIL_USER="REPLACE IT WITH YOUR EMAIL"
EMAIL_PASSWORD=REPLACE IT WITH YOUR PASSWORD
MONGODB_URI=mongodb://localhost:27017/LChat
OLLAMA_BASE_URL="http://localhost:11434"
```

### Start Development Server
```bash
npm run dev
```

## 🤖 Using ChatLLama

ChatLLama provides an interactive AI chat experience using your local Ollama models:

1. **Access ChatLLama:**
   - Click on the ChatLLama icon in the sidebar.
   - Or select "New AI Chat" from the conversations menu.

2. **Select a Model:**
   - Choose from available models in the dropdown.
   - Different models offer various capabilities and response styles.

3. **Chat Features:**
   - **Stream Control:** Pause or stop generation with the control buttons.
   - **Formatting:** Use markdown in your messages. AI responses support code blocks with syntax highlighting.
   - **History:** Browse past conversations that are automatically named based on content.
   - **Themes:** Switch between light and dark themes from the settings panel.

4. **Best Practices:**
   - Be clear and specific in your prompts for better results.
   - For code assistance, specify the programming language.
   - Use the search feature to find previous conversations on similar topics.

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build:css` - Build Tailwind CSS
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## 📝 License

This project is licensed under the MIT License.

## 📝 Contributing

Please read our Contributing Guide and Code of Conduct before submitting pull requests.

## 🔒 Security

For security issues, please review our Security Policy and report vulnerabilities to hamdankhuabib959@gmail.com.

---

Built with ❤️ by Hamdan Khubaib
