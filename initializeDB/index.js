const mongoose=require("mongoose");
const listing=require("../models/Listing");
const sampleListings=require("./data.js")
const Mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main().then((response)=>{
 console.log("MONGO DB is connected");
}).catch((err) =>{
 console.log("ERROR");
 console.log(err);
});
async function main() {
  await mongoose.connect(Mongo_url);
}
const initDB=async (newdata)=>{
     await listing.deleteMany({});
      let newinfo=sampleListings.data.map((object)=>({...object ,owner:"681891cd399174f1ac3d2f25"}));
     await listing.insertMany(newinfo);
    console.log("Data is initialize Well");   
}
initDB(sampleListings);