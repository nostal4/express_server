const Router = require('express')
const router = new Router()
const controller = require("../controllers/booksController")
const roleMiddleware = require("../middleware/roleMiddleware")

router.get("/books",roleMiddleware(["USER","ADMIN"]), controller.getBooks)
router.get("/:_id", roleMiddleware(["ADMIN"]), controller.getBook)
router.post("/", roleMiddleware(["ADMIN"]), controller.createBook)
router.delete("/:_id",roleMiddleware(["ADMIN"]), controller.deleteBook)
router.put("/",roleMiddleware(["ADMIN"]), controller.updateBook)


module.exports = router