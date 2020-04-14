import Repository from './Repository';

let endpoint = '/channels'

export default {
  getAll(){
    return Repository.get(`${endpoint}`)
  },
  get(channelId){
    return Repository.get(`${endpoint}/${channelId}`)
  },
  create(name){
    let body = {
      name: name,
      members: []
    }
    return Repository.post(endpoint, body)
  }
}