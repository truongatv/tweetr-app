<template>
  <v-card class="mx-auto" height="350px" elevation="5">
    <v-list-item two-line>
      <v-list-item-avatar>
        <img src="https://randomuser.me/api/portraits/women/81.jpg" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>Jane Smith</v-list-item-title>
      </v-list-item-content>
      <v-btn icon color="gray" >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider />
    <v-list rounded>
      <v-subheader>MENU</v-subheader>
      <v-list-item-group v-model="item" color="primary">
        <v-list-item v-for="(item, i) in items" :key="i" @click="changeMenu(item.component_name)">
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
import { menu } from "../const";
export default {
  data: () => ({
    item: 1,
    items: [],
    current_menu: ""
  }),
  created() {
    this.items = menu;
  },
  methods: {
    changeMenu(component_name) {
      this.$store.commit("setCurrentComponent", component_name);
    }
  }
};
</script>