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
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    origin: true,
    credentials: true
}));

app.use(errorHandler);

app.use(morgan('common'));

app.use(express.static('public'))

const authRouter = require('./controllers/authController');
const registerRouter = require('./controllers/registerController');

const projectRouter = require('./routes/protected/project');
const taskRouter = require('./routes/protected/task');
const teamRouter = require('./routes/protected/team');
const repositoryRouter = require('./routes/protected/repository');
const userRouter = require('./routes/protected/user');
const { ensureAuthenticated } = require('./middleware/auth');
  
app.use(passport.initialize());

app.use('/auth/login', authRouter);
app.use('/auth/register', registerRouter);

// Enforce JWT token auth middleware for every route within the app
app.all('*', ensureAuthenticated);

app.use('/project', projectRouter);
app.use('/task', taskRouter);
app.use('/team', teamRouter);
app.use('/repository', repositoryRouter);
app.use('/user', userRouter);

module.exports = app;