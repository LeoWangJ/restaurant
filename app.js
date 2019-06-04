var express = require('express');
var handlebars = require('express-handlebars');
var db = require('./models');
var app = express();

app.engine('handlebars',handlebars({defaultLayout: 'main'}));
app.set('view engine','handlebars')


app.listen(3000,()=>{
    db.sequelize.sync();
    console.log('hello');
})

require('./routes')(app);