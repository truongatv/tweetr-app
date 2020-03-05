<template>
  <v-app id="inspire">
    <v-content>
      <ValidationObserver ref="obs">
        <v-container class="fill-height" fluid slot-scope="{ invalid, validated }">
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
              <v-card class="elevation-12">
                <v-toolbar color="primary" dark flat>
                  <v-toolbar-title>{{ $t('labels.login_form')}}</v-toolbar-title>
                  <v-spacer />
                </v-toolbar>
                <v-card-text>
                  <v-form @submit.prevent="login" id="login">
                    <ValidationProvider name="email" rules="required|email">
                      <v-text-field
                        slot-scope="{
                          errors,
                          valid
                        }"
                        :label="$t('labels.email')"
                        name="Email"
                        prepend-inner-icon="mdi-account"
                        :error-messages="errors"
                        type="text"
                        :success="valid"
                        required
                        v-model="email"
                      />
                    </ValidationProvider>
                    <ValidationProvider name="password" rules="required|min:6">
                      <v-text-field
                        slot-scope="{
                          errors,
                          valid
                        }"
                        id="password"
                        :label="$t('labels.password')"
                        name="Password"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-lock"
                        type="password"
                        :success="valid"
                        v-model="password"
                      />
                    </ValidationProvider>
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
                  <v-btn
                    type="submit"
                    form="login"
                    color="primary"
                    :disabled="invalid || !validated"
                  >{{$t('buttons.login')}}</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </ValidationObserver>
      <!-- show dialog for warning  -->
      <v-dialog v-model="dialog_flag" max-width="400">
        <v-card>
          <v-card-title class="headline">{{$t('messages.titles.confirm_account')}}</v-card-title>

          <v-card-text>{{$t('messages.alert.account_not_confirm')}}</v-card-text>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import Notification from "@/components/Notification";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { messages, resultApi } from "@/static/define/const";
export default {
  name: "LogInForm",
  components: {
    Notification,
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      email: "",
      password: "",
      notification: {
        message: "",
        type: ""
      },
      dialog_flag: false
    };
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("tweetr-token");

    return token ? next("/") : next();
  },
  computed: {
    isFormValid() {
      return Object.keys(this.fields).every(key => this.fields[key].valid);
    }
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
          this.$router.push("/")
        })
        .catch(error => {
          if (error.response.data.status == resultApi.needConfirmAccount) {
            this.dialog_flag = true;
          } else {
            // clear form inputs
            this.email = this.password = "";
            // display error notification
            this.notification = Object.assign({}, this.notification, {
              message: error.response.data.message,
              type: error.response.data.status
            });
          }
        });
    },
    getLanguage() {
      const token = localStorage.getItem("tweetr-token")
      axios
        .get("/account/get_language", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          if (response.data.data) {
            this.$cookie.set("language", response.data.data)
          } else {
            this.$cookie.set("language", "us")
          }
        });
    }
  }
};
</script>
