const bcrypt = require('bcryptjs');
const { errorHandler } = require('../utils/error');
const { User } = require('../models/user.model');

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

module.exports = {test, updateUser}; // Exporting the functions to be used in the route file