const { User } = require("../models/user.model.js"); // Assuming User is a Mongoose model
const bcrypt = require("bcryptjs"); // For password hashing
const { errorHandler } = require("../utils/error.js");
const jwt = require("jsonwebtoken"); // For token generation

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with salt number 10
  const newUser = new User({
    // Assuming User is a Mongoose model
    username,
    email,
    password: hashedPassword, // In a real application, you should hash the password before saving it
  });

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error); // Use the error handler utility
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // id from mongoose model
    const { password: pass, ...rest } = validUser._doc; // Exclude password from the response
    // _doc is used to get the plain object representation of the document
    // res.cookie is used to set a cookie in the response
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest); // Send the user data without the password
  } catch (error) {
    next(error); // Use the error handler middleware
  }
};

const google = async (req, res, next) => {
  const { name, email, image } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: email,
        password: hashedPassword,
        avatar: image,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error); // Use the error handler middleware
  }
};

const signOut = (req,res,next) => {
  try{
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out');
  }
  catch(err){
    next(err);
  }
}

module.exports = { signup, signin, google ,signOut };
