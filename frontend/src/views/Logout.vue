<template>
  <div></div>
</template>
<script>
import firebase from "firebase";
export default {
  name: "Logout.vue",
  created() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        this.$router.push({ name: "Login" });
      })
      .catch(function(error) {
        // An error happened.
        alert(error.message);
      });
  }
};
</script>

<style scoped></style>
