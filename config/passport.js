var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcrypt-nodejs');
let db = require('../models');
let User = db.User;
let Restaurant = db.Restaurant;

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req,username, password, done) {
    User.findOne({ where:{ email: username }}).then( user =>{
      if(!user) return done(null,false,req.flash('error_messages','未有此帳號'));
      if(!bcrypt.compareSync(password, user.password)) return done(null,false,req.flash('error_messages','密碼輸入錯誤'));

      return done(null,user);
    })
  }
));

passport.serializeUser((user,cb) =>{
  cb(null,user.id)
})

passport.deserializeUser((id,cb) =>{
  User.findByPk(id,{
    include:[
      {model: Restaurant,as: 'FavoritedRestaurants'},
      {model: Restaurant,as: 'LikedRestaurants'}
    ]
  }).then(user=>{
    return cb(null,user);
  })
})

module.exports = passport;