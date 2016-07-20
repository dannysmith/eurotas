var express = require("express");
var router = express.Router();

var pushController = require("../controllers/pushController");

router.post('/', pushController.create);

module.exports = router;