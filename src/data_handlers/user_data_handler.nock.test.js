const { describe, it, beforeEach, afterEach } = require('mocha')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const UserDataHandler = require('./user_data_handler')
const { API_BASE_URL, USERS_PATH, USER_DATA_HANDLER_MESSAGES } = require('./constants')
const format = require('../utils/format')
const { user1, user2, users, duplicatedMatchingUsers } = require('./fixtures/users')

chai.use(chaiAsPromised)
const { expect } = chai

describe('UserDataHandler (nock)', function () {
  let handler

  beforeEach(() => {
    handler = new UserDataHandler()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  describe('constructor', function () {
    it('should initialize with empty users array', function () {
      expect(handler.users).to.deep.equal([])
    })
  })

  describe('loadUsers', function () {
    it('should fetch users data and update users array', async function () {
      const scope = nock(API_BASE_URL).get(USERS_PATH).reply(200, users)

      await handler.loadUsers()

      expect(scope.isDone()).to.equal(true)
      expect(handler.users).to.deep.equal(users)
    })

    it('should throw an error if fetching fails', async function () {
      const scope = nock(API_BASE_URL).get(USERS_PATH).replyWithError('Network error')

      await expect(handler.loadUsers()).to.be.rejectedWith(
        Error,
        format(USER_DATA_HANDLER_MESSAGES.LOAD_USERS_FAILED, { error: new Error('Network error') })
      )
      expect(scope.isDone()).to.equal(true)
    })
  })

  describe('getUserEmailsList', function () {
    it('should return a string of user emails separated by semicolons', function () {
      handler.users = users
      const expectedEmails = users.map(({ email }) => email).join(';')
      expect(handler.getUserEmailsList()).to.equal(expectedEmails)
    })

    it('should throw an error if no users are loaded', function () {
      expect(() => handler.getUserEmailsList()).to.throw(USER_DATA_HANDLER_MESSAGES.NO_USERS_LOADED)
    })
  })

  describe('getNumberOfUsers', function () {
    it('should return the number of users', function () {
      handler.users = users
      expect(handler.getNumberOfUsers()).to.equal(2)
    })

    it('should return 0 if no users are loaded', function () {
      expect(handler.getNumberOfUsers()).to.equal(0)
    })
  })

  describe('isMatchingAllSearchParams', function () {
    it('should return true if user matches all search parameters', function () {
      const searchParams = { email: user1.email, name: user1.name }
      expect(handler.isMatchingAllSearchParams(user1, searchParams)).to.equal(true)
    })

    it('should return false if user does not match all search parameters', function () {
      const searchParams = { email: user2.email, name: user1.name }
      expect(handler.isMatchingAllSearchParams(user1, searchParams)).to.equal(false)
    })
  })

  describe('findUsers', function () {
    it('should return an array of users matching search parameters', function () {
      handler.users = users
      const searchParams = { email: user1.email, name: user1.name }
      expect(handler.findUsers(searchParams)).to.deep.equal([user1])
    })

    it('should throw an error if no search parameters are provided', function () {
      expect(() => handler.findUsers()).to.throw(USER_DATA_HANDLER_MESSAGES.NO_SEARCH_PARAMETERS)
    })

    it('should throw an error if no users are loaded', function () {
      const searchParams = { email: user1.email, name: user1.name }
      expect(() => handler.findUsers(searchParams)).to.throw(USER_DATA_HANDLER_MESSAGES.NO_USERS_LOADED)
    })

    it('should throw an error if no users match search parameters', function () {
      handler.users = users
      const searchParams = { email: 'not-matching@example.com', name: 'Not Matching' }
      expect(() => handler.findUsers(searchParams)).to.throw(USER_DATA_HANDLER_MESSAGES.NO_MATCHING_USERS)
    })

    it('should return multiple users if multiple match search parameters', function () {
      handler.users = duplicatedMatchingUsers
      const searchParams = { email: user1.email, name: user1.name }
      expect(handler.findUsers(searchParams)).to.deep.equal(duplicatedMatchingUsers)
    })
  })
})
