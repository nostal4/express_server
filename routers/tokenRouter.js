const Router = require('express')
const router = new Router()
const controller = require("../controllers/tokenController")
const roleMiddleware = require("../middleware/roleMiddleware")


router.get("/user", controller.getUserByToken)
router.delete("/logout/:_id", controller.logout)
router.post("/newToken", controller.getNewTokens)

module.exports = router
