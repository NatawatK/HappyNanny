import { admin } from '../db'

async function checkAuth(req, res, next) {
  try {
    if (req.headers.authtoken) {
      const decoded = await admin.auth().verifyIdToken(req.headers.authtoken)
      if (!decoded) {
        res.status(403).send('Unauthorized')
      }
      req.user = decoded
      next()
    } else {
      res.status(403).send('Unauthorized')
    }
  } catch (err) {
    console.log(err)
    res.status(403).send('Auth error')
  }
}

export { checkAuth }
