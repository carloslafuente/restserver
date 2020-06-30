require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/user', (req, res) => {
  res.json('get User');
});

app.post('/user', (req, res) => {
  let body = req.body;
  if (body.name == undefined) {
    res.status(400).json({ ok: false, message: 'El nombre es necesario' });
  } else {
    res.json({ user: body });
  }
});

app.put('/user/:id', (req, res) => {
  let id = req.params.id;
  res.json({
    id,
  });
});

app.delete('/user/:id', (req, res) => {
  res.json('delete User');
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port: ${process.env.PORT}`);
});
