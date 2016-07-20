// EXTERNAL REQUIREMENTS
var express = require("express"),
    morgan = require("morgan"),
    rp = require("request-promise"),
    cors = require("cors");

// INTERNAL REQUIREMENTS
var config = require("config");

// INITIALISE APP
var app = express();
var router = express.Router();

// MIDDLEWARE
app.use(morgan('dev')); 
app.use(cors());

// ROUTING
router.post("/webhook", webhook);

// CONTROLLER FUNCTIONS
function webhook(req, res) {
  console.log("RECEIVING WEBHOOK ===========================>\n\n", req);
};

// LISTEN ON PORT
app.listen(config.port);
