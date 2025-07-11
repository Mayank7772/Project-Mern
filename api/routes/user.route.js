const express = require('express');
const { test } = require('../controllers/user.controller.js');

const router = express.Router();

router.get('/test',test);


module.exports =  router;// This is the user route file where you can define all user-related routes.