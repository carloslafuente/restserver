require('dotenv').config();

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDb;

if (process.env.NODE_ENV === 'dev') {
  urlDb = process.env.MONGO_LOCAL;
} else {
  urlDb = process.env.MONGO_URI;
}

process.env.URL_DB = urlDb;
