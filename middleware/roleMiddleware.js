const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const logger = require('../logger');

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.methods === 'OPTIONS') {
      next();
    }

    try {    
      logger.info(req, { meta: '/role_mid' });
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(403).json({ message: 'User unauthorized' });
      }
      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      userRoles.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (e) {
      logger.error(e);  
      return res.status(403).json({ message: 'User1 unauthorized' });
    }
  };
};
