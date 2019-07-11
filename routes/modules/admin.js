const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController');
const multer = require('multer');
const upload = multer({dest:'temp/'})

router.get('/admin/restaurants',authenticateAdmin,adminController.getRestaurants)
router.get('/admin/restaurants/create',authenticateAdmin,adminController.createRestaurants)
router.post('/admin/restaurants',authenticateAdmin,upload.single('image'),adminController.postRestaurants)
router.get('/admin/restaurants/:id',authenticateAdmin,adminController.getRestaurant)
router.get('/admin/restaurants/:id/edit',authenticateAdmin,adminController.editRestaurant)
router.put('/admin/restaurants/:id',authenticateAdmin,upload.single('image'),adminController.putRestaurant)
router.delete('/admin/restaurants/:id',authenticateAdmin,adminController.deleteRestaurant)
router.get('/admin/users',authenticateAdmin,adminController.editUser)
router.put('/admin/users/:id',authenticateAdmin,adminController.putUser)
module.exports = router.routes()