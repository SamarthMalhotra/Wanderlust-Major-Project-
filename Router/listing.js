const express=require("express");
const router=express.Router({mergeParams:true});
const listing=require("../models/Listing.js");
const Wrapasync=require("../Utils/wrapasync.js");
const ExpressError=require("../Utils/ExpressError.js");
const {loggedIn , isOwner ,validateListing } =require("../middleware.js");
const listingModules=require("../controllers/modules-listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});  
// Show the new listing form
router.get("/new",loggedIn,listingModules.newLisitng);

router.route("/")
//listing route it show the all records
.get(Wrapasync(listingModules.index))
//Add New Record in a data base
.post(loggedIn,validateListing,upload.single('listing[image]'),Wrapasync(listingModules.addListing)
  );
//validate listing

router.route("/:id")
//Show the Individual record according to the id value
.get(Wrapasync(listingModules.showListing)
  )
// Edit and Show the new data
.put(
   loggedIn, 
   isOwner,
   upload.single('listings[image]'),
   Wrapasync(listingModules.editListing)
  )
//Delete A record from listings
.delete(loggedIn,isOwner,Wrapasync(listingModules.destroyListing)
); 
//Edit the Record  
router.get("/:id/edit",loggedIn ,isOwner ,Wrapasync(listingModules.editformRender)
  );
  
  

module.exports=router;