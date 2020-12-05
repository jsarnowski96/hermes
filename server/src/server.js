const http = require('http');

const app = require('./app');

require('dotenv').config({ path: __dirname + './../.env'});

async function serverInit() {
  const server = http.createServer(app);
  const port = process.env.SERVER_PORT || 3300;
  
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  mongoose.connect('mongodb+srv://' + process.env.ATLAS_USER + ':' + process.env.ATLAS_PASS + '@' + process.env.ATLAS_URL + '/' + process.env.DB_NAME + '?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  
  const connection = mongoose.connection;
  
  connection.once('open', () => {
    console.log("ATLAS connection established");
  });
}

serverInit();