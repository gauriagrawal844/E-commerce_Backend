const UserController = require("../controllers/user.controller");
const router = require("express").Router();


router.post("/login", UserController.login);
router.post("/signup", UserController.signup);
module.exports = router;
