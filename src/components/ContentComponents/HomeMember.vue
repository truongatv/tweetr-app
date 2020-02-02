<template>
  <div v-if="isHomeInfoLoaded">
    <!-- home detail -->
    <v-card>
      <v-subheader>Thông tin nhà ở</v-subheader>
      <v-card-text>
        <v-text-field label="Tên nhà" v-model="home_infos[0].home_name"></v-text-field>
        <v-text-field label="Địa chỉ" v-model="home_infos[0].address"></v-text-field>
        <v-text-field label="Người quản lý" v-model="home_infos[0].admin_id" disabled></v-text-field>
      </v-card-text>
      <!-- <v-alert v-if="response.status" class="ml-2 mr-2" :type=response.status border="left" outlined dense text>
        {{response.message}}
      </v-alert> -->
      <v-card-actions>
        <v-btn color="primary" @click.native="">
          <v-icon left dark>mdi-check</v-icon>Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
    
    <!-- member detail -->
    <v-card class="mx-auto mt-2">
      <v-list>
        <div class="d-flex pr-5">
            <v-subheader>Thành viên</v-subheader>
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
        <template v-for="item in home_infos">
          <v-list-item :key="item.user_id">
            <v-list-item-avatar>
              <v-img src="@/static/avatar/default_avatar.png"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-html="item.username"></v-list-item-title>
            </v-list-item-content>
            <v-btn text icon color="red" v-if="flag.flag_edit_member" @click="showDialog(item)">
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
            <v-btn color="red darken-1" text @click="removeMember(0)">{{button_label.no}}</v-btn>
            <v-btn color="green darken-1" text @click="removeMember(1)">{{button_label.yes}}</v-btn>
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
      { header: "Thành viên" },
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
    home_infos: {},
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
  created() {
    //get home info
    const token = localStorage.getItem("tweetr-token")
    axios
      .get('/home/home_info', {
          headers: {
            Authorization: `Bearer ${token}`
          }
      })
      .then(response => {
        this.home_infos = response.data.data
      })
  },
  computed: {
    isHomeInfoLoaded () {
      return Object.keys(this.home_infos).length > 0
    }
  },
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
    showDialog(item) {
      this.flag.removeMember = item;
      this.flag.dialog = true;
    },
    removeMember(removeFlag) {
      if(removeFlag == 1) {
        axios
          .put('/home/remove_member', {
              headers: {
                Authorization: `Bearer ${token}`
              }
          })
          .then(response => {
            if(response) {
              this.home_infos.splice(this.flag.removeMember, 1);
            }
          })
      }
      this.flag.dialog = false;

    }
  },
};
</script>