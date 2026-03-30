require('dotenv').config()

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const USERS_PATH = '/users'
const USERS_URL = `${API_BASE_URL}${USERS_PATH}`

module.exports = {
  API_BASE_URL,
  USERS_PATH,
  USERS_URL
}
