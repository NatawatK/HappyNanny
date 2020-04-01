import axios from 'axios'
import { BACKEND_PATH } from '../apiConfigure'

console.log(BACKEND_PATH)
const baseUrl = '/api'

export default axios.create({
  baseUrl,
})
