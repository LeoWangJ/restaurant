const express = require('express')
const router = express.Router()
const restController = require('../controllers/restController');

router.get('/restaurants',authenticated,restController.getRestaurants)
router.get('/restaurants/feeds',authenticated,restController.getFeeds)
router.get('/restaurants/dashboard/:id',authenticated,restController.getRestaurantDashboard)
router.get('/restaurants/top',authenticated,restController.getTopRestaurant)
router.get('/restaurants/:id',authenticated,restController.getRestaurant)

module.exports = router.routes()