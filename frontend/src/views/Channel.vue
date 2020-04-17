<template>
  <div>
    <h1>Channel: {{ name }}</h1>
    <h2>Owner: {{ ownerName }}</h2>
    <v-layout>
      <v-col class="align-center-center">
        <v-row v-for="event in events" :key="event.id">
          <event-card :details="event"/>
        </v-row>
      </v-col>
    </v-layout>
    <event-dialog/>
  </div>
</template>

<script>
  import ChannelRepository from '../repository/ChannelRepository';
  import EventCard from '../components/EventCard';
  import EventDialog from '../components/EventDialog';

  export default {
    name: "Channel",
    components: {
      EventCard,
      EventDialog
    },
    created() {
      console.log(this.$route.params)
      this.channelId = this.$route.params.id
    },
    data : () => ({
      channelId: null,
      name: null,
      owner: null,
      members: null,
      events: null,
      dialog: false,
    }),
    watch: {
      $route(){
        this.channelId = this.$route.params.id
      },
      channelId() {
        ChannelRepository.get(this.channelId).then(({data}) => {
          console.log(data)
          const { events, members, name, owner } = data
          this.name = name
          this.members = members
          this.owner = owner
          this.events = events
        })
      },
    },
    computed: {
      ownerName() {
        return `${this.owner.firstName} ${this.owner.lastName}`
      }
    }
  }
</script>

<style scoped>

</style>