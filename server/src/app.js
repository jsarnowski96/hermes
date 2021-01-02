const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const passport = require('passport');
require('./config/passport');

const atlasConnection = require('./middleware/atlasConnection');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
       next();
 });
  
app.use(errorHandler);

app.use(morgan('common'));

app.use(express.static('public'))

const authRouter = require('./controllers/authController');
const registerRouter = require('./controllers/registerController');

const dashboardRouter = require('./routes/protected/dashboard');
  
app.use('/auth/login', authRouter);
app.use('/auth/register', registerRouter);

app.use('/dashboard', passport.authenticate('jwt', {session: false}), dashboardRouter);

module.exports = app;