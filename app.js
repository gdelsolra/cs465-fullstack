require('dotenv').config(); 

const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');                

// Define routers 
const indexRouter     = require('./app_server/routes/index');
const usersRouter     = require('./app_server/routes/users');
const travelRouter    = require('./app_server/routes/travel');
const apiRouter       = require('./app_api/routes/index');
const passport        = require('passport');

require('./app_api/models/db');                            // bring in DB

require('./app_api/config/passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// register partials
const handlebars = require('hbs');
handlebars.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));

// standard middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// --------------------------------------------------------------------------------
// CORS: allow only your Angular dev server and handle preflight automatically
// --------------------------------------------------------------------------------
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// mount your API under /api
app.use('/api', apiRouter);

// other routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);

// catch 404 and forward
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error   = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

//catch unauthorized error and create 401
app.use((err,req,res,next)=> {
  if (err.name === 'UnauthorizedError'){
    res
      .status(401)
      .json({"message": err.name + ": " + err.message });
    }
});


module.exports = app; 