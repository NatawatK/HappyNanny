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
  },
  createEvent(channelId, event){
    const { title, detail, startTime, endTime } = event
    const payload = {
      channelId: channelId,
      title: title,
      detail: detail,
      startTime: startTime,
      endTime: endTime,
      alertTime: ""
    }
    return Repository.post(`${endpoint}/createEvent`, payload)
  }
}