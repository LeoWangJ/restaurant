let db = require('../models');
let Restaurant = db.Restaurant;
let Category = db.Category;
let User = db.User;
let Comment = db.Comment;
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
                description: r.dataValues.description.substring(0,50),
                isFavorited: req.user.FavoritedRestaurants.map(d=>d.id).includes(r.id),
                isLiked:req.user.LikedRestaurants.map(d=>d.id).includes(r.id)
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
        Restaurant.findByPk(req.params.id,{
            include:[Category,
                {model:Comment,include:User},
                {model:User,as:'FavoritedUsers'},
                {model:User,as:'LikedUsers'}
            ]}).then(restaurant=>{
            restaurant.increment('viewCounts',{by:1})
            const isFavorited = restaurant.FavoritedUsers.map(d=>d.id).includes(req.user.id)
            const isLiked = restaurant.LikedUsers.map(d=>d.id).includes(req.user.id)
            return res.render('restaurant',{restaurant,isFavorited,isLiked})
        })
    },
    getFeeds: (req,res) =>{
        Restaurant.findAll({limit:10, order:[['createdAt','DESC']],include:Category}).then(restaurants=>{
            Comment.findAll({limit:10, order:[['createdAt','DESC']],include:[Restaurant,User]}).then(comments =>{

                return res.render('feeds', {restaurants:restaurants,comments:comments})
            })
        })
    },
    getRestaurantDashboard: (req,res) =>{
        Restaurant.findByPk(req.params.id,{include:[Comment,Category]}).then(restaurant=>{
            Comment.findAll({where:{RestaurantId:restaurant.id}}).then(comments=>{
                return res.render('dashboard',{restaurant:restaurant,comments:comments})
            })
        })
    }
}

module.exports = restController;