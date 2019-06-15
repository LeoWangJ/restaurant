let db = require('../models');
let Restaurant = db.Restaurant;
let Category = db.Category;

let pageLimit = 10;

let restController = {
    getRestaurants: (req, res) =>{
        let whereQuery = {};
        let categoryId = '';
        let offset = 0;
        if(req.query.page){
            offset = Number(req.query.page -1) * pageLimit;
        }
        if(req.query.categoryId){
          categoryId = Number(req.query.categoryId);
          whereQuery['categoryId'] = categoryId;
        }

        Restaurant.findAndCountAll({include:Category,where:whereQuery,pageLimit:pageLimit,offset:offset}).then(result=>{

            let page = Number(req.query.page) || 1;
            let pages = Math.ceil(result.count/pageLimit);
            let totalPage = Array.from({length:pages}).map((item,index)=>(index+1));
            let prev = page - 1 < 1 ? 1: page - 1 
            let next = page + 1 > pages ? pages : page + 1  

            const data = result.rows.map(r=>({
                ...r.dataValues,
                description: r.dataValues.description.substring(0,50)
            }))
            Category.findAll().then(categories=>{
                return res.render('restaurants',{
                    restaurants: data,
                    categories:categories,
                    categoryId:categoryId,
                    totalPage:totalPage,
                    prev:prev,
                    next:next,
                    page:page
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