export interface Session {
    user: {
        id: string
        email: string
    }
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}