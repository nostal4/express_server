const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const Token = require('../models/Token');
const logger = require('../logger');

class usersControler {
  async getUsers(req, res) {
    try {
      logger.info(req, { meta: 'getUsers' });
      const users = await User.find();
      for (let i = 0; i < users.length; i++) {
        users[i].password = null;
      }      
      return res.json(users);
    } catch (e) {
      logger.error(e);
      return res.status(404).send('not found');
    }
  }

  async getUser(req, res) {
    try {
      logger.info(req, { meta: 'getUser' });
      const { _id } = req.params;
      const user = await User.findOne({ _id });
      user.password = null;
      if (user._id) {        
        res.send(user);
      } else {
        return res.status(404).send('not found');
      }
    } catch(e) {
      logger.error(e);
      return res.status(404).send('not found');
    }
  }

  async deleteUser(req, res) {
    try {
      logger.info(req, { meta: 'deleteUser' });
      const { _id } = req.params;
      const user = await User.findByIdAndDelete({ _id });
      if (user._id) {
        await Token.deleteMany({userId:_id})
        return res.send(user);
      } else {
        return res.status(404).send('not found');
      }
    } catch(e) {
      logger.error(e);
      return res.status(404).send('not found');
    }
  }

  async updateUser(req, res) {
    logger.info(req, { meta: 'updateUser' });
    if (!req.body) return res.sendStatus(400);
    const { _id, _username, _email, _password, _role } = req.body;    
    const userRole = await Role.findOne({ value: _role });
    
    const users = await User.find();
    JSON.stringify(users);
    let usernameUsed = false;
    let emailUsed = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id != _id) {
        if (users[i].email === _email) {
          emailUsed = true;
          break;
        }
        if (users[i].username === _username) {
          usernameUsed = true;
          break;
        }
      }
    }

    if (emailUsed) {
      return res.status(405).send('email or username is used');
    }
    if (usernameUsed) {
      return res.status(405).send('username is used');
    }
    try {    
      if (!emailUsed && !usernameUsed) {
        var obj = {
          username: _username,
          email: _email,
          roles: [userRole.value]
        };
        const passChanged = _password && _password.trim().length > 4;
        if (passChanged) {
          obj.password = bcrypt.hashSync(_password, 7);
        }
        User.findByIdAndUpdate(
          { _id: _id },
          obj,
          { new: true },
          function (err, result) {
            if (err) {
              return res.status(404).send(err);
            } else {
              if (passChanged){
                Token.deleteMany({userId:_id}).then((data) => res.send(result))
              } else {
                res.send(result);
              }   
            }
          }
        );
      } else {
        return res
          .status(400)
          .json({ message: `Password must be longer than 4 symbols` });
      }
    } catch (e) {
      logger.error(e);
      return res.status(404).send();
    }
  }

  async changePassword(req, res) {
    try {
      logger.info(req, { meta: 'changePassword' });
      if (!req.body) return res.sendStatus(400);
      let { _id, _old_password, _new_password } = req.body;
      const user = await User.findOne({ _id });
      const validPassword = bcrypt.compareSync(_old_password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Incorrect Password` });
      } else {
        if (_new_password && _new_password.trim().length > 4) {
          _new_password = bcrypt.hashSync(_new_password, 7);
          var obj = { password: _new_password };
          User.findByIdAndUpdate(
            { _id: _id },
            obj,
            { new: true },
            function (err, result) {
              if (err) {
                res.status(404).send("nf");
              } else {
                Token.deleteMany({userId:_id}).then((data) => res.send('ok'))
              }
            }
          );
        } else {
          return res
            .status(400)
            .json({ message: `Password must be longer than 4 symbols` });
        }
      }
    } catch (e) {
      logger.error(e);
      return res.status(404).json({ message: `error` });
    }
  }
}

module.exports = new usersControler();
