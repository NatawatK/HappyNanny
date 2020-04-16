import { db, adminFirestoreFieldValue } from '../db'
import { NoUserError } from '../errors'
import get from 'lodash/get'
import { unsubscribeTopic } from '../controllers/services/notification'

// interfaces
interface CreateUserInput {
  userId: string
  firstName: string
  lastName: string
  gender: string
  email: string
}

interface CheckAuthorityInput {
  userId: string
  channelId: string
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
const getUser = async (userId: string) => {
  try {
    const doc = db.collection('users').doc(userId)
    const user = await doc.get()

    return user.data()
  } catch (err) {
    console.log('Error getting user', err)
    throw err
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

// Check user authority
const checkAuthority = async (input: CheckAuthorityInput) => {
  try {
    const { userId, channelId } = input
    const userRef = db.collection('users').doc(userId)
    const user = await userRef.get()
    
    if (!user) {
      throw new NoUserError('No user')
    }
    
    if (user && get(user.data(), 'channels').includes(channelId)) {
      return true
    }
  
    return false
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Add Channel to user.channel
const addChannelToUser = (input: { targetId: string, channelId: string, subscriptionArn: string }) => {
  try {
    const { targetId, channelId, subscriptionArn } = input
    db.collection('users').doc(targetId).update({
      channels: adminFirestoreFieldValue.arrayUnion(channelId),
      subscribes: adminFirestoreFieldValue.arrayUnion(subscriptionArn)
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Remove Channel from user
const removeChannelFromUser = async(input: { targetId: string, channelId: string }) => {
  try {
    const { targetId, channelId } = input
    const { channels, subscribes } = await getUser(targetId)
    const subscriptionArn = subscribes[channels.find(channelId)]
    unsubscribeTopic(subscriptionArn)

    db.collection('users').doc(targetId).update({
      channels: adminFirestoreFieldValue.arrayRemove(channelId),
      subscribes: adminFirestoreFieldValue.arrayUnion(subscriptionArn)
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Remove Channel from users list
const removeChannelFromUsersList = (channelId: string, userIdsList: string[]) => {
  try {
    userIdsList.forEach(userId => {
      removeChannelFromUser({ targetId: userId, channelId })
    })
  } catch (err) {
    throw err
  }
}

export {
  createUser,
  getAllUsers,
  getUser,
  checkAuthority,
  addChannelToUser,
  removeChannelFromUser,
  removeChannelFromUsersList
}
