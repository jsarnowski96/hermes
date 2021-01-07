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

app.use(cors({
    methods: 'GET, POST, OPTIONS',
    origin: true,
    credentials: true
}));

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
//     next();
//  });
  
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
  
app.use(passport.initialize());

// app.use((req, res, next) => {
//     res.locals.user = req.user;
//     next();
// })

app.use('/auth/login', authRouter);
app.use('/auth/register', registerRouter);

app.use('/project', projectRouter);
app.use('/task', passport.authenticate('jwt', {session: false}), taskRouter);
app.use('/team', passport.authenticate('jwt', {session: false}), teamRouter);
app.use('/repository', passport.authenticate('jwt', {session: false}), repositoryRouter);
app.use('/user', passport.authenticate('jwt', {session: false}), userRouter);

module.exports = app;