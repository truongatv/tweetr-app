<template>
  <div>
    <v-card class="mx-auto">
      <v-list>
        <template v-for="(item, index) in items">
          <div class="d-flex pr-5" v-if="item.header" :key="item.header">
            <v-subheader v-text="item.header"></v-subheader>
            <v-btn
              v-if="flag.flag_edit_member"
              color="blue"
              icon
              class="ml-auto"
              @click="flag.dialog_add_member = true"
            >
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </div>
          <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>

          <v-list-item v-else :key="item.title">
            <v-list-item-avatar>
              <v-img :src="item.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="item.title"></v-list-item-title>
            </v-list-item-content>
            <v-btn text icon color="red" v-if="flag.flag_edit_member" @click="showDialog(index)">
              <v-icon>mdi-account-remove</v-icon>
            </v-btn>
          </v-list-item>
        </template>
      </v-list>
      <!-- dialog remove member -->
      <v-dialog v-model="flag.dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Bạn có muốn xóa ?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="flag.dialog = false">{{button_label.no}}</v-btn>
            <v-btn color="green darken-1" text @click="removeMember()">{{button_label.yes}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- dialog add member -->
      <v-dialog v-model="flag.dialog_add_member" persistent max-width="290">
        <v-card class="pa-2">
          <v-card-title class="headline">Thêm thành viên</v-card-title>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="flag.dialog_add_member = false">{{button_label.cancel}}</v-btn>
            <v-btn color="blue darken-1" text @click="flag.dialog_add_member = false">{{button_label.add}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <v-btn
      v-if="!flag.flag_edit_member"
      class="mt-3"
      elevation="3"
      block
      color="#EF5350"
      @click="editMember()"
    >{{button_label.edit_member}}</v-btn>
    <v-btn
      v-if="flag.flag_edit_member"
      class="mt-3"
      elevation="3"
      block
      color="primary"
      @click="editMemberDone()"
    >{{button_label.done}}</v-btn>
  </div>
</template>


<script>
import { button, error, label } from "@/const"
export default {
  data: () => ({
    items: [
      { header: "Member" },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        title: "Brunch this weekend?",
        subtitle:
          "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        subtitle:
          "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
        title: "Oui oui",
        subtitle:
          "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Birthday gift",
        subtitle:
          "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
      },
      { divider: true, inset: true },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "Recipe to try",
        subtitle:
          "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
      }
    ],
    button_label: button,
    error: error,
    flag: {
      flag_edit_member: false,
      dialog: false,
      removeIndex: -1,
      dialog_add_member: false
    },
    valid: true,
    email: '',
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || error.email
    ]
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },
    editMember() {
      this.flag.flag_edit_member = true;
    },
    editMemberDone() {
      this.flag.flag_edit_member = false;
    },
    showDialog(index) {
      this.flag.removeIndex = index;
      this.flag.dialog = true;
    },
    removeMember() {
      this.items.splice(this.flag.removeIndex, 1);
      this.flag.dialog = false;
    }
  }
};
</script>