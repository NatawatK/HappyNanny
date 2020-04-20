<template>
  <div>
    <v-row justify="end">
      <v-dialog v-model="dialog" persistent max-width="500">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on" @click="$emit('click')">Settings</v-btn>
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
            <v-btn color="error darken-1" text @click="deleteChannel">Delete</v-btn>
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
          if(this.users.length == 0)  this.fetchUser()
        }
      }
    },
    methods: {
      fetchUser(){
        UserRepository.getAll().then(res => {
          this.users = res.data
        })
      },
      deleteChannel(){
        const result = confirm("Want to delete this channel?");
        if (result) {
          //Logic to delete the item
          const channelId = this.$router.currentRoute.params.id
          ChannelRepository.deleteChannel(channelId).then(() => {
            this.close()
            this.$router.push('/')
            location.reload()
          }).catch(err => {
            this.$notify({
              group: "main",
              type: "error",
              title: "Can't delete channel",
              text: err
            })
          })
          this.close()
        }
      },
      close() {
        this.newMembers = []
        this.dialog = false
      },
      save(){
        console.log(this.members.map(e => e.userId), this.newMembers)
        const toAdd = _.difference(this.newMembers, this.members.map(e => e.userId))
        const toRemove = _.difference(this.members.map(e => e.userId), this.newMembers)
        console.log('add', toAdd)
        var failed = false
        var updatedMembers = []
        toAdd.forEach(async uid => {
          try{
            const res = await ChannelRepository.addUser(this.channelId, uid)
            updatedMembers = res.data.members
            console.log(updatedMembers)

            this.$emit('members-change', updatedMembers)
          }
          catch(err) {
            this.$notify({
              group: "main",
              type: "error",
              title: "Can't add new user",
              text: err
            })
            failed = true
          }
        })
        console.log('remove', toRemove)
        toRemove.forEach(async uid => {
          try {
            const res = await ChannelRepository.removeUser(this.channelId, uid)
            updatedMembers = res.data.members
            console.log(updatedMembers)
            this.$emit('members-change', updatedMembers)
          }
          catch(err) {
            this.$notify({
              group: "main",
              type: "error",
              title: "Can't remove new user",
              text: err
            })
            failed = true
          }
        })
        if ( !failed ) {
          this.$notify({
            group: "main",
            type: "success",
            title: "Edit members successfully",
          })
        }
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>