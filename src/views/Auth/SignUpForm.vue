<template>
  <v-app id="inspire">
    <v-content>
      <ValidationObserver ref="obs" v-slot="{ invalid, validated }">
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                  <v-toolbar-title>Sign up</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-form @submit.prevent="signup()" id="signup">
                    <ValidationProvider :name="$t('labels.full_name')" rules="required" v-slot="{valid, errors}">
                      <v-text-field
                        :label="$t('labels.full_name')"
                        :name="$t('labels.full_name')"
                        prepend-inner-icon="mdi-account-card-details"
                        type="text"
                        :success="valid"
                        :error-messages="errors"
                        v-model="name"
                      />
                    </ValidationProvider>
                    <ValidationProvider :name="$t('labels.email')" rules="required|email|notExistEmail" v-slot="{valid, errors}">
                      <v-text-field
                        :label="$t('labels.email')"
                        :name="$t('labels.email')"
                        prepend-inner-icon="mdi-email"
                        type="text"
                        v-model="email"
                        :success="valid"
                        :error-messages="errors"
                      />
                    </ValidationProvider>
                    <ValidationProvider :name="$t('labels.password')" rules="required|min:6" v-slot="{valid, errors}">
                      <v-text-field
                        id="password"
                        :label="$t('labels.password')"
                        :name="$t('labels.password')"
                        prepend-inner-icon="mdi-lock"
                        type="password"
                        v-model="password"
                        :success="valid"
                        :error-messages="errors"
                      />
                    </ValidationProvider>
                  </v-form>
                </v-card-text>
                <Notification
                      :message="notification.message"
                      :type="notification.type"
                      v-if="notification.message"
                  />
                <v-card-actions>
                  <v-spacer />
                  <v-btn type="submit" form="signup"  color="primary" :disabled="invalid || !validated">{{$t('buttons.sign_up')}}</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </ValidationObserver>
    </v-content>
  </v-app>
</template>

<script>
import Notification from "@/components/Notification";
import {
  ValidationProvider,
  ValidationObserver
} from 'vee-validate'
import { extend } from 'vee-validate';

//create rule check email is exist
extend('notExistEmail', value => {
  //check email 
  return axios
    .get("/check_exist_email", {
      params: {
        email: value
      }
    })
    .then(response => {
      if(!response.data.data) {
        return true
      } else {
        return false
      }
    })
});

export default {
  name: "SignUpForm",
  components: {
    Notification,
    ValidationObserver,
    ValidationProvider
  },
  props: {
    source: String
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      notification: {
        message: "",
        type: ""
      },
      color: 'red',
    };
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
        .post("/signup", {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(response => {
          // save token in localstorage
          localStorage.setItem("tweetr-token", response.data.data.token);

          // redirect to user home
          this.$router.push({ path: '/' });
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