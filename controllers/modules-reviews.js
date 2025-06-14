const listing=require("../models/Listing.js");
const Review=require("../models/Review.js");

module.exports.addReview=async (req,res)=>{
  let list=await listing.findById(req.params.id);
  let NewReview=new Review(req.body.review);
  NewReview.author=req.user._id;
  list.reviews.push(NewReview._id);
  await NewReview.save();
  await list.save();
  req.flash('success','New Review is created');
  console.log("Review Saved");
  res.redirect(`/listings/${req.params.id}`);
};
module.exports.destroyReview=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    let d=await Review.findByIdAndDelete(reviewId);
    console.log(d);
    req.flash('success','Review is deleted');
    res.redirect(`/listings/${id}`);
};