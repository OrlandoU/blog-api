var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var passportjwt = require('passport-jwt')
var JWTStrategy = passportjwt.Strategy
var ExtractJwt = passportjwt.ExtractJwt
var User = require('./models/user')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var postsRouter = require('./routes/posts')

var app = express();


passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return done(null, false, { message: 'Incorrect email' })
    }
    return done(null, user)
  } catch (error) {
    done(error)
  }
}))

passport.use(new JWTStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'boots&cats' }, (jwtPayload, done) => {
  if (jwtPayload) {
    return done(null, jwtPayload)
  }
  return done(null, false)
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/auth', authRouter)

mongoose.set('strictQuery', true)
const connectionString = 'mongodb+srv://orlando:Adeus2003@cluster0.xzhigzf.mongodb.net/blog-api?retryWrites=true&w=majority'
main().catch(err => console.log(err))
async function main() {
  await mongoose.connect(connectionString)
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.sendStatus(err.status || 500);
});

module.exports = app;
