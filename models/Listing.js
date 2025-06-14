const mongoose=require("mongoose");
const {Schema}=mongoose;
const Review=require("./Review.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
      }, 
    price: {
        type:Number,
        default:0,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }, 
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
});   
listingSchema.post("findOneAndDelete" ,async (listing)=>{
 if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
 }
});

const Listing=mongoose.model("listing",listingSchema);
module.exports=Listing;