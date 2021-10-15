const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Users = require('./auth-model')
const { checkUsernameExist, validateUserPayload, checkLoginUsername } = require('./auth-middleware')
const tokenBuilder = require('./token-builder')
require('dotenv').config()

router.post('/register', validateUserPayload, checkUsernameExist, (req, res, next) => {
  let user = req.body
  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 4
  const hash = bcrypt.hashSync(user.password, rounds)
  user.password = hash

  Users.add(user)
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});


router.post('/login', validateUserPayload, checkLoginUsername, (req, res, next) => {
  const { username, password } = req.body
  Users.findBy({ username })
    .then(([user]) => {
      if (bcrypt.compareSync(password, user.password)) {
        const token = tokenBuilder(user)
        res.status(200).json({
          message: `welcome, ${user.username}`,
          token
        })
      } else {
        next({
          status: 401,
          message: 'invalid credentials'
        })
      }
    })
    .catch(next)
})

module.exports = router;
