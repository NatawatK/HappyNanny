import express from 'express'
import { userRouter } from '../controllers/user'
import { channelRouter } from '../controllers/channel'

const router = express.Router()

router.use('/users', userRouter)
router.use('/channels', channelRouter)

export { router }
