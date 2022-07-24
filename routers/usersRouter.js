const Router = require('express')
const router = new Router()
const controller = require("../controllers/usersController")
const roleMiddleware = require("../middleware/roleMiddleware")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/users", controller.getUsers)
router.get("/:_id", authMiddleware(), controller.getUser)
router.delete("/:_id",roleMiddleware(["ADMIN"]), controller.deleteUser)
router.put("/", roleMiddleware(["ADMIN"]), controller.updateUser)
router.put("/password", controller.changePassword)

module.exports = router
