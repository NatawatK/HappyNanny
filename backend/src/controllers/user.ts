import express from 'express'
import { createUser, getAllUsers, getUser } from '../models/user'
import { check, validationResult } from 'express-validator'

const userRouter = express.Router()

// Validation Middlewares
const createUserValidationMiddleware = [
  check('userId').exists(),
  check('firstName').exists(),
  check('lastName').exists(),
  check('gender').exists()
]

const getUserValidationMiddleware = [
  check('userId').exists()
]

// Get All Users
userRouter.get('/', async (req, res) => {
  const users = await getAllUsers()
  return res.send(users)
})

// Get Specific user
userRouter.get('/:userId', getUserValidationMiddleware, async (req, res) => {
  const { userId } = req.params
  const user = await getUser(userId)
  if (!user) {
    return res.status(400).send('This user does not exist')
  }

  return res.send(user)
})

// Create User
userRouter.post('/', createUserValidationMiddleware, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  try {
    const dbRes = await createUser(req.body)
    return res.send(dbRes)
  } catch (err) {
    console.log(err)
    return res.send(err)
  }
})

export { userRouter }
