'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN, CLIENT_ORIGIN_TWO } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const app = express();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const pageRoute = require('./routes/page');

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

var whitelist = [CLIENT_ORIGIN,  CLIENT_ORIGIN_TWO]

console.log(whitelist)

let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(
  cors(corsOptions)
);

// protected endpoints

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(express.json());


app.use('/api/users', userRoute);

app.use('/api/page', pageRoute);

app.use('/api', authRoute);

app.use((err,req,res,next) => {
  res.status(err.status || 500);

  res.json({
    message: err.message,
    error: err
  });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
