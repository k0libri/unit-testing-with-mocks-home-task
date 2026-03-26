const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const sinon = require('sinon')
const axios = require('axios').default
const UserDataHandler = require('../src/data_handlers/user_data_handler')

const makeUsers = () => ([
  { id: 1, email: 'a@test.com', name: 'A' },
  { id: 2, email: 'b@test.com', name: 'B' }
])

describe('UserDataHandler (sinon)', function () {
  let handler

  beforeEach(() => {
    handler = new UserDataHandler()
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('constructor', function () {
    it('should initialize with empty users array', function () {
      expect(handler.users).to.deep.equal([])
    })
  })

  describe('loadUsers', function () {
    it('should fetch users data and update users array', async function () {
      const mockUsers = makeUsers()
      const getStub = sinon.stub(axios, 'get').resolves({ data: mockUsers })

      await handler.loadUsers()

      expect(getStub.calledOnceWithExactly('http://localhost:3000/users')).to.equal(true)
      expect(handler.users).to.deep.equal(mockUsers)
    })

    it('should throw an error if fetching fails', async function () {
      const getStub = sinon.stub(axios, 'get').rejects(new Error('Network error'))

      let thrownError
      try {
        await handler.loadUsers()
      } catch (error) {
        thrownError = error
      }

      expect(getStub.calledOnceWithExactly('http://localhost:3000/users')).to.equal(true)
      expect(thrownError).to.be.an('error')
      expect(thrownError.message).to.equal('Failed to load users data: Error: Network error')
    })
  })

  describe('getUserEmailsList', function () {
    it('should return a string of user emails separated by semicolons', function () {
      handler.users = makeUsers()
      expect(handler.getUserEmailsList()).to.equal('a@test.com;b@test.com')
    })

    it('should throw an error if no users are loaded', function () {
      expect(() => handler.getUserEmailsList()).to.throw('No users loaded!')
    })
  })

  describe('getNumberOfUsers', function () {
    it('should return the number of users', function () {
      handler.users = makeUsers()
      expect(handler.getNumberOfUsers()).to.equal(2)
    })

    it('should return 0 if no users are loaded', function () {
      expect(handler.getNumberOfUsers()).to.equal(0)
    })
  })

  describe('isMatchingAllSearchParams', function () {
    it('should return true if user matches all search parameters', function () {
      const user = { id: 1, email: 'a@test.com', name: 'A' }
      const searchParams = { email: 'a@test.com', name: 'A' }
      expect(handler.isMatchingAllSearchParams(user, searchParams)).to.equal(true)
    })

    it('should return false if user does not match all search parameters', function () {
      const user = { id: 1, email: 'a@test.com', name: 'A' }
      const searchParams = { email: 'b@test.com', name: 'A' }
      expect(handler.isMatchingAllSearchParams(user, searchParams)).to.equal(false)
    })
  })

  describe('findUsers', function () {
    it('should return an array of users matching search parameters', function () {
      handler.users = makeUsers()
      const searchParams = { email: 'a@test.com', name: 'A' }
      expect(handler.findUsers(searchParams)).to.deep.equal([{ id: 1, email: 'a@test.com', name: 'A' }])
    })

    it('should throw an error if no search parameters are provided', function () {
      expect(() => handler.findUsers()).to.throw('No search parameters provoded!')
    })

    it('should throw an error if no users are loaded', function () {
      const searchParams = { email: 'a@test.com', name: 'A' }
      expect(() => handler.findUsers(searchParams)).to.throw('No users loaded!')
    })

    it('should throw an error if no users match search parameters', function () {
      handler.users = makeUsers()
      const searchParams = { email: 'c@test.com', name: 'C' }
      expect(() => handler.findUsers(searchParams)).to.throw('No matching users found!')
    })

    it('should return multiple users if multiple match search parameters', function () {
      const duplicatedMatchingUsers = [
        { id: 1, email: 'a@test.com', name: 'A' },
        { id: 2, email: 'a@test.com', name: 'A' }
      ]
      handler.users = duplicatedMatchingUsers
      const searchParams = { email: 'a@test.com', name: 'A' }
      expect(handler.findUsers(searchParams)).to.deep.equal(duplicatedMatchingUsers)
    })
  })
})
