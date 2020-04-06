import { db } from '../db'
import omit from 'lodash/omit'

export async function getUserExcludeChannels(userId: string) {
  const user = await db.collection('users').doc(userId).get()
  return omit(user.data(), ['channels'])
}
