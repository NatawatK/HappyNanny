import { db } from './db'

// interfaces
interface CreateUserInput {
  userId: string
  firstName: string
  lastName: string
  gender: string
}

// get all users
const getAllUsers = async () => {
  try {
    const users = await db.collection('users').get()

    return users.docs.map(doc => doc.data())
  } catch (err) {
    console.log('Error getting documents', err)
  }
}

// get user with id
const getUser = async (userId: number) => {
  try {
    const doc = db.collection('users').doc(userId)
    const user = await doc.get()

    console.log('check user exist from get user', user.exists)

    return user.data()
  } catch (err) {
    console.log('Error getting user', err)
  }
}

// create user
const createUser = async (input: CreateUserInput) => {
  const { userId } = input
  try {
    const docRef = db.collection('users').doc(userId)
    const user = await docRef.get()
    console.log('user.exists', user.exists)
    if (user.exists) {
      throw new Error('User is already exist')
    }
    input['channels'] = []
    docRef.set(input)

    const generatedId = docRef.id
    
    return generatedId
  } catch (err) {
    console.log('error from create user model', err)
    throw err
  }
}

export {
  createUser,
  getAllUsers,
  getUser
}
