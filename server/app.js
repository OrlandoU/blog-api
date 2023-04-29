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
var bcrypt = require('bcryptjs')
var cors = require('cors')

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var postsRouter = require('./routes/posts');
var imageRouter = require('./routes/images')
const bodyParser = require('body-parser');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(req.body)
  next()
})
//Local Authentication Strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return done(null, false, { message: 'Incorrect username' })
    }
    await bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return done(err, false, { message: 'Incorrect password' })
      }
      return done(null, user)
    })
    
  } catch (error) {
    done(error)
  }
}))

//Jwt Authentication Strategy
passport.use(new JWTStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: 'boots&cats' }, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload._id)
    done(null, user)
  } catch (error) {
    done(error)
  }
}))

app.use(passport.initialize());
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/images', imageRouter)
app.use('/auth', authRouter)

mongoose.set('strictQuery', true)
const connectionString = process.env.MongoDb_uri
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
