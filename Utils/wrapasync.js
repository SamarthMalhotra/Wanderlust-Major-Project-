module.exports=(fun)=>{
    return function(req,res,next){
        fun(req,res,next).catch((err)=>next(err));
    }
}