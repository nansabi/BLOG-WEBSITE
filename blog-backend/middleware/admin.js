const User = require("../models/user");

const adminMiddleware = async (req,res,next) =>{
    try{
        // find the logged in user using the tokenID
        const user = await User.findById(req.userId);

        // if user not found
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        // if user exists check the role 
        if(user.role != "admin"){
            return res.status(403).json({message : "Admin access only"});
        }
        // if user is admin then continue
        next();
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
};

module.exports = adminMiddleware;