import axios from 'axios'
import firebase from 'firebase'
const baseUrl = '/api'

const axiosInstance =  axios.create({
  baseURL: baseUrl,
})

axiosInstance.interceptors.request.use(async config => {
  const token = await firebase.auth().currentUser.getIdToken();

  if (token) {
    config.headers['AuthToken'] = token;
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

export default axiosInstance

