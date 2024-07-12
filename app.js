const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser'); // Import body-parser
const cors = require('cors'); // Import CORS
const routes = require('./routes');
const { SESSION_SECRET } = require('./config/env'); // Pastikan path ke env sesuai dengan struktur proyek

const app = express();

// Middleware untuk session
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,
    secure: false, // Sesuaikan dengan environment Anda
    maxAge: 60 * 1000 }
}));

// Middleware untuk body parser
app.use(bodyParser.json());

// Middleware untuk CORS
app.use(cors());

// Middleware untuk routes captcha
app.use('/api', routes);

// Port server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});
