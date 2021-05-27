const http = require('http');

const app = require('./app');

require('dotenv').config({ path: __dirname + './../.env'});

async function serverInit() {
  const server = http.createServer({maxHeaderSize: 16384}, app);
  const port = process.env.SERVER_PORT || 3300;
  
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

serverInit();