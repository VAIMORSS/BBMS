var expres =require('express');
var router = express.Router();
var controller = require("./controller");
router.route('/logIn').get(controller.home);