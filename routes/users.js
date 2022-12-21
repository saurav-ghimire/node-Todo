var express = require('express');
var router = express.Router();
let { isLoggedIn } = require("../middleware/authenticateMiddleware");

/* GET users listing. */
router.get('/', [isLoggedIn], function(req, res, next) {
  return res.render('users/index');
});

module.exports = router;
