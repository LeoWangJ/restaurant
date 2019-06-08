var express = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var db = require('./models');
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport');
var app = express();

app.engine('handlebars',handlebars({defaultLayout: 'main'}));
app.set('view engine','handlebars')
app.use(bodyParser.urlencoded({extended:true}))
app.use(flash());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.success_message = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')
    res.locals.user = req.user
    next()
})
app.listen(3000,()=>{
    db.sequelize.sync();
    console.log('hello');
})

require('./routes')(app,passport);