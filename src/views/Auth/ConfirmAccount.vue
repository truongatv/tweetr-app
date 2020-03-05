<template>
  <v-card class="mx-auto ma-2" :color="color" dark max-width="800">
    <v-card-text class="headline font-weight-bold">{{$t('messages.titles.confirm_account')}}</v-card-text>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-content>
          <v-list-item-title v-if="confirm_status && $route.params.token">{{$t('messages.success.confirm_account_done')}}</v-list-item-title>
          <v-list-item-title v-else-if="!confirm_status && $route.params.token">{{$t('messages.error.confirm_account_fail')}}</v-list-item-title>
          <v-list-item-title v-else>{{$t('messages.success.signup_done')}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      confirm_status: false,
      color: "#26c6da"
    };
  },
  created() {
    const token = this.$route.params.token;
    const email = this.$route.params.email;
    if (token && email) {
      axios
        .put("/confirm_account", {
          token: token,
          email: email
        })
        .then(response => {
          if (response.data.status == 200) {
            this.confirm_status = true;
          } else {
            this.color = "red";
          }
        });
    } else {
      this.confirm_status = true;
    }
  }
};
</script>