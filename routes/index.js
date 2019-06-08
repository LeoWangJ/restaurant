const restController = require('../controllers/restController');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');


module.exports = (app,passport) => {
    const authenticated = (req,res,next) =>{
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect('/signin')
    }

    const authenticateAdmin = (req,res,next) =>{
        if(req.isAuthenticated()){
            if(req.user.isAdmin){
                return next()
            }
            return res.redirect('/')
        }
        return res.redirect('/signin')
    }
    app.get('/',authenticated,(req,res) =>{res.render('restaurants')})
    app.get('/restaurants',authenticated,restController.getRestaurants)

    app.get('/admin',authenticateAdmin,(req,res) =>{res.render('admin/restaurants')})
    app.get('/admin/restaurants',authenticateAdmin,adminController.getRestaurants)

    app.get('/signup',userController.signUpPage);
    app.post('/signup',userController.signUp);

    app.get('/signin',userController.signInPage);
    app.post('/signin',passport.authenticate('local',{failureRedirect: '/signin', failureFlash: true}),userController.signIn);
    app.get('/logout',userController.logout);
}