const express = require('express');
const { createListing , deleteListing , updateListing , getListing , getListings} = require('../controllers/listing.controller');
const verifyToken = require('../utils/verifyUser');



const router = express.Router();


router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deleteListing); // Assuming deleteListing is similar to createListing
router.post('/update/:id',verifyToken,updateListing); // Assuming editListing is similar to createListing 
router.get('/get/:id',getListing);  // Assuming getListing is similar to createListing (or listing details)
router.get('/get' , getListings);  // Assuming getListing is similar to createListing (or listing details)

module.exports = router;