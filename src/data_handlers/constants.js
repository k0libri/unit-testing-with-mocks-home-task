require('dotenv').config()

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'
const USERS_PATH = '/users'
const USERS_URL = `${API_BASE_URL}${USERS_PATH}`

const USER_DATA_HANDLER_MESSAGES = {
  LOAD_USERS_FAILED: 'Failed to load users data: {error}',
  NO_USERS_LOADED: 'No users loaded!',
  NO_SEARCH_PARAMETERS: 'No search parameters provoded!',
  NO_MATCHING_USERS: 'No matching users found!'
}

module.exports = {
  API_BASE_URL,
  USERS_PATH,
  USERS_URL,
  USER_DATA_HANDLER_MESSAGES
}
