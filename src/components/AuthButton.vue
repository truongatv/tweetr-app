<template>
  <div>
    <router-link to="/login" tag="v-btn">
      <v-btn v-if="!loginStatus" text>
        <span class="mr-2">Login</span>
      </v-btn>
    </router-link>
    <v-btn v-if="loginStatus" @click="logout" text>
      <span class="mr-2">Logout</span>
      <v-icon>mdi-logout</v-icon>
    </v-btn>
    <router-link to="/signup" tag="v-btn">
      <v-btn v-if="!loginStatus" text>
        <span class="mr-2">Signup</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginStatus: false
    };
  },
  created() {
    const token = localStorage.getItem("tweetr-token");
    if (token) this.loginStatus = true;
  },
  methods: {
    logout() {
      if (this.loginStatus) {
        localStorage.removeItem("tweetr-token");
        this.$router.push("login");
      }
    }
  },
  watch: {
    $route(to, from) {
      const token = localStorage.getItem("tweetr-token");
      if (token) this.loginStatus = true;
      else this.loginStatus = false;
    }
  }
};
</script>