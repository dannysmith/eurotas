var express = require("express");
var router = express.Router();
var input = require("../controllers/input");

router.get('/', input.landingPage);

router.post('/', input.handle);

module.exports = router;