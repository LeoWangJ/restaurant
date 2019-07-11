const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController');

router.get('/admin/categories',authenticateAdmin,categoryController.getCategories)
router.get('/admin/categories/:id',authenticateAdmin,categoryController.getCategories)
router.post('/admin/categories',authenticateAdmin,categoryController.postCategories)
router.put('/admin/categories/:id',authenticateAdmin,categoryController.putCategory)
router.delete('/admin/categories/:id',authenticateAdmin,categoryController.deleteCategory)

module.exports = router.routes()