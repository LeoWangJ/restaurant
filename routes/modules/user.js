const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({dest:'temp/'})

router.get('/signup',userController.signUpPage);
router.post('/signup',userController.signUp);
router.get('/signin',userController.signInPage);
router.post('/signin',passport.authenticate('local',{failureRedirect: '/signin', failureFlash: true}),userController.signIn);
router.get('/logout',userController.logout);
router.get('/users/top',authenticated,userController.getTopUser);
router.get('/users/:id',userController.getUser);
router.get('/users/:id/edit',userController.editUser);
router.put('/users/:id',upload.single('image'),userController.putUser);

router.post('/favorite/:restaurantId',authenticated,userController.addFavorite)
router.delete('/favorite/:restaurantId',authenticateAdmin,userController.deleteFavorite)
router.post('/like/:restaurantId',authenticated,userController.addLike)
router.delete('/like/:restaurantId',authenticateAdmin,userController.deleteLike)
router.post('/following/:id',authenticated,userController.addFollowing)
router.delete('/following/:id',authenticateAdmin,userController.deleteFollowing)

module.exports = router.routes()