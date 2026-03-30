const { describe, it, beforeEach, expect } = require('@jest/globals')
const axios = require('axios')
const UserDataHandler = require('../src/data_handlers/user_data_handler')
const { USERS_URL } = require('../src/constants/api')
const { USER_DATA_HANDLER_MESSAGES, createLoadUsersFailedMessage } = require('../src/constants/user_data_handler_messages')
const { user1, user2, users, duplicatedMatchingUsers } = require('./fixtures/users')
jest.mock('axios')

describe('UserDataHandler', function () {
  let handler

  beforeEach(() => {
    handler = new UserDataHandler()
    jest.clearAllMocks()
  })

  describe('constructor', function () {
    it('should initialize with empty users array', function () {
      expect(handler.users).toEqual([])
    })
  })

  describe('loadUsers', function () {
    it('should fetch users data and update users array', async function () {
      axios.get.mockResolvedValue({ data: users })
      await handler.loadUsers()

      expect(axios.get).toHaveBeenCalledWith(USERS_URL)
      expect(handler.users).toEqual(users)
    })

    it('should throw an error if fetching fails', async function () {
      axios.get.mockRejectedValue(new Error('Network error'))
      await expect(handler.loadUsers()).rejects.toThrow(createLoadUsersFailedMessage(new Error('Network error')))
    })
  })

  describe('getUserEmailsList', function () {
    it('should return a string of user emails separated by semicolons', function () {
      handler.users = users
      const expectedEmails = users.map(({ email }) => email).join(';')
      expect(handler.getUserEmailsList()).toBe(expectedEmails)
    })

    it('should throw an error if no users are loaded', function () {
      expect(() => handler.getUserEmailsList()).toThrow(USER_DATA_HANDLER_MESSAGES.NO_USERS_LOADED)
    })
  })

  describe('getNumberOfUsers', function () {
    it('should return the number of users', function () {
      handler.users = users
      expect(handler.getNumberOfUsers()).toBe(2)
    })

    it('should return 0 if no users are loaded', function () {
      expect(handler.getNumberOfUsers()).toBe(0)
    })
  })

  describe('isMatchingAllSearchParams', function () {
    it('should return true if user matches all search parameters', function () {
      const searchParams = { email: user1.email, name: user1.name }
      expect(handler.isMatchingAllSearchParams(user1, searchParams)).toBe(true)
    })

    it('should return false if user does not match all search parameters', function () {
      const searchParams = { email: user2.email, name: user1.name }
      expect(handler.isMatchingAllSearchParams(user1, searchParams)).toBe(false)
    })
  })

  describe('findUsers', function () {
    it('should return an array of users matching search parameters', function () {
      handler.users = users
      const searchParams = { email: user1.email, name: user1.name }
      expect(handler.findUsers(searchParams)).toEqual([user1])
    })

    it('should throw an error if no search parameters are provided', function () {
      expect(() => handler.findUsers()).toThrow(USER_DATA_HANDLER_MESSAGES.NO_SEARCH_PARAMETERS)
    })

    it('should throw an error if no users are loaded', function () {
      const searchParams = { email: user1.email, name: user1.name }
      expect(() => handler.findUsers(searchParams)).toThrow(USER_DATA_HANDLER_MESSAGES.NO_USERS_LOADED)
    })

    it('should throw an error if no users match search parameters', function () {
      handler.users = users
      const searchParams = { email: 'not-matching@example.com', name: 'Not Matching' }
      expect(() => handler.findUsers(searchParams)).toThrow(USER_DATA_HANDLER_MESSAGES.NO_MATCHING_USERS)
    })

    it('should return multiple users if multiple match search parameters', function () {
      handler.users = duplicatedMatchingUsers
      const searchParams = { email: user1.email, name: user1.name }
      expect(handler.findUsers(searchParams)).toEqual(duplicatedMatchingUsers)
    })
  })
})
