var express = require('express');
var handlebars = require('express-handlebars');
var app = express();

app.engine('handlebars',handlebars());
app.set('view engine',handlebars)


app.listen(3000,()=>{
    console.log('hello');
})
