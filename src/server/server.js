const fs = require('fs')
const path = require('path')
const express = require('express')
const { USERS_PATH } = require('../constants/api')
const app = express()
const port = process.env.SERVER_PORT || 3000

const pathToUsersJson = path.join(__dirname, '..', '..', 'data', 'users.json')
const users = JSON.parse(fs.readFileSync(pathToUsersJson))

app.get(USERS_PATH, function (req, res) {
  res.send(users)
})

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.listen(port, function () {
  return console.log(`listening on [${port}] port`)
})
