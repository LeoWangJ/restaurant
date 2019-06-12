var db = require('../models');
var Category = db.Category
module.exports = {
    getCategories: (req,res) =>{
        Category.findAll().then(categories=>{
            if(req.params.id){
                Category.findByPk(req.params.id).then(category=>{
                    return res.render(`admin/categories`,{category:category,categories:categories})
                })
            }else{
                return res.render('admin/categories',{categories:categories})
            }
        })
    },
    postCategories: (req,res) =>{
        if(!req.body.name){
            req.flash('error_messages', 'name didn\'t exist')
            return res.redirect('back')
        }
        Category.create({
            name: req.body.name
        }).then(category=>{
            req.flash('success_messages','新增分類成功');
            res.redirect('/admin/categories')
        })
    },
    putCategory: (req,res) =>{
        if(!req.body.name || req.body.name == ''){
            req.flash('error_messages','未傳入分類名稱')
            return res.redirect('back')
        }

        Category.findByPk(req.params.id).then(category=>{
            category.update({
                name:req.body.name
            }).then(success =>{
                req.flash('success_messages','更新分類名稱成功')
                return res.redirect('/admin/categories')
            })
        })
    },
    deleteCategory: (req,res) =>{
        if(!req.params.id ){
            req.flash('error_messages','未傳入分類id')
            return res.redirect('back')
        }

        Category.findByPk(req.params.id).then(category=>{
            category.destroy().then(success=>{
                req.flash('success_messages','分類已刪除成功')
                return res.redirect('/admin/categories')
            })
        })
    }
}