const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const passport = require('passport');
require('./config/passport');

var atlasConnection = require('./services/atlasConnection');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors({
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    origin: true,
    credentials: true
}));

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

// importing auth middleware
const { ensureAuthenticated } = require('./middleware/jwtAuthentication');
  
app.use(passport.initialize());

app.use('/register', registerRouter);

// /auth/login route uses Passport's LocalStrategy, therefore it's not covered by wildcard ensureAuthenticated middleware method.
app.use('/auth', authRouter);

// Issue Passport's JwtStrategy via wildcard ensureAuthenticated middleware method for all protected routes
//app.all('*', ensureAuthenticated);

app.use('/project', ensureAuthenticated, projectRouter);
app.use('/task', ensureAuthenticated, taskRouter);
app.use('/team', ensureAuthenticated, teamRouter);
app.use('/repository', ensureAuthenticated, repositoryRouter);
app.use('/company', ensureAuthenticated, companyRouter);
app.use('/user', ensureAuthenticated, userRouter);

// Use error handling middleware
app.use(errorHandler);

module.exports = app;