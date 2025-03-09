const express = require('express');
const path = require('path');
const ejs = require('ejs');
const getLocalIPv4 = require('./server/utils/getLocalIPv4');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || getLocalIPv4();

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => {
  res.render(path.join(__dirname, 'views', 'auth', 'login.html'), {
    process: { env: { HOST } }
  });
});
app.get('/signup', (req, res) => {
  res.render(path.join(__dirname, 'views', 'auth', 'signup.html'), {
    process: { env: { HOST } }
  });
});
app.get('/chat', (req, res) => {
  res.render(path.join(__dirname, 'views', 'chat.html'), {
    process: { env: { HOST } }
  });
});

app.get('/chat/:id', (req, res) => {
  res.redirect('/chat');
});

app.use((req, res) => {
  res.redirect('/chat');
});

app.listen(PORT, () => {
  console.log(`ChatLLama app running on port http://${HOST}:${PORT}`);
});
