const bcrypt = require('bcrypt-nodejs');
const db = require('../models');
const User = db.User;
let Restaurant = db.Restaurant;
let Favorite = db.Favorite;
let Like = db.Like;
let FollowShip = db.Followship;
let Comment = db.Comment;
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = "9e13906c7f09bc5";

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
    },
    getUser(req,res){
        User.findByPk(req.params.id,{
            include: [
                {model:Comment,include:Restaurant},
                {model:Restaurant,as:'FavoritedRestaurants'},
                {model:Restaurant,as:'LikedRestaurants'},
                {model:User,as:'Followers'},
                {model:User,as:'Followings'},
            ]
        }).then(user=>{
            let FollowingsNum = user.Followings.length
            let FollowersNum = user.Followers.length
            let FavoritedRestaurantsNum = user.FavoritedRestaurants.length
            let commnetsNum = user.Comments.length
            return res.render('users',{user:user,FollowingsNum,FollowersNum,FavoritedRestaurantsNum,commnetsNum})
            
        })
    },
    editUser(req,res){
        User.findByPk(req.params.id).then(user=>{
            return res.render(`editUser`,{user:user})
        })
    },
    putUser(req,res){
        var {file} = req;
        if(file){
            imgur.setClientID(IMGUR_CLIENT_ID);
            imgur.upload(file.path,(err,img)=>{
                return User.findByPk(req.params.id).then(user=>{
                    if(req.params.id == user.id){
                        user.update({
                            name: req.body.name,
                            image: file ? img.data.link : user.image
                        }).then(user=>{
                            req.flash('success_messages', 'user was successfully to update')
                            res.redirect(`/users/${user.id}`)
                        })
                    }
                })
            })
            
        }else{
            User.findByPk(req.params.id).then(user=>{
                user.update({
                    name: req.body.name,
                    image: user.image
                }).then(user=>{
                    req.flash('success_messages', 'user was successfully to update')
                    return res.redirect(`/users/${user.id}`)
                })
            })
        }
        
    },
    addFavorite: function(req,res){
        Favorite.create({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId
        }).then(favorite=>{
            return res.redirect('back')
        })
    },
    deleteFavorite: function(req,res){
        Favorite.findOne({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId
        }).then(favorite=>{
            favorite.destroy().then(restaurant =>{
                return res.redirect('back')
            });
        })
    },
    addLike:function(req,res){
        Like.create({
            UserId:req.user.id,
            RestaurantId:req.params.restaurantId
        }).then(user=>{
            return res.redirect('back')
        })
    },
    deleteLike:function(req,res){
        Like.findOne({
            UserId:req.user.id,
            RestaurantId:req.params.restaurantId
        }).then(user=>{
            user.destroy().then(user=>{
                return res.redirect('back')
            })
        })
    },
    getTopUser: function(req,res){
        return User.findAll({
            include:[
                {model:User,as:'Followers'}
            ]
        }).then(users=>{
            users = users.map(user=>({
                ...user.dataValues,
                FollowerCount:user.Followers.length,
                isFollowed: req.user.Followings.map(d=> d.id).includes(user.id)
            }))
            users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
            return res.render('topUser',{users:users})
        })
    },
    addFollowing:function(req,res){
        FollowShip.create({
            FollowerId:req.user.id,
            FollowingId:req.params.id
        }).then(user=>{
            return res.redirect('back')
        })
    },
    deleteFollowing:function(req,res){
        FollowShip.findOne({
            FollowerId:req.user.id,
            FollowingId:req.params.id
        }).then(user=>{
            user.destroy().then(user=>{
                return res.redirect('back')
            })
        })
    }
}

module.exports = UserController;
