let db = require('../models');
let Restaurant = db.Restaurant;
let Category = db.Category;

let restController = {
    getRestaurants: (req, res) =>{
        Restaurant.findAll({include:Category}).then(restaurant=>{
            const data = restaurant.map(r=>({
                ...r.dataValues,
                description: r.dataValues.description.substring(0,50)
            }))
            return res.render('restaurants',{restaurants: data})
        })
    },
    getRestaurant: (req,res) =>{
        Restaurant.findByPk(req.params.id,{include:Category}).then(restaurant=>{
            return res.render('restaurant',{restaurant})
        })
    }
}

module.exports = restController;