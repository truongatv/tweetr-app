<template>
  <v-container class="grey lighten-5">
    <v-row>
      <v-col cols="4">
        <MainMenu />
      </v-col>
      <v-col cols="8">
        <Content />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MainMenu from "@/components/MainMenu"
import Content from "@/components/Content"
export default {
  name: "home",
  components: {
    MainMenu,
    Content
  },
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("tweetr-token");
    if (token) next();
    else {
      next("/login");
    }
  },
  async beforeCreate() {
    const token = localStorage.getItem('tweetr-token')
    let response = await axios
      .get("/account/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        this.$store.commit("setCurrentUserInfo", response.data.data[0])
      })
  },
};
</script>
