var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promotion = require('./routes/promotion');
var leaders = require('./routes/leaders');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected correctly to the Server');
},(err)  => { console.log(err);});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/dishes',dishRouter);
app.use('/promotion',promotion);
app.use('/leaders',leaders);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Basic Authentiation 
// function auth (req, res, next) {
//   console.log(req.headers);
//   var authHeader = req.headers.authorization;
//   if (!authHeader) {
//       var err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       next(err);
//       return;
//   }

//   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//   var user = auth[0];
//   var pass = auth[1];
//   if (user == 'admin' && pass == 'password') {
//       next(); // authorized
//   } else {
//       var err = new Error('You are not authenticated!');
//       res.setHeader('WWW-Authenticate', 'Basic');      
//       err.status = 401;
//       next(err);
//   }
// }

//cookies set up with basic authentication

//app.use(cookieParser('12345-67890-09876-54321'));
//in this we are using secret key in cokkieparser

//function auth (req, res, next) {

  //if (!req.signedCookies.user) {
    //if signedcokkie dose note exit then we are using basic authentication and here user is the property.
    // var authHeader = req.headers.authorization;
    // if (!authHeader) {
    //     var err = new Error('You are not authenticated!');
    //     res.setHeader('WWW-Authenticate', 'Basic');              
    //     err.status = 401;
    //     next(err);
    //     return;
    // }
    // var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    // var user = auth[0];
    // var pass = auth[1];
    // if (user == 'admin' && pass == 'password') {
    //     req.cookie('user','admin',{signed: true});
    //     // if user is authorized then we are setting up the cookie..here user as name whic contain in string and admin is user field
//         next(); 
//     } else {
//         var err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');              
//         err.status = 401;
//         next(err);
//     }
//   }
//   else {
//     //this else part we are using becoz signed cokkie exit
//       if (req.signedCookies.user === 'admin') {
//           next();
//       }
//       else {
//           var err = new Error('You are not authenticated!');
//           err.status = 401;
//           next(err);
//       }
//   }
//   
// }
//app.use(auth);

app.use(session({
  name:'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
  //all middleware session is all set 
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);

//for session created part-1
//function auth (req, res, next) {
  //  console.log(req.session);
  //if (!req.session.user) {
//if session dose note exit then we are using basic authentication and here user is the property.
    //var authHeader = req.headers.authorization;
    //if (!authHeader) {
      //  var err = new Error('You are not authenticated!');
        //res.setHeader('WWW-Authenticate', 'Basic');              
    //     err.status = 401;
    //     next(err);
    //     return;
    // }
    // var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    // var user = auth[0];
    // var pass = auth[1];
    // if (user == 'admin' && pass == 'password') {
    //     req.session.user =  'admin';
    //     // if user is authorized then we are setting up the session...here user as name whic contain in string and admin is user field
  //       next(); //authorized
  //   } else {
  //       var err = new Error('You are not authenticated!');
  //       res.setHeader('WWW-Authenticate', 'Basic');              
  //       err.status = 401;
  //       next(err);
  //   }
  // }
  // else {
    //this else part we are using becoz session exit
//       if (req.session.user === 'admin') {
//           next();
//       }
//       else {
//           var err = new Error('You are not authenticated!');
//           err.status = 401;
//           next(err);
//       }
//   }
// }
// app.use(auth);
 
//fully session with authentizaTION PART -2

function auth (req, res, next) {
  console.log(req.session);

if(!req.session.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err);
}
else {
  if (req.session.user === 'authenticated') {
    next();
  }
  else {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err);
  }
}
}
app.use(auth);


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
