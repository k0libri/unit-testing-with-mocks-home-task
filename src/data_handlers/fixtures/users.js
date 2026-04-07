const user1 = { id: 1, email: 'a@test.com', name: 'A' }
const user2 = { id: 2, email: 'b@test.com', name: 'B' }

const users = [user1, user2]
const duplicatedMatchingUsers = [
  { id: 1, email: user1.email, name: user1.name },
  { id: 2, email: user1.email, name: user1.name }
]

module.exports = {
  user1,
  user2,
  users,
  duplicatedMatchingUsers
}
