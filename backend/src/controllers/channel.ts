import express from 'express'
import { createChannel, getChannel, getChannels, createEvent, getEvent, deleteEvent, updateEvent, addUserToMember, removeUserFromMember, deleteEventSubCollection, deleteChannel } from '../models/channel'
import { getUser, checkAuthority, addChannelToUser, removeChannelFromUser, removeChannelFromUsersList } from '../models/user'
import { check, validationResult } from 'express-validator'
import { checkAuth } from '../middlewares/auth'
import { getUserExcludeChannels } from '../models/helper'

const channelRouter = express.Router()

// Validation Middlewares
const createChannelValidationMiddleware = [
  check('name').exists(),
  check('members').exists()
]

// Create Channel
channelRouter.post('/', createChannelValidationMiddleware, checkAuth, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const { user } = req
  const userId = user.uid
  const createChannelInput = {
    ...req.body,
    userId
  }
  try {
    const dbRes = await createChannel(createChannelInput)
   
    return res.send(dbRes)
  } catch (err) {
    console.log('error from create channel controller', err)
    return res.send(err.message)
  }
})

// Get Channel
channelRouter.get('/:channelId', checkAuth, async (req, res) => {
  try {
    const { user } = req
    const userId = user.uid
    const { channelId } = req.params
    const hasAuthority = checkAuthority({
      userId,
      channelId
    })
    if (!hasAuthority) {
      return res.status(400).send('Authority required')
    }
  
    const channel = await getChannel(channelId)
   
    return res.send(channel)
  } catch (err) {
    return res.send(err)
  }
})

// Get Channels
channelRouter.get('/', checkAuth, async (req, res) => {
  const { user } = req
  const userId = user.uid
  try {
    const user = await getUser(userId)
  
    if (!user) {
      return res.status(400).send('User does not exist')
    }
  
    const channelList = user.channels
    const channels = await getChannels(channelList)
   
    return res.send(channels)
  } catch (err) {
    return res.send(err)
  }
})

// Add User to Channel
channelRouter.post('/addUser', checkAuth, async (req, res) => {
  try {
    const { user } = req
    const userId = user.uid
    const { id, channelId } = req.body
    const hasAuthority = checkAuthority({
      userId,
      channelId
    })
    if (!hasAuthority) {
      return res.status(400).send('Authority required')
    }
    // Add channel to user.channel list
    addChannelToUser({ targetId: id, channelId })

    // Add user to member list
    const userToInsert = await getUserExcludeChannels(id)
    const newCollection = await addUserToMember({ channelId, user: userToInsert })

    return res.send(newCollection)
  } catch (err) {
    return res.send(err.message)
  }
})

// Remove User from Channel
channelRouter.delete('/user', checkAuth, async (req, res) => {
  try {
    const { user } = req
    const userId = user.uid
    const { id, channelId } = req.body
    const hasAuthority = checkAuthority({
      userId,
      channelId
    })
    if (!hasAuthority) {
      return res.status(400).send('Authority required')
    }
    // remove channel from user
    removeChannelFromUser({ targetId: id, channelId })
    
    // remove user from members
    const dbRes = await removeUserFromMember({ targetId: id, channelId })
    return res.send(dbRes)
  } catch (err) {
    return res.send(err.message)
  }
})

// Delete Channel
channelRouter.delete('/', checkAuth, async (req, res) => {
  try {
    const { user } = req
    const userId = user.uid
    const { channelId } = req.body
    const hasAuthority = checkAuthority({
      userId,
      channelId
    })
    if (!hasAuthority) {
      return res.status(400).send('Authority required')
    }
    // get members from channel
    const channel = await getChannel(channelId)

    removeChannelFromUsersList(channelId, channel.members.map(member => member.userId))
    // delete event subcollection
    deleteEventSubCollection(channelId)

    // delete channel
    deleteChannel(channelId)

    return res.send('delete channel successful')
  } catch (err) {
    return res.send(err.message)
  }
})

// Create Event
channelRouter.post('/createEvent', checkAuth, async (req, res) => {
  const { user } = req
  const userId = user.uid
  const { channelId } = req.body
  // Check if user has the authority to createEvent for this channel
  try {
    const hasAuthority = checkAuthority({
      userId,
      channelId
    })
    if (!hasAuthority) {
      return res.status(400).send('Authority required')
    }
    const createdEvent = await createEvent(req.body)
    
    return res.send(createdEvent)
  } catch (err) {
    return res.send(err.message)
  }
})

// Get Event
channelRouter.get('/event/:channelId/:eventId', checkAuth, async (req, res) => {
  const { channelId, eventId } = req.params
  console.log({ channelId, eventId })
  if (!channelId || !eventId) {
    return res.status(400).send('wrong params')
  }
  const { user } = req
  const userId = user.uid
  try {
    const hasAuthority = checkAuthority({
      userId,
      channelId
    })
    if (!hasAuthority) {
      return res.status(400).send('Authority required')
    }

    const event = await getEvent({ channelId, eventId })
    console.log('event outer', event)
    return res.send(event)
  } catch (err) {
    return res.send(err.message)
  }
})

// Delete Event
channelRouter.delete('/event', checkAuth, async (req, res) => {
  const { channelId, eventId } = req.body
  console.log({ channelId, eventId })
  if (!channelId || !eventId) {
    return res.status(400).send('wrong params')
  }
  const { user } = req
  const userId = user.uid
  try {
    const hasAuthority = checkAuthority({
      userId,
      channelId
    })
    if (!hasAuthority) {
      return res.status(400).send('Authority required')
    }

    const newChannel = await deleteEvent({ channelId, eventId })
    
    return res.send(newChannel)
  } catch (err) {
    return res.send(err.message)
  }
})

// Update Event
channelRouter.put('/event', checkAuth, async (req, res) => {
  const { channelId, eventId } = req.body
  const event = req.body
  console.log({ channelId, eventId })
  if (!channelId || !eventId) {
    return res.status(400).send('wrong params')
  }
  const { user } = req
  const userId = user.uid
  try {
    const hasAuthority = checkAuthority({
      userId,
      channelId
    })
    if (!hasAuthority) {
      return res.status(400).send('Authority required')
    }

    const newChannel = await updateEvent({ channelId, eventId, event })
    
    return res.send(newChannel)
  } catch (err) {
    return res.send(err.message)
  }
})

export { channelRouter }
