const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('express-jwt');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('./config/passport');
require('./services/atlasConnectionService');

require('dotenv').config({ path: __dirname + './../.env'});

// importing auth middleware
const { isAuthenticated } = require('./middleware/authenticator');

const app = express();

app.use(cors({
    methods: 'GET, POSTgit push, OPTIONS',
    origin: ['http://localhost:3000'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    preflightContinue: false,
    credentials: true
}));

app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//app.use(errorHandler);

app.use(morgan('common'));

app.use(express.static('public'))

const authRouter = require('./routes/protected/authRoutes');
const registerRouter = require('./routes/public/registerRoutes');

const projectRouter = require('./routes/protected/projectRoutes');
const taskRouter = require('./routes/protected/taskRoutes');
const teamRouter = require('./routes/protected/teamRoutes');
const companyRouter = require('./routes/protected/companyRoutes');
const userRouter = require('./routes/protected/userRoutes');
const recentRouter = require('./routes/protected/recentRoutes');
const organizatonRouter = require('./routes/protected/organizationRoutes');
const categoryRouter = require('./routes/protected/categoryRoutes');
  
app.use(cookieParser());

app.use(passport.initialize());

app.use('/register', registerRouter);
app.use('/auth', authRouter);

app.use('/project', isAuthenticated, projectRouter);
app.use('/task', isAuthenticated, taskRouter);
app.use('/team', isAuthenticated, teamRouter);
app.use('/organization', isAuthenticated, organizatonRouter);
app.use('/company', isAuthenticated, companyRouter);
app.use('/user', isAuthenticated, userRouter);
app.use('/recent', isAuthenticated, recentRouter);
app.use('/category', isAuthenticated, categoryRouter);

module.exports = app;