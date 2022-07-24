const Token = require('../models/Token');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { secret, jwtLifetime } = require('../config');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  };
  return jwt.sign(payload, secret, { expiresIn: jwtLifetime });
};

class tokensController {
  async getTokens(req, res) {
    try {
      const tokens = await Token.find();
      res.json(tokens);
    } catch (e) {
      res.status(404).send('not found');
    }
  }
  async getNewTokens(req, res) {
    try {
      const refresh = req.headers.authorization.split(' ')[1];
      console.log(refresh);
      if (refresh == 'null') return res.sendStatus(401);
      const token = await Token.findOne({ refresh });
      if (token === null) return res.sendStatus(404);
      else {
        const token_info = jwt.verify(token.token, secret);
        const user = await User.findOne({ _id: token_info.id });
        if (!user) return res.sendStatus(404);
        const accessToken = generateAccessToken(user._id, user.roles);
        const refreshToken = jwt.sign({ id: user._id }, secret);
        await Token.findByIdAndRemove({ _id: token.id });
        try {
          const check = await Token.findOne({ token: token.token });
          if (!check) {
            const new_token = new Token({ token: refreshToken });
            await new_token.save();
          } else {
            console.log('already saved');
          }
        } catch {}
        return res.json({
          accessToken: accessToken,
          refreshToken: refreshToken
        });
      }
    } catch (e) {
      console.log(e);
      res.status(405).send('jwt expired');
    }
  }
  async getUserByToken(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const user = jwt.verify(token, secret);
      var date = new Date();
      var result = date.getTime();
      const exp_time = Math.trunc(user.exp - result / 1000);

      if (user && exp_time > 3) {
        res.send(user);
        console.log(exp_time);
      } else {
        res.status(404).send('not found');
      }
    } catch (e) {
      res.status(404).send('error');
      console.log(e);
    }
  }
  async logout(req, res) {
    try {
      console.log('logout');
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
    } catch {
      res.status(404).send('error');
    }
  }
  async deleteToken(req, res) {
    try {
      // const { _id } = req.params;
      console.log('search');
      const tokens = await Token.find();
      console.log(tokens);
      res.json(tokens);
      for (let i = 0; i < tokens.length; i++) {
        console.log(tokens[i]);
        console.log(await Token.findByIdAndDelete({ _id: tokens[i]._id }));
      }
      // res.send("ok")

      // const token = await Token.findByIdAndDelete({ _id });
      // if (token._id) {
      //   res.send(token);
      // } else {
      //   res.status(404).send('not found');
      // }
    } catch {
      res.status(404).send('not found');
    }
  }
}

module.exports = new tokensController();
