import Repository from './Repository';

let endpoint = '/api/channels'

export default {
  getAll(){
    return Repository.get(`${endpoint}`)
  },
  get(channelId){
    return Repository.get(`${endpoint}/${channelId}`)
  },
  create(name, owner){
    let body = {
      name: name,
      owner: owner,
    }
    return Repository.post(endpoint, body)
  }
}