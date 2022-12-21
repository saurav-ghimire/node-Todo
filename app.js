let createError = require('http-errors');
let express = require('express');
let app = express();
let path = require('path');
const fileUpload = require('express-fileupload');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require("method-override");
const flash = require('connect-flash');
const session = require('express-session');
const mongoStore = require('connect-mongo');
let passport = require('passport');
require('dotenv').config();
let cors = require('cors')

let userModel = require("./models/user");
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let rolesRouter = require('./routes/roles');
let apiRouter = require('./routes/api');
const { getPermissions } = require('./helpers/permissionHelper');
let { isLoggedIn } = require("./middleware/authenticateMiddleware");

app.use(session({
  secret: 'zSDasdSDASDASD91287assdSzassasda',
  saveUninitialized: true,
  resave: true,
  store: mongoStore.create({
    mongoUrl: process.env.MONGO_CONNECTION
  })
}));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use(fileUpload());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.use(methodOverride('_method'));

require("./database/mongoose");

app.use(async(req, res, next) => {
    res.locals['success_msg'] = req.flash('success_msg');
    res.locals['error_msg'] = req.flash('error_msg');
    res.locals['errors'] = req.flash('errors');
    res.locals['inputData'] = req.flash('inputData')[0];

    if(req.user) {
      let userWithRole = await userModel.findOne({_id: req.user._id}).populate('role_id');

      req.user.role_id = userWithRole.role_id;
      res.locals['loggedInUser'] = req.user;

      res.locals.modulePermissions = getPermissions(userWithRole);

      res.locals.checkPermission = (key, user) => {
        if(user.role_id.name === 'Super Admin'){
            return true;
        } else  {
            let permissions = user.role_id.permissions;
            if(permissions.indexOf(key)!==-1) {
              return true;
            } else {
              return false;
            }
        }
      };
    }

    next();
});

require("./database/permissionSeeder").permissionSeeder();
require("./database/roleAndUserSeeder");

app.use('/', indexRouter);
app.use('/roles', [isLoggedIn], rolesRouter);
app.use('/users', usersRouter);

app.use('/api', cors(), apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
