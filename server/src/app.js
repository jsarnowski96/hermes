const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config({ path: __dirname + './../.env'});

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
  
app.use(morgan('dev'));

const authRouter = require('./routes/auth');
  
app.use('/auth', authRouter);

module.exports = app;