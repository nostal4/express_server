const Token = require('../models/Token');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const { secret, jwtLifetime } = require('../config');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  };
  return jwt.sign(payload, secret, { expiresIn: jwtLifetime });
};

class tokensController { 
  async getNewTokens(req, res) {
    try {      
      logger.info(req, { meta: 'getNewTokens' });
      const refresh = req.headers.authorization.split(' ')[1];           
      const token_obj = await Token.findOneAndDelete({ token: refresh });
      if (!token_obj) return res.sendStatus(401);
      const user = await User.findOne({ _id: token_obj.userId });      ;
      const accessToken = generateAccessToken(user._id, user.roles);
      const refreshToken = jwt.sign({ id: user._id }, secret);
      const new_token_obj = new Token({ token: refreshToken, userId: user._id });
      await new_token_obj.save();
      return res.json({
        accessToken: accessToken,
        refreshToken: refreshToken
        });
    } catch (e) {
      logger.error(e);
      res.status(404).send();
    }
  }
  async getUserByToken(req, res) {
    try {
      logger.info(req, { meta: 'getUserByToken' });
      const token = req.headers.authorization.split(' ')[1];
      const user = jwt.verify(token, secret);
      let date = new Date();
      let result = date.getTime();
      const exp_time = Math.trunc(user.exp - result / 1000);

      if (user && exp_time > 3) {
        res.send(user);        
      } else {
        res.status(404).send('not found');
      }
    } catch (e) {
      res.status(404).send('error');      
    }
  }
  async logout(req, res) {
    try {     
      logger.info(req, { meta: 'logout' }); 
      const { _id } = req.params;
      const tokens = await Token.find();
      let found = false;
      for (let i = 0; i < tokens.length; i++) {
        if (jwt.verify(tokens[i].token, secret).id == _id) {
          await Token.findByIdAndDelete(tokens[i]._id);
          found = true;
        }
      }
      if (found) res.send('ok');
      else res.status(404).send('not found');
    } catch(e) 
    {
      logger.error(e);
      res.status(404).send('error');
    }
  }  
}

module.exports = new tokensController();
