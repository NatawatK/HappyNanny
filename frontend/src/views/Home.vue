<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <HelloWorld/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import UserRepository from '../repository/UserRepository';

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  created() {
    const uid = localStorage.getItem('uid')
    UserRepository.get(uid).then(res => {
      console.log(res.data)
      this.channels = res.data.channels.map( e => ({ icon: "mdi-contacts", text : e }))
    })
  }
};
</script>
