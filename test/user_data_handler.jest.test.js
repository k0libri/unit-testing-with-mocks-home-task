const { describe, it, beforeEach, expect } = require('@jest/globals')
const axios = require('axios')
const UserDataHandler = require('../src/data_handlers/user_data_handler')
jest.mock('axios')

const makeUsers = () => ([
  { id: 1, email: 'a@test.com', name: 'A' },
  { id: 2, email: 'b@test.com', name: 'B' }
])

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
      const mockUsers = makeUsers()
      axios.get.mockResolvedValue({ data: mockUsers })
      await handler.loadUsers()

      expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/users')
      expect(handler.users).toEqual(mockUsers)
    })

    it('should throw an error if fetching fails', async function () {
      axios.get.mockRejectedValue(new Error('Network error'))
      await expect(handler.loadUsers()).rejects.toThrow('Failed to load users data: Error: Network error')
    })
  })

  describe('getUserEmailsList', function () {
    it('should return a string of user emails separated by semicolons', function () {
      handler.users = makeUsers()
      expect(handler.getUserEmailsList()).toBe('a@test.com;b@test.com')
    })

    it('should throw an error if no users are loaded', function () {
      expect(() => handler.getUserEmailsList()).toThrow('No users loaded!')
    })
  })

  describe('getNumberOfUsers', function () {
    it('should return the number of users', function () {
      handler.users = makeUsers()
      expect(handler.getNumberOfUsers()).toBe(2)
    })

    it('should return 0 if no users are loaded', function () {
      expect(handler.getNumberOfUsers()).toBe(0)
    })
  })

  describe('isMatchingAllSearchParams', function () {
    it('should return true if user matches all search parameters', function () {
      const user = { id: 1, email: 'a@test.com', name: 'A' }
      const searchParams = { email: 'a@test.com', name: 'A' }
      expect(handler.isMatchingAllSearchParams(user, searchParams)).toBe(true)
    })

    it('should return false if user does not match all search parameters', function () {
      const user = { id: 1, email: 'a@test.com', name: 'A' }
      const searchParams = { email: 'b@test.com', name: 'A' }
      expect(handler.isMatchingAllSearchParams(user, searchParams)).toBe(false)
    })
  })

  describe('findUsers', function () {
    it('should return an array of users matching search parameters', function () {
      handler.users = makeUsers()
      const searchParams = { email: 'a@test.com', name: 'A' }
      expect(handler.findUsers(searchParams)).toEqual([{ id: 1, email: 'a@test.com', name: 'A' }])
    })

    it('should throw an error if no search parameters are provided', function () {
      expect(() => handler.findUsers()).toThrow('No search parameters provoded!')
    })

    it('should throw an error if no users are loaded', function () {
      const searchParams = { email: 'a@test.com', name: 'A' }
      expect(() => handler.findUsers(searchParams)).toThrow('No users loaded!')
    })

    it('should throw an error if no users match search parameters', function () {
      handler.users = makeUsers()
      const searchParams = { email: 'c@test.com', name: 'C' }
      expect(() => handler.findUsers(searchParams)).toThrow('No matching users found!')
    })

    it('should return multiple users if multiple match search parameters', function () {
      const duplicatedMatchingUsers = [
        { id: 1, email: 'a@test.com', name: 'A' },
        { id: 2, email: 'a@test.com', name: 'A' }
      ]
      handler.users = duplicatedMatchingUsers
      const searchParams = { email: 'a@test.com', name: 'A' }
      expect(handler.findUsers(searchParams)).toEqual(duplicatedMatchingUsers)
    })
  })
})
