const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const key = "475b47305747350b0712e30e3e8d77df";
const logger = require('../logger');

class weatherController {
    async getWeather(req, res) {
        const lon = req.body.lon;
        const lat = req.body.lat;
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
                lat +
                "&lon=" +
                lon +
                "&appid=" +
                key
        )
            .then(function (resp) {
                return resp.json();
            })
            .then(function (data) {
                logger.info(data, { meta: 'weather api' });
                res.send(data);
            })
            .catch(function () {
                logger.error('weather api error');               
            });
    }
}

module.exports = new weatherController();