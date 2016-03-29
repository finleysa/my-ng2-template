var express = require('express');
var router = express.Router();
var mime = require('mime');
var path = require('path');
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next){
  res.render('index');
});

module.exports = router;
