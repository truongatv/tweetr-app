<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="login" id="login">
                  <v-text-field
                    label="email"
                    name="Email"
                    prepend-inner-icon="mdi-account"
                    type="text"
                    required
                    v-model="email"
                  />

                  <v-text-field
                    id="password"
                    label="Password"
                    name="Password"
                    prepend-inner-icon="mdi-lock"
                    type="password"
                    v-model="password"
                  />
                </v-form>
              </v-card-text>
              <Notification
                :message="notification.message"
                :type="notification.type"
                v-if="notification.message"
              />
              <v-spacer />
              <v-card-actions>
                <v-spacer />
                <v-btn type="submit" form="login" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Notification from "@/components/Notification";

export default {
  name: "LogInForm",
  components: {
    Notification
  },
  data() {
    return {
      email: "",
      password: "",
      notification: {
        message: "",
        type: ""
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("tweetr-token");

    return token ? next("/") : next();
  },
  methods: {
    login() {
      axios
        .post("/login", {
          email: this.email,
          password: this.password
        })
        .then(response => {
          // save token in localstorage
          localStorage.setItem("tweetr-token", response.data.data.token);

          // redirect to user home
          this.$router.push('/')
        })
        .catch(error => {
          // clear form inputs
          this.email = this.password = "";

          // display error notification
          this.notification = Object.assign({}, this.notification, {
            message: error.response.data.message,
            type: error.response.data.status
          });
        });
    }
  }
};
</script>
