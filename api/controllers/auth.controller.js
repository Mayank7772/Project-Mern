const {User} = require("../models/user.model.js"); // Assuming User is a Mongoose model
const bcrypt = require('bcryptjs'); // For password hashing


const signup = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with salt number 10
    const newUser = new User({ // Assuming User is a Mongoose model
        username,
        email,
        password :hashedPassword  // In a real application, you should hash the password before saving it
        });

    try {
        await newUser.save(); 
        res.status(201).json("User created successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
    
};

module.exports = { signup };