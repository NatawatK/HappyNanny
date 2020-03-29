import express from 'express'
import { createChannel } from '../models/channel'
import { check, validationResult } from 'express-validator'

const channelRouter = express.Router()

// Validation Middlewares
const createChannelValidationMiddleware = [
  check('name').exists(),
  check('owner').exists(),
  check('owner.id').exists(),
  check('owner.name').exists()
]

// Create Channel
channelRouter.post('/', createChannelValidationMiddleware, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  try {
    const dbRes = await createChannel(req.body)
   
    return res.send(dbRes)
  } catch (err) {
    console.log('error from create channel controller', err)
    return res.send(err.message)
  }
})

export { channelRouter }
