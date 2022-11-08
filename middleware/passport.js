const passport = require('passport');
const passportJWT = require('passport-jwt');
const db = require('../models');
const Users = db.User;
const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

passport.use(
  new LocalStrategy(
    {
      emailField: 'email',
      passwordField: 'password',
    },
    function (email, password, cb) {
      return Users.findOne({ email, password })
        .then((user) => {
          if (!user) {
            return cb(null, false, {
              message: 'Incorrect email or password.',
            });
          }

          return cb(null, user, {
            message: 'Logged In Successfully',
          });
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    function (jwtPayload, cb) {
      //find the user in db if needed
      return Users.findOneById(jwtPayload.id)
        .then((user) => {
          console.log(cb());
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

// const authHeader = req.headers['authorization'];
// const token = authHeader && authHeader.split(' ')[1];
// if (token == null)
//   return res.status(401).send('token is required for authnetication');
// try {
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   req.userId = decoded.data;
//   req.token = token;
//   return next();
// } catch (err) {
//   return res.status(403).send('token is invalid');
// }
