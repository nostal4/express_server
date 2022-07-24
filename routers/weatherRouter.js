const Router = require('express')
const express = require('express')
const router = new Router()
const jsonParser = express.json();
const controller = require("../controllers/weatherController")

router.post("/weather", controller.getWeather) 


module.exports = router