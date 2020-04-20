<template>
  <div>
    <v-hover
      v-slot:default="{ hover }"
    >
      <v-card width="500px" :elevation="hover? 8:2" @click="$emit('click')">
        <v-card-title>{{ details.title }}</v-card-title>
        <v-card-text>
          <span>Start : {{ convertToDate(details.startTime) }} </span><br>
          <span>End : {{ convertToDate(details.endTime) }} </span><br>
          <span>{{details.detail}}</span>
        </v-card-text>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: "EventCard",
    props: {
      details: {
        type: Object,
        required: true,
        default: () => ({
          alertTime: '2012-04-23T18:25:43.511Z',
          channelId:"IKrHcLVcYN17LXOJV8p1",
          detail:"example detail",
          endTime:"2011-03-23T18:25:43.511Z",
          id:"fJs9hc1ktAe0kb3gnYyY",
          startTime:"2010-04-23T18:25:43.511Z",
          title:"example title",
        })
      }
    },
    data: () => ({}),
    methods: {
      convertToDate(datetime){
        // const date = new Date(datetime)
        // const m = date.getMonth(); // returns 6
        // const d = date.getDay();  // returns 15
        // const y = date.getFullYear();  // returns 2012
        // const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        // const mlong = months[m];
        // return mlong + " " + d + ", " + y;
        return moment(datetime).format("llll")
      },

    }
  }
</script>

<style scoped>
.v-card{
  width: 500px;
  margin: 10px;
  margin-left: 50%;
}
</style>