const jwt = require("jsonwebtoken")
const { secret } = require("../config")

module.exports = function () {
    return function(req, res, next) {
        if(req.methods === "OPTIONS") {
            next()
        }        
        try {            
            const token = req.headers.authorization.split(" ")[1] 
            
            const Id = req.params._id || req.body._id 
            console.log(Id);       
            if(!token) {
                return res.status(403).json({message: "User unauthorized"})
            }
            const obj = jwt.verify(token, secret)  
            if(Id === obj.id || obj.roles[0] === "ADMIN"){
                next()
            }     
            else{
                return res.status(403).json({message: "Access denied"})
            }           
        } catch(e) {        
            return res.status(403).json({message: "User unauthorized"})
        }
    }
}