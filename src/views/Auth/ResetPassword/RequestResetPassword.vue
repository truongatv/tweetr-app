<template>
  <ValidationObserver ref="obs">
    <v-card class="elevation-12" slot-scope="{ invalid, validated }">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>{{ $t('labels.reset_password')}}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <ValidationProvider name="email" rules="required|email">
          <v-text-field
            slot-scope="{ errors, valid }"
            :label="$t('labels.email')"
            name="Email"
            clearable
            prepend-inner-icon="mdi-account"
            :error-messages="errors"
            type="text"
            :success="valid"
            required
            v-model="email"
          />
        </ValidationProvider>
      </v-card-text>
      <v-spacer />
      <v-dialog v-model="response.status" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">{{response.title}}</v-card-title>
          <v-card-text>{{response.message}}</v-card-text>
          <v-card-actions>
            <v-btn :color="response.color" text @click.native="$router.push('/login')">{{$t('buttons.done')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-spacer />
      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="resetPassword()"
          form="login"
          color="primary"
          :disabled="invalid || !validated"
        >{{$t('buttons.change_password')}}</v-btn>
      </v-card-actions>
      <v-dialog v-model="dialog" hide-overlay persistent width="300">
        <v-card color="green" dark>
          <v-card-text>
            {{$t('messages.loading')}}
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </ValidationObserver>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { messages, resultApi } from "@/static/define/const";
export default {
  name: "LogInForm",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      response: {},
      email: "",
      dialog: false
    };
  },
  methods: {
    resetPassword() {
      this.dialog = true
      axios
        .put("/request_reset_password", {
          email: this.email
        })
        .then(response => {
          // save token in localstorage
          if (response.status == resultApi.successStatus) {
            this.response = {
              status: true,
              color: "success",
              title: this.$t('titles.success'),
              message: this.$t("messages.success.request_reset_password_done")
            };
          } else throw new Error
        })
        .catch(error => {
          if (error.response.data.message == resultApi.userNotExist) {
            this.response = {
              status: true,
              color: "red",
              title: this.$t('titles.error'),
              message: this.$t("messages.error.error")
            };
          } else {  
            this.response = {
              status: true,
              color: "red",
              title: this.$t('titles.error'),
              message: this.$t("messages.error.error")
            };
          }
        })
        .then(() => {
          this.dialog = false
        })
    }
  }
};
</script>
