const bcrypt = require('bcryptjs');
const { errorHandler } = require('../utils/error');
const { User } = require('../models/user.model');
const { Listing } = require('../models/listing.model');

const test = (req, res) => {
    console.log('hello route');
    res.send('api  route');
}

const updateUser = async (req, res,next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"));
    try{
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password , 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id , {
            $set:{
                username : req.body.username,
                email : req.body.email,
                password:req.body.password,
                avatar:req.body.avatar,
            }
        },{new:true});

        const {password , ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    }
    catch(err) {
        return next(err);
    }
    
}


const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account!"));
    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('user has been deleted successfully');
    }
    catch(err) {
         next(err);
    }
}

const getUserListings = async (req, res, next) => {
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    }
    else{
        return next(errorHandler(401, "You are not authorized to view this user's listings!"));
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return next(errorHandler(404, "User not found!"));
        const {password,...rest} = user._doc; 
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


module.exports = {test, updateUser , deleteUser , getUserListings , getUser}; // Exporting the functions to be used in the route file