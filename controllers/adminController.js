var db = require('../models');
var Restaurants = db.Restaurant;
let adminController = {
    getRestaurants: (req, res) =>{
        console.log('??????')
        return Restaurants.findAll().then(restaurants=>{
            console.log(restaurants)
            return res.render('admin/restaurants',{restaurants:restaurants}) 
        })
    },
    createRestaurants: (req,res) =>{
        return res.render('admin/create')
    },
    postRestaurants:(req,res) =>{
        if(!req.body.name){
            req.flash('error_messages',"name didn't exist")
            return res.redirect('back')
        }

        return Restaurants.create({
            name:req.body.name,
            tel:req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description
        }).then(restaurant=>{
            req.flash('success_messages','restaurant was successfully created');
            res.redirect('/admin/restaurants');
        })
    },
    getRestaurant:(req,res) =>{
        return Restaurants.findByPk(req.params.id).then(restaurant=>{
            return res.render('admin/restaurant',{restaurant:restaurant})
        })
    },
    editRestaurant:(req,res) =>{
        return Restaurants.findByPk(req.params.id).then(restaurant=>{
            return res.render('admin/create',{restaurant:restaurant});
        })
    },
    putRestaurant:(req,res) =>{
        if(!req.body.name){
            req.flash('error_messages', "name didn't exist")
            return res.redirect('back')
        }

        return Restaurants.findByPk(req.params.id).then(restaurant=>{
            restaurant.update({
                name:req.body.name,
                tel:req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description
            }).then(restaurant=>{
                req.flash('success_messages','restaurant was successfully to update');
                res.redirect('/admin/restaurants');
            })
        })
    },
    deleteRestaurant:(req,res) =>{
        return Restaurants.findByPk(req.params.id).then(restaurant=>{
            restaurant.destroy().then(restaurant=>{
                res.redirect('/admin/restaurants')
            })
        })
    }
}

module.exports = adminController