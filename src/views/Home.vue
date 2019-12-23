<template>
  <v-container class="grey lighten-5">
    <v-row>
      <v-col cols="4">
        <MainMenu />
      </v-col>
      <v-col cols="8">
        <v-card class="pa-2" outlined tile><Content /></v-card>
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
  }
};
</script>
