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
  addUser(channelId, uid){
    let body = {
      id: uid,
      channelId: channelId
    }
    return Repository.post(`${endpoint}/addUser`, body)
  },
  removeUser(channelId, uid){
    let body = {
      id: uid,
      channelId: channelId
    }
    return Repository.delete(`${endpoint}/user`, { data : body })
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
  },
  deleteEvent(channelId, eventId) {
    const payload = {
      channelId: channelId,
      eventId: eventId
    }
    console.log(payload)
    return Repository.delete(`${endpoint}/event`, {
      data: payload
    })
  },
  editEvent(channelId,  event) {
    const payload = {
      channelId: channelId,
      eventId: event.id,
      event: {
        ...event
      }
    }
    return Repository.put(`${endpoint}/event`, payload)
  }
}