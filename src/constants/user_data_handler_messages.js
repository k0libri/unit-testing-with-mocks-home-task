const USER_DATA_HANDLER_MESSAGES = {
  LOAD_USERS_FAILED_PREFIX: 'Failed to load users data',
  NO_USERS_LOADED: 'No users loaded!',
  NO_SEARCH_PARAMETERS: 'No search parameters provoded!',
  NO_MATCHING_USERS: 'No matching users found!'
}

const createLoadUsersFailedMessage = (error) => `${USER_DATA_HANDLER_MESSAGES.LOAD_USERS_FAILED_PREFIX}: ${error}`

module.exports = {
  USER_DATA_HANDLER_MESSAGES,
  createLoadUsersFailedMessage
}
