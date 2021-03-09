const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');
require('./services/atlasConnection');

// importing auth middleware
const { ensureAuthenticated } = require('./middleware/jwtAuthentication');

const app = express();

app.use(cors({
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    preflightContinue: false,
    credentials: true
}));

app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//app.use(errorHandler);

app.use(morgan('common'));

app.use(express.static('public'))

const authRouter = require('./controllers/authController');
const registerRouter = require('./controllers/registerController');

const projectRouter = require('./routes/protected/projectRoutes');
const taskRouter = require('./routes/protected/taskRoutes');
const teamRouter = require('./routes/protected/teamRoutes');
const repositoryRouter = require('./routes/protected/repositoryRoutes');
const companyRouter = require('./routes/protected/companyRoutes');
const userRouter = require('./routes/protected/userRoutes');
const recentRouter = require('./routes/protected/recentRoutes');
const organizatonRouter = require('./routes/protected/organizationRoutes');
const categoryRouter = require('./routes/protected/categoryRoutes');
  
app.use(passport.initialize());

app.use('/register', registerRouter);
app.use('/auth', authRouter);

app.use('/project', ensureAuthenticated, projectRouter);
app.use('/task', ensureAuthenticated, taskRouter);
app.use('/team', ensureAuthenticated, teamRouter);
app.use('/repository', ensureAuthenticated, repositoryRouter);
app.use('/organization', ensureAuthenticated, organizatonRouter);
app.use('/company', ensureAuthenticated, companyRouter);
app.use('/user', ensureAuthenticated, userRouter);
app.use('/recent', ensureAuthenticated, recentRouter);
app.use('/category', ensureAuthenticated, categoryRouter);

module.exports = app;