<template>
  <v-card class="mx-auto" elevation="5">
    <v-list-item two-line>
      <v-list-item-avatar>
        <img v-if="user.image" :src=user.image />
        <img v-else src="@/static/avatar/default_avatar.png" alt="avatar">
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{user.name}}</v-list-item-title>
      </v-list-item-content>
      <v-btn icon color="gray" @click="editProfile()">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider />
    <v-list rounded>
      <v-subheader>{{$t('labels.menu')}}</v-subheader>
      <v-list-item-group color="primary">
        <v-list-item v-for="(item, i) in $t('menu')" :key="i" @click="changeMenu(item.component_name)">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    current_menu: "",
    user:{}
  }),
  created() {
    const token = localStorage.getItem("tweetr-token");
    axios
      .get("/account/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        this.user = response.data.data[0];
      })
      .catch(error => {});
  },
  methods: {
    changeMenu(component_name) {
      this.$store.commit("setCurrentComponent", component_name)
    },
    editProfile() {
      this.$store.commit("setCurrentComponent", 'Profile')
    }
  }
};
</script>