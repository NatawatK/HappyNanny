import { db, adminFirestoreFieldValue } from '../db'
import { NoUserError } from '../errors'
import { getUserExcludeChannels } from './helper'
import omit from 'lodash/omit'
import { createTopic } from '../controllers/services/notification'

interface CreateChannelInput {
  name: string
  userId: string
  members: string[]
}

interface EventInput {
  channelId: string
  title: string
  detail: string
  startTime: string
  endTime: string
  alertTime: string
}

interface FindEventInput {
  channelId: string
  eventId: string
}

interface UpdateEventInput {
  eventId: string
  channelId: string
  event: {
    title: string
    detail: string
    startTime: string
    endTime: string
    alertTime: string
  }
}

interface AddUserToMemberInput {
  channelId: string
  user: {
    firstName: string
    lastName: string
    gender: string
    userId: string
    email: string
  }
}

async function getUsersList(userIdList: string[]) {
  const users = await db.collection('users').where('userId', 'in', userIdList).get()
  
  return users.docs.map(doc => omit(doc.data(), ['channels']))
}

const createChannel = async (input: CreateChannelInput) => {
  try {
    // Check if user exist
    const userRef = db.collection('users').doc(input.userId)
    const user = await userRef.get()
    if (!user.exists) {
      throw new NoUserError('User does not exist')
    }
    // Add Channel to DB
    const members = await getUsersList([input.userId, ...input.members])
    input['members'] = members
    input['events'] = []
    input['owner'] = await getUserExcludeChannels(input.userId)
    const docRef = db.collection('channels').doc()
    input['id'] = docRef.id

    const { TopicArn } = await createTopic(input.name)
    input['topicArn'] = TopicArn
    
    docRef.set(input)

    // Add channel for all users
    members.forEach(member => {
      const memberRef = db.collection('users').doc(member.userId)
      memberRef.update({
        channels: adminFirestoreFieldValue.arrayUnion(docRef.id)
      })
      
    })
  
    return input
  } catch (err) {
    throw err
  }
}

// Get Channels
const getChannels = async (channelList: string[]) => {
  const channelRef = db.collection('channels')
  try {
    const querySnapshot = await channelRef.where('id', 'in', channelList).get()
    if (querySnapshot.empty) {
      throw new Error('snapshot empty')
    }
    
    return querySnapshot.docs.map(doc => doc.data())
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Get CHannel
const getChannel = async (channelId: string) => {
  return (await db.collection('channels').doc(channelId).get()).data()
}

// Add User to member list
const addUserToMember = async (input: AddUserToMemberInput) => {
  const { channelId, user } = input
  const newCollection = await db.collection('channels').doc(channelId).update({
    members: adminFirestoreFieldValue.arrayUnion(user)
  })
  return newCollection
}

// Remove User from member list
const removeUserFromMember = async (input: { targetId: string, channelId: string }) => {
  const { channelId, targetId } = input
  const channelRef = db.collection('channels').doc(channelId)
  const memberList = (await channelRef.get()).data().members

  const newMemberList = memberList.filter(member => member.userId !== targetId)
  const dbRes = await channelRef.update({
    members: newMemberList
  })

  return dbRes
}

// Delete channel
const deleteChannel = (channelId: string) => {
  try {
    db.collection('channels').doc(channelId).delete()
  } catch (err) {
    console.log(err)
    throw err
  }
}

function isInsertable(arr, event): number | false {
  // Arr is an empty array
  if (arr.length === 0) {
    return 0
  }
  for (let i = 0; i < arr.length; i++) {
    if (i == 0 && (event.endTime <= arr[i].startTime)) {
      return i
    }
    else if (event.endTime <= arr[i].startTime && event.startTime >= arr[i-1].endTime) {
      return i
    }
  }
  if (event.startTime > arr[arr.length-1].endTime) {
    return arr.length
  }
  return false
}

// Create Event
const createEvent = async (input: EventInput) => {
  const channelRef = db.collection('channels').doc(input.channelId)
  const eventRef = channelRef.collection('events')
  try {
    // get existing events
    const eventsArr = (await channelRef.get()).data().events
    console.log('eventsArr', eventsArr)
    const insertIndex = isInsertable(eventsArr, input)
    if (insertIndex === false) {
      throw new Error('cannot insert')
    }
    // create event subcollection
    const eventId = (await eventRef.add(input)).id
    input['id'] = eventId
    // add new event to the existing channel
    eventsArr.splice(insertIndex, 0, input)
    channelRef.update({
      events: eventsArr
    })
    return eventId
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Get Event
const getEvent = async (input: { channelId: string, eventId: string }) => {
  try { 
    const { channelId, eventId } = input
    const eventRef = db.collection('channels').doc(channelId).collection('events').doc(eventId)
    const event = await eventRef.get()
    console.log('event', event)
    console.log('event.data()', event.data())
    return event.data()
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Delete Event
const deleteEvent = async (input: FindEventInput) => {
  try {
    const { channelId, eventId } = input
    // delete event from subcollection
    const channelRef = db.collection('channels').doc(channelId)
    channelRef.collection('events').doc(eventId).delete()

    // delete event from channel
    const channel = await channelRef.get()
    const eventArr = channel.data().events
    const newEventArr = eventArr.filter(event => {
      return event.id !== eventId
    })
    const newChannel = await channelRef.update({
      events: newEventArr
    })

    return newChannel
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Update Event
const updateEvent = async (input: UpdateEventInput) => {
  try {
    const { channelId, eventId } = input
    const channelRef = db.collection('channels').doc(channelId)

    // pick current eventArr
    const channel = await channelRef.get()
    const eventArr = channel.data().events
    // remove that event from the arr
    const prepareToInsert = eventArr.filter(event => event.id !== input.eventId)

    // try inserting new event to the arr
    const insertIndex = isInsertable(prepareToInsert, input.event)
    // if not insertable throw an error
    if (insertIndex === false) {
      throw new Error('cannot insert')
    }
    // if isInsertable update new Arr, update event subcollection
    channelRef.collection('events').doc(eventId).update({ ...input.event, channelId })
    prepareToInsert.splice(insertIndex, 0, { id: eventId, ...input.event, channelId })
    const newChannel = await channelRef.update({
      events: prepareToInsert
    })
    
    return newChannel
  } catch (err) {
    console.log(err)
    throw err
  }
}

// Delete Event
const deleteEventSubCollection = async (channelId: string) => {
  try {
    const allEvents = await db.collection('channels').doc(channelId).collection('events').listDocuments()
    allEvents.forEach(doc => doc.delete())
  } catch (err) {
    console.log(err)
    throw err
  }
}

export {
  createChannel,
  getChannels,
  createEvent,
  getEvent,
  deleteEvent,
  updateEvent,
  addUserToMember,
  removeUserFromMember,
  deleteEventSubCollection,
  deleteChannel,
  getChannel
}
