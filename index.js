const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 3000;
const db = '';

const app = express();

app.use(cors());

app.get('/api/users', (req, res) => {
  res.send('todos los users');
});

app.get('/api/user/:id', (req, res) => {
  res.send(`el user con id ${req.params.id}`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
