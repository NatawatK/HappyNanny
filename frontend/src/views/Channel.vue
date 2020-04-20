<template>
  <div style="margin: 20px">
    <h1>Channel: {{ name }}</h1>
    <h2>Owner: {{ ownerName }}</h2>
    <channel-dialog :members="members" :channel-id="channelId" @members-change="updateMember"/>
    <v-layout>
      <v-col class="align-center-center">
        <v-row v-for="(event, index) in events" :key="event.id">
          <event-card :details="event" @click="onEditEvent(event, index)"/>
        </v-row>
        <h2 v-if="!events || events.length === 0">No event here. Create first.</h2>
      </v-col>
    </v-layout>
    <event-dialog
      :edit-index="editIndex"
      :edit-item="editItem"
      :active="dialog"
      @close="onDialogClose"
      @delete-event="removeEvent"
      @create-event="fetchChannel"
      @edit-event="fetchChannel"
    />
  </div>
</template>

<script>
  import ChannelRepository from '../repository/ChannelRepository';
  import EventCard from '../components/EventCard';
  import EventDialog from '../components/EventDialog';
  import ChannelDialog from '../components/ChannelDialog';

  export default {
    name: "Channel",
    components: {
      EventCard,
      EventDialog,
      ChannelDialog
    },
    created() {
      this.channelId = this.$route.params.id
    },
    data : () => ({
      channelId: null,
      name: null,
      owner: null,
      members: null,
      events: null,
      dialog: false,
      editItem: {},
      editIndex: -1,
    }),
    watch: {
      $route(){
        this.channelId = this.$route.params.id
      },
      channelId() {
        this.fetchChannel()
      },
    },
    computed: {
      ownerName() {
        if(!this.owner) return ""
        return `${this.owner.firstName} ${this.owner.lastName}`
      }
    },
    methods: {
      onEditEvent(event, index){
        this.editIndex = index
        const eventItem = {
          ...event,
        }
        this.editItem = eventItem
        this.dialog = true
      },
      onDialogClose(){
        this.dialog = false
        this.editIndex = -1
        this.editItem = {}
      },
      removeEvent(id){
        this.events = this.events.filter(e => e.id !== id)
      },
      fetchChannel(){
        ChannelRepository.get(this.channelId).then(({data}) => {
          console.log(data)
          const { events, members, name, owner } = data
          this.name = name
          this.members = members
          this.owner = owner
          this.events = events
        })
      },
      updateMember(members){
        this.members = members
      },
    }
  }
</script>

<style scoped>

</style>