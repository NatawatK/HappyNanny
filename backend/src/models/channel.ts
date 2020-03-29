import { db, adminFirestoreFieldValue } from './db'

interface CreateChannelInput {
  name: string
  owner: {
    id: string
    name: string
  }
}

const createChannel = async (input: CreateChannelInput) => {
  try {
    // Check if user exist
    const userRef = db.collection('users').doc(input.owner.id)
    const user = await userRef.get()
    if (!user.exists) {
      throw new Error('User does not exist')
    }
    // Add Channel to DB
    input['members'] = [input.owner.id]
    input['events'] = []
    const docRef = db.collection('channels').doc()
    docRef.set(input)
    input['id'] = docRef.id

    // Add channel for that user
    userRef.update({
      channels: adminFirestoreFieldValue.arrayUnion(docRef.id)
    })
  
    return input
  } catch (err) {
    throw err
  }
}

export {
  createChannel
}
