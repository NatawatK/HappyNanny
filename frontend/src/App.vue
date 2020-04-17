<template>
  <div>
    <template v-if="this.$router.currentRoute.name === 'Login'">
      <v-app>
        <v-content>
          <router-view />
        </v-content>
      </v-app>
    </template>
    <template v-else>
      <v-app id="inspire">
        <v-navigation-drawer
          v-model="drawer"
          :clipped="$vuetify.breakpoint.lgAndUp"
          app
        >
          <v-list dense>
            <template v-for="item in channelRender">
              <v-row v-if="item.heading" :key="item.heading" align="center">
                <v-col cols="6">
                  <v-subheader v-if="item.heading">
                    {{ item.heading }}
                  </v-subheader>
                </v-col>
                <v-col cols="6" class="text-center">
                  <a href="#!" class="body-2 black--text">EDIT</a>
                </v-col>
              </v-row>
              <v-list-group
                v-else-if="item.children"
                :key="item.text"
                v-model="item.model"
                :prepend-icon="item.model ? item.icon : item['icon-alt']"
                append-icon=""
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item v-for="(child, i) in item.children" :key="i" link>
                  <v-list-item-action v-if="child.icon">
                    <v-icon>{{ child.icon }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ child.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
              <v-list-item v-else :key="item.text" link :to="item.to">
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
          <template v-slot:append>
            <v-btn
              @click="onCreateNewChannel"
            >
              Create new channel
            </v-btn>
          </template>
        </v-navigation-drawer>

        <v-app-bar
          :clipped-left="$vuetify.breakpoint.lgAndUp"
          app
          color="blue darken-3"
          dark
        >
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
          <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
            <span class="hidden-sm-and-down">Happy Nanny</span>
          </v-toolbar-title>
          <v-text-field
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
            class="hidden-sm-and-down"
          />
          <v-spacer />
          <v-btn icon>
            <v-icon>mdi-apps</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-bell</v-icon>
          </v-btn>
          <v-btn icon large>
            <v-avatar size="32px" item>
              <v-img
                src="https://cdn.vuetifyjs.com/images/logos/logo.svg"
                alt="Vuetify"
            /></v-avatar>
          </v-btn>
        </v-app-bar>
        <v-content>
          <router-view></router-view>
        </v-content>
      </v-app>
    </template>
  </div>
</template>

<script>

import UserRepository from './repository/UserRepository';
import ChannelRepository from './repository/ChannelRepository';

export default {
  name: "App",
  props: {
    source: String
  },
  created() {
    this.fetchChannel()
  },
  data: () => ({
    drawer: null,
    channels: [],
    channelRender: [],
  }),
  watch: {
    channels() {
      var channelList = []
      this.channels.forEach(ch => {
        ChannelRepository.get(ch).then( res => {
          channelList.push({
            text: res.data.name,
            to: `channel/${res.data.id}`
          })
        })
      })
      this.channelRender = channelList
    }
  },
  methods: {
    onCreateNewChannel(){
      var channelName = prompt("Please enter channel name:", "Channel01");
      if (channelName == null || channelName == "") {
        console.log("User cancelled the prompt.")
      } else {
        ChannelRepository.create(channelName).then(res => {
          console.log(res.data)
          this.fetchChannel()
        })
        console.log(channelName)
      }
    },
    fetchChannel(){
      const uid = localStorage.getItem('uid')
      if(uid !== undefined){
        UserRepository.get(uid).then(res => {
          this.channels = res.data.channels
        })
      }
    },
  }
};
</script>
