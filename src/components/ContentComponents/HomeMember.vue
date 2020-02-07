<template>
  <div v-if="isHomeInfoLoaded">
    <!-- home detail -->
    <v-card>
      <v-subheader>Thông tin nhà ở</v-subheader>
      <v-card-text>
        <v-text-field label="Tên nhà" v-model="home_info.home_name"></v-text-field>
        <v-text-field label="Địa chỉ" v-model="home_info.address"></v-text-field>
        <v-text-field label="Người quản lý" v-model="home_info.admin_id" disabled></v-text-field>
      </v-card-text>
      <v-alert
        v-if="response.responseHomeUpdate.status"
        class="ml-2 mr-2"
        :type="response.responseHomeUpdate.status"
        border="left"
        outlined
        dense
        text
      >{{response.responseHomeUpdate.message}}</v-alert>
      <v-card-actions>
        <v-btn color="primary" @click.native="updateHomeInfo">
          <v-icon left dark>mdi-check</v-icon>
          {{button_label.save}}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- member detail -->
    <v-card class="mx-auto mt-2">
      <v-list two-line>
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
              <v-list-item-subtitle v-if="item.user_id == item.admin_id">Quản lý</v-list-item-subtitle>
            </v-list-item-content>
            <v-btn
              text
              icon
              color="red"
              v-if="item.user_id !== item.admin_id && flag.flag_edit_member"
              @click="showDialog(item)"
            >
              <v-icon>mdi-account-remove</v-icon>
            </v-btn>
          </v-list-item>
        </template>
      </v-list>
      <!-- dialog remove member -->
      <v-dialog v-model="flag.dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Bạn có muốn xóa " {{removeMemberDetail.full_name}} " ?</v-card-title>
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
          <v-card-title class="headline">{{label.addNewMember}}</v-card-title>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="email" :rules="emailRules" v-validate="'required|email'" label="E-mail" required></v-text-field>
          </v-form>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="addMember(false)">{{button_label.cancel}}</v-btn>
            <v-btn color="blue darken-1" text @click="addMember(true)" :disabled="!isFormValid">{{button_label.add}}</v-btn>
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

    <!-- show snackbars -->
    <v-snackbar v-model="snackbar.flag" :color="snackbar.color">
      {{snackbar.message}}
      <v-btn color="white" text @click="snackbar.flag = false">{{button_label.cancel}}</v-btn>
    </v-snackbar>
  </div>
</template>


<script>
import { button, messages, label } from "@/const";
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
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>'
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
    home_info: {},
    removeMemberDetail: {},
    email: "",
    response: {
      responseHomeUpdate: {}
    },
    button_label: button,
    label: label,
    flag: {
      flag_edit_member: false,
      dialog: false,
      removeIndex: -1,
      dialog_add_member: false
    },
    valid: true,
    emailRules: [
      v => !!v || messages.error.required,
      v => /.+@.+\..+/.test(v) || messages.error.email
    ],
    snackbar: {
      flag: false,
      message: "",
      color: "#004D40"
    }
  }),
  created() {
    //get home info
    const token = localStorage.getItem("tweetr-token");
    axios
      .get("/home/home_info", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        this.home_infos = response.data.data;
        this.home_info = response.data.data[0];
      });
  },
  computed: {
    isHomeInfoLoaded() {
      return Object.keys(this.home_infos).length > 0;
    },
    isFormValid() {
      return Object.keys(this.fields).every(key => this.fields[key].valid);
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
      this.removeMemberDetail = item;
      this.flag.dialog = true;
    },
    //remove member from home
    removeMember(removeFlag) {
      if (removeFlag == 1) {
        const token = localStorage.getItem("tweetr-token");
        axios
          .put(
            "/home/remove_member",
            {
              remove_user_id: this.removeMemberDetail.user_id
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            if (response.status == 200) {
              this.home_infos.splice(
                this.home_infos.indexOf(this.removeMemberDetail),
                1
              );
            }
          });
      }
      this.flag.dialog = false;
    },
    //add member to home
    addMember(flag) {
      if (this.email != "" && flag) {
        const token = localStorage.getItem("tweetr-token");
        axios
          .post(
            "/home/add_member",
            {
              email: this.email
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            if(response.status == 400) {
              console.log("asfsdfds")
            }
            const addMemberData = {
              address: this.home_infos.address,
              admin_id: this.home_infos.admin_id,
              full_name: response.data.data.name,
              home_name: this.home_infos.home_name,
              user_email: response.data.data.email,
              user_id: response.data.data.id,
              username: response.data.data.username
            }
            this.home_infos.push(addMemberData)
            this.snackbar.message = messages.success.addDone
            this.snackbar.color = "green"
            this.snackbar.flag = true
            this.flag.dialog_add_member = false;
          })
          .catch((error)  => {
            if(error.response.data.message == 405) {
              this.snackbar.message = messages.error.notExistUser
            } else if(error.response.data.message == 404) {
              this.snackbar.message = messages.error.userIsReadyInOtherHome
            }
            this.flag.dialog_add_member = false
            this.snackbar.flag = true
          });
      } else {
        this.flag.dialog_add_member = false;
      }
      this.email = ""
    },

    /**
    update home info
    */
    updateHomeInfo() {
      const token = localStorage.getItem("tweetr-token");
      axios
        .put(
          "/home/update_home",
          {
            name: this.home_info.home_name,
            address: this.home_info.address
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(response => {
          if (response.status == 200) {
            this.response.responseHomeUpdate = response.data;
          }
        });
    }
  }
};
</script>