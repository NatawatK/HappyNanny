<template>
  <div>
    <v-btn
      bottom
      fab
      fixed
      right
      color="success"
      @click="dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="">
          Create Event<v-icon>arrow_downward</v-icon>
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col class="align-center justify-space-between" cols="12">
              <v-row align="center" class="mr-0">
                <v-avatar size="40px" class="mx-3">
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  />
                </v-avatar>
                <v-text-field placeholder="Name" v-model="item.title" />
              </v-row>
            </v-col>
            <v-col cols="12">
              <v-text-field prepend-icon="mdi-text" placeholder="Details" v-model="item.detail"/>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-menu
                v-model="menuStartDate"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="startDate"
                    label="Start Date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="startDate" @input="menuStartDate = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="11" sm="5">
              <v-menu
                ref="menu1"
                v-model="menuStartTime"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="startTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="startTime"
                    label="Start Time"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menuStartTime"
                  v-model="startTime"
                  full-width
                  @click:minute="$refs.menu1.save(startTime)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-menu
                v-model="menuEndDate"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="endDate"
                    label="End Date"
                    prepend-icon="event"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="endDate" @input="menuEndDate = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="11" sm="5">
              <v-menu
                ref="menu2"
                v-model="menuEndTime"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="endTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="endTime"
                    label="End Time"
                    prepend-icon="access_time"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menuEndTime"
                  v-model="endTime"
                  full-width
                  @click:minute="$refs.menu2.save(endTime)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn v-if="editMode" color="danger" @click="deleteEvent">Delete</v-btn>
          <v-spacer />
          <v-btn text color="primary" @click="close">Cancel</v-btn>
          <v-btn color="success" @click="save">{{ editMode? "Save" : "Create"}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>s
  </div>
</template>

<script>
  import ChannelRepository from '../repository/ChannelRepository';
  import moment from 'moment'

  export default {
    name: "EventDialog.vue",
    props: {
      editMode: {
        type: Boolean,
        default: () => false
      }
    },
    data : () => ({
      dialog: false,
      menuStartDate: false,
      startDate: null,
      menuEndDate: false,
      endDate: null,
      menuStartTime: false,
      startTime: "",
      menuEndTime: false,
      endTime: "",
      item: {
        title: "",
        detail: "",
        startTime: "",
        endTime: "",
      },
    }),
    methods:{
      save(){
        const channelId = this.$router.currentRoute.params.id
        this.item.startTime = this.dateTimetoISO(this.startDate, this.startTime)
        this.item.endTime = this.dateTimetoISO(this.endDate, this.endTime)
        console.log(channelId, this.item)
        if (this.editMode)
          this.$emit('edit-event', this.item)
        else{
          this.$emit('create-event', this.item)
          ChannelRepository.createEvent(channelId, event)
        }
        this.close()
      },
      close(){
        this.resetState()
        this.dialog = false
        this.$emit('close')
      },
      resetState(){
        this.menuStartDate = false
        this.startDate = null
        this.menuEndDate = false
        this.endDate = null
        this.menuStartTime = false
        this.startTime = ""
        this.menuEndTime = false
        this.endTime = ""
        this.item = {}
      },
      deleteEvent(){
        this.$emit('delete-event')
      },
      dateTimetoISO(date, time){
        const datetime = moment(`${date} ${time}`)
        console.log(date, datetime, datetime.format())
        return datetime.format()
      }
    }
  }
</script>

<style scoped>

</style>