let db = require('../models');
let Comment = db.Comment;

let CommentController = {
    postComment: (req,res) =>{
        Comment.create({
            text: req.body.text,
            UserId: req.user.id,
            RestaurantId: req.body.restaurantId
        }).then(comment=>{
            res.redirect(`/restaurants/${req.body.restaurantId}`)
        })
    },
    deleteComment:(req,res) =>{
        Comment.findByPk(req.params.id).then(comment=>{
            comment.destroy().then(comment=>{
                res.redirect(`/restaurants/${comment.RestaurantId}`);
            });
            
        })
    }
}

module.exports = CommentController