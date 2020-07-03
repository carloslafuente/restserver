require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuracion global de las rutas
app.use(require('./routes/index'));

// mongoose.set('useCreateIndex', true);
mongoose
  .connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log(`Mongo database connected successfully`);
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`App running on: http://localhost:${process.env.PORT}`);
});
