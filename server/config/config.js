require('dotenv').config();

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDb;
let secret;

if (process.env.NODE_ENV === 'dev') {
  urlDb = process.env.MONGO_LOCAL;
  secret = process.env.SECRET_LOCAL;
} else {
  urlDb = process.env.MONGO_URI;
  secret = process.env.SECRET;
}

process.env.URL_DB = urlDb;
process.env.JWT_SECRET = secret;
