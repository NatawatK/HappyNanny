<template>
  <div>
    <div class="header">
      <v-toolbar
        flat
      >
        <v-toolbar-title>Channel</v-toolbar-title>
        <v-toolbar-items>
          <v-btn text v-for="tab in menu" v-bind:key="tab.text">{{ tab.text }}</v-btn>
        </v-toolbar-items>

      </v-toolbar>
    </div>
    <div class="content" style="background: grey"></div>
  </div>

</template>

<script>
  export default {
    name: "Channel",
    data: function(){
      return {
          events: [],
          menu: [
            {
              text: 'Event',
            },
            {
              text: 'Setting',
            }
          ]
      }
    }
  }

</script>

<style scoped>

</style>