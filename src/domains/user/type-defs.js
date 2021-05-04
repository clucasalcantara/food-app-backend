export const types = `
  type User {
    id: String
    name: String
    phone: String
    email: String
  }

  input UserInput {
    name: String
    phone: String
    email: String
  }
`

export const queries = `
  getUserById(id: String): User
  getAllUsers: [User]
`

export const mutations = `
  addUser(data: UserInput): insertResponse
  deleteUser(id: String): removeResponse
  updateUser(id: String, data: UserInput): updateResponse
`
