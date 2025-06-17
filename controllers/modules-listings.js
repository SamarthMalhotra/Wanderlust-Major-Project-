const listing = require("../models/Listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken=process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({ accessToken: mapboxToken});
module.exports.index=async (req,res,next)=>{
     const Alllisting=await listing.find({});
       res.render("./listings/index.ejs",{Alllisting});
};
module.exports.newLisitng=(req,res)=>{
    res.render("./listings/new_record.ejs");
};
module.exports.addListing=async (req,res,next)=>{
   let newlisting =new listing(req.body.listing);
   let result=await geocodingClient.forwardGeocode({
   query:req.body.listing.location,
   limit: 1
})
  .send()
     let url=req.file.path;
     let filename=req.file.filename;
     newlisting.image={url,filename,};
     newlisting.owner=req.user._id;  
     newlisting.geometry=result.body.features[0].geometry,
     await newlisting.save();
     req.flash('success','New listing is created');
    res.redirect("/listings");
  };

module.exports.showListing=async (req,res,next)=>{
     let  { id }=req.params;
     const record=await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
     if(!record){
        req.flash('error',"Listing doesn't exist");
        res.redirect("/listings");
     }else{
       res.render("./listings/show.ejs",{record});
    }
  };
  

module.exports.editformRender=async (req,res,next)=>{
       let { id }=req.params;
       let record=await listing.findById(id);
       if(!record){
        req.flash("error","Listing doesn't exist.");
        res.redirect("/listings");
       }else{
       let originalUrl=record.image.url;
       console.log(originalUrl);
       originalUrl=originalUrl.replace("/upload","/upload/w_200");
       console.log(originalUrl);
       res.render("./listings/edit.ejs",{record,originalUrl});
       }
  };
module.exports.editListing=async (req,res,next)=>{
      if(!req.body.listings){
        throw new ExpressError(400,"Please enter the valid listing detail.");
      }
        let { id }=req.params;
        let newlist= await listing.findByIdAndUpdate(id,{...req.body.listings})
       if(typeof req.file!="undefined"){
           let url=req.file.path;
           let filename=req.file.filaname; 
           newlist.image={url,filename};
           await newlist.save();
        }
        req.flash('success','Listing Updated');
        res.redirect(`/listings/${id}`);
    };

    
module.exports.destroyListing=async (req,res,next)=>{
  let { id }=req.params;
  let delrec=await listing.findByIdAndDelete(id);
  console.log("Delete Record is:",delrec);
  req.flash('success','Listing is Deleted');
  res.redirect("/listings");
};    
module.exports.searchListing=async (req, res) => {
  try {
    let { place, country } = req.query;
    let Alllisting=[];
    place=(place.charAt(0).toUpperCase() +place.slice(1)).trim();
    country=country.charAt(0).toUpperCase()+country.slice(1);
    const countryData = await listing.find({ country });
    const locationData = await listing.find({ location: place });
    let uniqueCountryData = countryData.filter(countryItem => {
    const match = locationData.find(locationItem => locationItem._id.equals(countryItem._id));
    return !match;
     });
       Alllisting.unshift(...locationData); 
       Alllisting.push(...uniqueCountryData);
    res.render("./listings/index.ejs",{Alllisting});
  } catch (err) {
    console.error("Search Route Error:", err);
  }
};
