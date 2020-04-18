<template>
  <div>
    <v-row justify="end">
      <v-dialog v-model="dialog" persistent max-width="500">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">Settings</v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Channel Setting</v-card-title>
          <v-card-text>
            Channel members:
            <v-autocomplete
               v-model="newMembers"
               :items="users"
               item-text="email"
               item-value="userId"
               multiple
               chips
            ></v-autocomplete>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="green darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
  import UserRepository from '../repository/UserRepository';
  import _ from 'lodash'
  import ChannelRepository from '../repository/ChannelRepository';

  export default {
    name: "ChannelDialog",
    props: {
      members : {
        type: Array,
        default: () => []
      },
      channelId: {
        type: String,
        required: true,
      }
    },
    created() {
      this.fetchUser()
    },
    data () {
      return {
        dialog: false,
        users: [],
        newMembers: [],
      }
    },
    watch: {
      dialog(val){
        if(val){
          this.newMembers = this.members
          this.fetchUser()
        }
      }
    },
    methods: {
      fetchUser(){
        UserRepository.getAll().then(res => {
          this.users = res.data
        })
      },
      close() {
        this.users = []
        this.newMembers = []
        this.dialog = false
      },
      save(){
        console.log(this.members.map(e => e.userId), this.newMembers)
        const toAdd = _.difference(this.newMembers, this.members.map(e => e.userId))
        const toRemove = _.difference(this.members.map(e => e.userId), this.newMembers)
        console.log('add', toAdd)
        toAdd.forEach( uid => {
          ChannelRepository.addUser(this.channelId, uid).then(res => {
            console.log(res)
          })
        })
        console.log('remove', toRemove)
        toRemove.forEach( uid => {
          ChannelRepository.removeUser(this.channelId, uid).then(res => {
            console.log(res)
          })
        })
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>