<template>
  <ValidationObserver ref="obs">
    <v-card class="elevation-12" slot-scope="{ invalid, validated }">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>{{ $t('labels.reset_password')}}</v-toolbar-title>
        <v-spacer />
      </v-toolbar>
      <v-card-text>
        <!-- new password  -->
        <ValidationProvider
          :name="$t('labels.new_password')"
          rules="required|min:6|max:35"
          v-slot="{ validated, errors }"
          vid="password"
        >
          <v-text-field
            type="password"
            v-model="password.new_password"
            prepend-inner-icon="mdi-key"
            :label="$t('labels.new_password')"
            :success="validated"
            :error-messages="errors"
          ></v-text-field>
        </ValidationProvider>
        <!-- confirm password  -->
        <ValidationProvider
          :name="$t('labels.confirm_password')"
          rules="required|min:6|max:35|confirmed:password"
          v-slot="{ validated, errors }"
        >
          <v-text-field
            type="password"
            v-model="password.confirm_password"
            prepend-inner-icon="mdi-key-change"
            :label="$t('labels.confirm_password')"
            :success="validated"
            :error-messages="errors"
          ></v-text-field>
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
    </v-card>
  </ValidationObserver>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { messages, resultApi } from "@/static/define/const";
export default {
  components: {
    ValidationProvider,
    ValidationObserver
  },
  beforeRouteEnter(to, from, next) {
    //check token is exist
    const email = to.params.email;
    const token = to.params.token;
    axios
      .put("/check_exist_token", {
        token: token,
        email: email
      })
      .then(response => {
        if (response.status == resultApi.successStatus) {
          next();
        }
      })
      .catch(error => {  
          next("/login");
      })
  },
  data() {
    return {
      response: {},
      password: {
        new_password: "",
        confirm_password: ""
      }
    };
  },
  methods: {
    resetPassword() {
      const email = this.$route.params.email;
      const token = this.$route.params.token;

      axios
        .put("/reset_password", {
          token: token,
          email: email,
          password: this.password.new_password
        })
        .then(response => {
          // save token in localstorage
          if (response.status == resultApi.successStatus) {
            this.response = {
              status: true,
              color: "success",
              title: this.$t('titles.success'),
              message: this.$t("messages.success.reset_password_done")
            };
          } else throw new Error();
        })
        .catch(error => {
          this.response = {
            status: true,
            color: "red",
            title: this.$t('titles.error'),
            message: this.$t("messages.error.error")
          };
        });
    }
  }
};
</script>
