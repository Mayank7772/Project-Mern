const express = require('express');
const { test , updateUser, deleteUser , getUserListings} = require('../controllers/user.controller.js');
const verifyToken = require('../utils/verifyUser.js');

const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser); // Assuming deleteUser is similar to updateUser
router.get('/listings/:id' , verifyToken , getUserListings);

module.exports =  router;// This is the user route file where you can define all user-related routes.