let db = require('../models');
let Restaurant = db.Restaurant;
let Category = db.Category;

let restController = {
    getRestaurants: (req, res) =>{
        let whereQuery = {};
        let categoryId = '';
        if(req.query.categoryId){
          categoryId = Number(req.query.categoryId);
          whereQuery['categoryId'] = categoryId;
        }

        Restaurant.findAll({include:Category,where:whereQuery}).then(restaurant=>{
            const data = restaurant.map(r=>({
                ...r.dataValues,
                description: r.dataValues.description.substring(0,50)
            }))
            Category.findAll().then(categories=>{
                return res.render('restaurants',{
                    restaurants: data,
                    categories:categories,
                    categoryId:categoryId
                })
            })
        })
    },
    getRestaurant: (req,res) =>{
        Restaurant.findByPk(req.params.id,{include:Category}).then(restaurant=>{
            return res.render('restaurant',{restaurant})
        })
    }
}

module.exports = restController;