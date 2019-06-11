var db = require('../models');
const fs = require('fs');
const imgur = require('imgur-node-api');
const IMGUR_CLIENT_ID = "9e13906c7f09bc5";

var Restaurants = db.Restaurant;
var Users = db.User
var Category = db.Category
let adminController = {
    getRestaurants: (req, res) =>{
        return Restaurants.findAll({include:[Category]}).then(restaurants=>{
            return res.render('admin/restaurants',{restaurants:restaurants}) 
        })
    },
    createRestaurants: (req,res) =>{
        Category.findAll().then(categories=>{
            return res.render('admin/create',{categories:categories})
        })
    },
    postRestaurants:(req,res) =>{
        if(!req.body.name){
            req.flash('error_messages',"name didn't exist")
            return res.redirect('back')
        }
        const {file} = req;
        if(file){
            imgur.setClientID(IMGUR_CLIENT_ID);
            imgur.upload(file.path,(err,img) =>{
                return Restaurants.create({
                    name:req.body.name,
                    tel:req.body.tel,
                    address: req.body.address,
                    opening_hours: req.body.opening_hours,
                    description: req.body.description,
                    image:file ? img.data.link : null,
                    CategoryId: req.body.categoryId
                }).then(restaurant=>{
                    req.flash('success_messages','restaurant was successfully created');
                    res.redirect('/admin/restaurants');
                })
            })
        }else{
            return Restaurants.create({
                name:req.body.name,
                tel:req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image:null,
                CategoryId: req.body.categoryId
            }).then(restaurant=>{
                req.flash('success_messages','restaurant was successfully created');
                res.redirect('/admin/restaurants');
            })
        }
    },
    getRestaurant:(req,res) =>{
        return Restaurants.findByPk(req.params.id,{include:[Category]}).then(restaurant=>{
            return res.render('admin/restaurant',{restaurant:restaurant})
        })
    },
    editRestaurant:(req,res) =>{
        return Restaurants.findByPk(req.params.id).then(restaurant=>{
            Category.findAll().then(categories=>{
                return res.render('admin/create',{restaurant:restaurant,categories:categories});
            })
        })
    },
    putRestaurant:(req,res) =>{
        if(!req.body.name){
            req.flash('error_messages', "name didn't exist")
            return res.redirect('back')
        }
        var {file} = req;
        if(file){
            imgur.setClientID(IMGUR_CLIENT_ID);
            imgur.upload(file.path,(err,img)=>{
            return Restaurants.findByPk(req.params.id)
                .then((restaurant) => {
                    restaurant.update({
                    name: req.body.name,
                    tel: req.body.tel,
                    address: req.body.address,
                    opening_hours: req.body.opening_hours,
                    description: req.body.description,
                    image: file ? img.data.link : restaurant.image,
                    CategoryId: req.body.categoryId
                    }).then((restaurant) => {
                    req.flash('success_messages', 'restaurant was successfully to update')
                    res.redirect('/admin/restaurants')
                    })
                })
            })
        }else{
            return Restaurants.findByPk(req.params.id).then(restaurant=>{
                restaurant.update({
                    name:req.body.name,
                    tel:req.body.tel,
                    address: req.body.address,
                    opening_hours: req.body.opening_hours,
                    description: req.body.description,
                    image: restaurant.image,
                    CategoryId: req.body.categoryId
                }).then(restaurant=>{
                    req.flash('success_messages','restaurant was successfully to update');
                    res.redirect('/admin/restaurants');
                })
            })
        }
    },
    deleteRestaurant:(req,res) =>{
        return Restaurants.findByPk(req.params.id).then(restaurant=>{
            restaurant.destroy().then(restaurant=>{
                res.redirect('/admin/restaurants')
            })
        })
    },
    editUser: (req,res) =>{
        return Users.findAll().then(user=>{
          return res.render('admin/users',{users:user})
        })
    },
    putUser: (req,res) =>{
        if(!req.params.id){
            req.flash('error_messages', "id didn't exist");
            return res.redirect('back') 
        }

        Users.findByPk(req.params.id).then(user=>{
            if(!user){
                req.flash('error_messages', "user didn't exist");
                return res.redirect('back') 
            }else{
                user.update({
                    isAdmin:!Boolean(user.isAdmin)
                }).then(()=>{
                    req.flash('success_messages', 'user was successfully to update')
                    return res.redirect('/admin/users')
                })
            }
        })
    }
}

module.exports = adminController