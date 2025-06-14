const User=require("../models/User.js");

module.exports.signupform=(req,res)=>{
    res.render("./user/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    try{const {username , email, password}=req.body;
        const newUser=new User({
            email:email,
            username:username,
        })
        let registerUser=await User.register(newUser,password);
        console.log(registerUser);
// When User signup it automatically logIn
        req.login(registerUser,(err)=>{
             if(err){
                return next(err);
             }

            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        });

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/user/signup")
    }
};

module.exports.loginform=(req,res)=>{
    res.render("./user/login.ejs");
};

module.exports.login=async (req,res)=>{
            req.flash("success","Welcome back to Wanderlust");
            redirect=res.locals.redirectUrl || "/listings";
            res.redirect(redirect);
};
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success"," Logged out");
        res.redirect("/listings");
})
}
