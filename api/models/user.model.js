const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    username : {
        type : String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    avatar : {
        type : String,
        default : "https://www.headshotpro.com/avatar-results/random-1.webp"
    }
}, { timestamps: true });

const User  = mongoose.model('User' , userSchema);

module.exports = { User };