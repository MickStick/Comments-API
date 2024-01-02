var express = require('express');
let basicAuth = require('express-basic-auth')
var router = express.Router();

//adding basic auth
router.use(basicAuth({
  users: JSON.parse(process.env.BASIC_AUTH_USERS),
  challenge: true 
}))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Facade Posts Comments API' });
});

module.exports = router;
