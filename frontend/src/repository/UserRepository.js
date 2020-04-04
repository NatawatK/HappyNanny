import Repository from './Repository';

let endpoint = '/users'

export default {
  getAll(){
    return Repository.get(`${endpoint}`)
  },
  get(userId){
    return Repository.get(`${endpoint}/${userId}`)
  },
  create(userId, firstName, lastName, gender){
    let body = {
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      gender: gender
    }
    return Repository.post(endpoint, body)
  }
}