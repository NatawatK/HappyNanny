<template>
  <v-app>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>{{ headerText }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form v-if="registerMode">
                <v-row>
                  <v-text-field v-model="firstName" label="First Name" />
                  <v-text-field v-model="lastName" label="Last Name" />
                </v-row>
                <v-text-field v-model="email" label="E-mail" />
                <v-row>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                  />
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    type="password"
                  />
                </v-row>
              </v-form>
              <v-form v-else>
                <v-text-field
                  v-model="email"
                  label="E-mail"
                  name="login"
                  type="text"
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                text
                @click="registerMode = !registerMode"
                >{{ toggleBtn }}</v-btn
              >
              <v-spacer />
              <v-btn color="primary" @click="proceed">{{
                confirmButton
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Login",
  data: function() {
    return {
      registerMode: false,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    proceed() {
      this.loginMode ? this.login() : this.register();
    },
    login() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push({ name: "Home" });
        })
        .catch(function(error) {
          // var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    },
    register() {
      if (this.password !== this.confirmPassword) return;
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push({ name: "Home" });
        })
        .catch(function(error) {
          // var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    }
  },
  computed: {
    loginMode() {
      return !this.registerMode;
    },
    headerText() {
      return this.loginMode ? "Welcome to Happy Nanny" : "Create new account";
    },
    toggleBtn() {
      return this.registerMode ? "Sign in instead" : "Create account";
    },
    confirmButton() {
      return this.loginMode ? "Sign in" : "Sign up";
    }
  },
};
</script>
