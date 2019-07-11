
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
} 