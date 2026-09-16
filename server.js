require('dotenv').config();

const express = require('express');
const { initDb } = require('./db/connect');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
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
