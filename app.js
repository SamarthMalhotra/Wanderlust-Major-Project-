if(process.env.NODE_ENV!="Production"){  
    require('dotenv').config();
}
//Require the Express 
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
app.engine("ejs", ejsMate);
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const flash=require("connect-flash");
const session = require('express-session');
const dburl=process.env.ATLASDB_URL;

const MongoStore=require("connect-mongo");

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
       secret:process.env.SECRET,
    },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error in Mongo Session Store",err);
});

let sessionOption={
      store,
      secret:process.env.SECRET,
      resave:false,
      saveUninitialized:true,
      cookie:{
           expires:Date.now()+7 * 24 * 60 *  60 * 1000 ,
           maxAge:7 * 24 * 60 *  60 * 1000 ,
           httpOnly:true,
      }
};

const path=require("path");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/User.js");

//Set the views engine ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));


app.use(express.json());

//Mongoose connnection start




const ExpressError=require("./Utils/ExpressError.js");
const listingsRoute=require("./Router/listing.js");
const reviewsRoute=require("./Router/reviews.js");
const userRoute=require("./Router/users.js");

app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=>{
  res.locals.currUser=req.user;
  res.locals.successMsg=req.flash('success');
  res.locals.error=req.flash('error');
  next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then((response)=>{
  console.log("MONGO DB is connected");
}).catch((err) =>{
  console.log("ERROR",err);
  });
  async function main() {
    await mongoose.connect(dburl);
}

// app.get("/",(req,res)=>{
//     res.send("Request is working");
// });

app.use("/listings",listingsRoute);
app.use("/listings/:id/review",reviewsRoute);
app.use("/user",userRoute);

app.all(/.*/,(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"} = err;
  res.status(statusCode).render("Error.ejs",{ err });
});
//Server starting
app.listen(8080,(req,res)=>{
  console.log("Request is listen");
});