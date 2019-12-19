<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Sign up</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="signup()" id="signup">
                  <v-text-field
                    label="Full name"
                    name="Full name"
                    prepend-inner-icon="mdi-account-card-details"
                    type="text"
                    v-validate="'required'"
                    v-model="name"
                  />
                  <span v-show="errors.has('name')" class="is-danger">{{ errors.first('name') }}</span>
                  
                  <v-text-field
                    label="Username"
                    name="Username"
                    prepend-inner-icon="mdi-account"
                    type="text"
                    v-model="username"
                    v-validate="'required'"
                  />
                  <span
                    v-show="errors.has('username')"
                    class="is-danger"
                  >{{ errors.first('username') }}</span>

                  <v-text-field
                    label="Email"
                    name="Email"
                    prepend-inner-icon="mdi-email"
                    type="text"
                    v-model="email"
                    v-validate="'required|email'"
                  />
                  
                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-inner-icon="mdi-lock"
                    type="password"
                    v-model="password"
                    v-validate="'required'"
                  />
                </v-form>
              </v-card-text>
              <Notification
                    :message="notification.message"
                    :type="notification.type"
                    v-if="notification.message"
                />
              <v-card-actions>
                <v-spacer />
                <v-btn type="submit" form="signup"  color="primary" :disabled="!isFormValid">SIGN UP</v-btn>
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
  name: "SignUpForm",
  components: {
    Notification
  },
  props: {
    source: String
  },
  data() {
    return {
      name: "",
      username: "",
      email: "",
      password: "",
      notification: {
        message: "",
        type: ""
      },
      color: 'red'
    };
  },
  computed: {
    isFormValid() {
      return Object.keys(this.fields).every(key => this.fields[key].valid);
    }
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("tweetr-token");

    return token ? next("/") : next();
  },
  methods: {
    submit () {
    this.$v.$touch()
    },
    signup() {
        axios
        .post("http://127.0.0.1:3333/signup", {
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then(response => {
          // save token in localstorage
          localStorage.setItem("tweetr-token", response.data.data.token);

          // redirect to user home
          this.$router.push("/");
        })
        .catch(error => {
          // display error notification
          this.notification = Object.assign({}, this.notification, {
            message: error.response.data.message,
            type: error.response.data.type
          });
        });
    }
  }
};
</script>