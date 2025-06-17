const listing=require("./models/Listing.js");
const Review = require("./models/Review.js");
const { listingSchema, reviewSchema}=require("./Schema.js");
//User is loggedIn or not
module.exports.loggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
         req.session.redirectUrl=req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error","Please Logged in on Wanderlust");
    return res.redirect("/user/login");
    }
    next();
};
//Redirect to user after loginIn
module.exports.saveRedirecturl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};
//Current user is Owner of listing or not
module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let list=await listing.findById(id).populate("owner");
   if(!list.owner._id.equals(res.locals.currUser._id))
   {
    req.flash("error","You are not the Owner of this listing");
    return res.redirect(`/listings/${id}`);
   }
   next();
}

 //Listing validation middleware using joi
 module.exports.validateListing=(req,res,next)=>{
     let { error }=listingSchema.validate(req.body);
     if(error){
      let errmsg=error.details.map((er)=>er.message).join(",");
      throw new  ExpressError(404,errmsg);
    }else{
      next()
}};
//Review Validation middleware using joi
module.exports.validateReview=(req,res,next)=>{
   let { error }=reviewSchema.validate(req.body);
    if(error){
      let errmsg=error.details.map((er)=>er.message).join(",");
      throw new  ExpressError(404,errmsg);
    }else{
          next()
}};
//Current user is owner of Review or not
module.exports.reviewAuthor=async(req,res,next)=>{
  let {id , reviewId}=req.params;
  let rev=await Review.findById(reviewId);
   if(!rev.author._id.equals(res.locals.currUser._id))
   {
    req.flash("error","You are not the Owner of this Review");
    return res.redirect(`/listings/${id}`);
   }
   next();
}

