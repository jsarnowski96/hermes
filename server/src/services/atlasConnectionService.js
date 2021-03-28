const mongoose = require('mongoose');

require('dotenv').config({ path: __dirname + './../../.env'});

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://' + process.env.ATLAS_USER + ':' + process.env.ATLAS_PASS + '@' + process.env.ATLAS_URL + '/' + process.env.DB_NAME + '?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

mongoose.connection.once('open', () => {
  console.log("ATLAS connection established");
});

mongoose.connection.on('reconnected', () => {
  console.log('ATLAS Connection Re-established')
})

mongoose.connection.on('disconnected', () => {
  console.log('ATLAS Disconnected')
})

mongoose.connection.on('close', () => {
  console.log('ATLAS Connection Closed')
})

mongoose.connection.on('error', (error) => {
  console.log('MONGO ERROR: ' + error);
})