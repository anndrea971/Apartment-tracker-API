require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('./auth/passport');
const { initDb } = require('./db/connect');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
  // No `cookie: { secure: true }` here on purpose: Render terminates HTTPS
  // upstream and forwards plain HTTP to this app, so a secure-only cookie
  // would silently fail to be set. The public-facing connection is still
  // HTTPS either way.
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
  });
