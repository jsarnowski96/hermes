const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');

require('dotenv').config({ path: __dirname + './../../common/.env'});

const server = express();
const port = process.env.SERVER_PORT || 3300;

server.use(morgan('dev'));

server.use(cors());
server.use(express.json());

mongoose.connect('mongodb+srv://' + process.env.ATLAS_USER + ':' + process.env.ATLAS_PASS + '@' + process.env.ATLAS_URL + '/' + process.env.DB_NAME + '?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log("ATLAS connection established");
});

const authRouter = require('./routes/auth');

server.use('/auth', authRouter);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});