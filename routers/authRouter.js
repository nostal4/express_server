const Router = require('express')
const router = new Router()
const controller = require("../controllers/authController")
const {check} = require("express-validator")
const roleMiddleware = require("../middleware/roleMiddleware")

router.post("/registration", [
    check("username", "Username can not be empty").notEmpty(),
    check("password", "Password must be longer than 4 symbols and shorter than 16 symbols").isLength({min:4, max:16})
], controller.registration)
router.post("/login", controller.login)

module.exports = router