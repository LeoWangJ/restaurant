const bcrypt = require('bcrypt-nodejs');
const db = require('../models');
const User = db.User;

const UserController = {
    signUpPage(req, res) {
        return res.render('signup')
    },
    signUp(req,res){
        console.log(req.body)
        if(req.body.passwordCheck !== req.body.password){
            req.flash('error_message','兩次密碼輸入不同！');
            return res.redirect('signup');
        }
        User.findOne({where:{email:req.body.email}}).then(user=>{
            if(user){
                req.flash('error_message','信箱重複！');
                return res.redirect('signup');
            }else{
                User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10),null)
                }).then(()=>{
                    req.flash('success_message','成功註冊帳號！');
                    return res.redirect('signin')
                })
            }
        })
    },
    signInPage(req,res) {
        return res.render('signin')
    },
    signIn(req,res){
        req.flash('success_message','登入成功');
        return res.redirect('restaurants')
    },
    logout(req,res){
        req.flash('success_messages','登出成功');
        req.logout();
        return res.redirect('/signin')
    }
}

module.exports = UserController;
