const { errorHandler } = require("./error");
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token ;
    if(!token) {
        return next(errorHandler(401 , "You are not authenticated!"));
    }
    jwt.verify(token , process.env.JWT_SECRET , (err,user) =>{
        if(err) return next(errorHandler(403,'Forbidden'));
        req.user = user;
        next();
    })
}

module.exports = verifyToken; // Exporting the verifyToken function to be used in the route file