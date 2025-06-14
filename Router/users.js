const express=require("express");
const wrapasync = require("../Utils/wrapasync");
const router=express.Router({mergeParams:true});
const User=require("../models/User.js");
const passport = require("passport");
const { saveRedirecturl } = require("../middleware.js");
const userModules=require("../controllers/modules-users.js")

router.route("/signup")
//Render signup form 
.get(userModules.signupform)
//signup route
.post(wrapasync(userModules.signup));


router.route("/login")
//Render Login form
.get(userModules.loginform)
//Login route
.post(saveRedirecturl,passport.authenticate("local",{
            failureRedirect:"/user/login",
            failureFlash:true,
}),userModules.login);

//logout user
router.get("/logout",userModules.logout);

module.exports=router;