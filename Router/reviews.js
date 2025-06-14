const express=require("express");
const router=express.Router({mergeParams:true});
const Wrapasync=require("../Utils/wrapasync.js");
const listing=require("../models/Listing.js");
const Review=require("../models/Review.js");
const ExpressError=require("../Utils/ExpressError.js");
const { validateReview ,loggedIn, reviewAuthor }=require("../middleware.js");
const reviewModules=require("../controllers/modules-reviews.js");
// Review POST request
router.post("/",loggedIn,validateReview,Wrapasync(reviewModules.addReview)
);
//Review Delete Request
router.delete("/:reviewId",loggedIn,reviewAuthor,Wrapasync(reviewModules.destroyReview)
)
module.exports=router;
