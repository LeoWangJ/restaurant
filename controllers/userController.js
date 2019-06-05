const bcrypt = require('bcrypt-nodejs');
const db = require('../models');
const User = db.User;

const UserController = {
    signUpPage(req, res) {
        return res.render('signup')
    },
    signUp(req,res){
        console.log(req.body)
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10),null)
        }).then(()=>{
            return res.redirect('signin')
        })
    }
}

module.exports = UserController;
