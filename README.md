# QChat - Real-time Local Network Chat

QChat is a lightweight, real-time chat application designed for local network communication. Built with modern web technologies, it provides a seamless and responsive chatting experience within your home or office network.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Modern UI**: Clean and responsive interface built with Tailwind CSS
- **User Presence**: Real-time user connection/disconnection notifications
- **Local Network**: Optimized for home/office network communication
- **Auto-scrolling**: Messages automatically scroll to keep the latest messages in view
- **Message Timestamps**: Each message displays the time it was sent
- **User Identifiers**: Unique user IDs with visual avatars

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/GitCoder052023/QChat.git
cd QChat
```

2. Install dependencies:
```sh
npm install
```

3. Create an environment file:
```sh
cp .env.example .env
```

4. Start the development server:
```sh
npm start
```

5. Build CSS (in a separate terminal):
```sh
npm run build:css
```

The application will be available at 

http://localhost:3000



## 🛠️ Technology Stack

- **Frontend**:
  - HTML5
  - JavaScript (Vanilla)
  - Tailwind CSS
  - Socket.IO Client

- **Backend**:
  - Node.js
  - Express.js
  - Socket.IO
  - express-session
  - helmet for security

## 🤝 Contributing

Please read our Contributing Guide and Code of Conduct before submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the 

LICENSE.md

 file for details.

## 🔐 Security

QChat includes several security features:
- CORS protection
- Rate limiting
- Helmet security headers
- Environment variable configuration

## 🙏 Acknowledgments

- Socket.IO team for the real-time engine
- Tailwind CSS team for the utility-first CSS framework
- All contributors who help improve this project

---

For issues, feature requests, or questions, please use the [GitHub issue tracker](https://github.com/GitCoder052023/QChat/issues).

*Built with ❤️ for the open-source community*