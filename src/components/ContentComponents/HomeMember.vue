<template>
  <div>
    <!-- home detail -->
    <ValidationObserver ref="obs">
      <v-card v-if="isHomeInfoLoaded" slot-scope="{invalid, validated}">
        <v-card-title>{{$t('labels.home_info')}}</v-card-title>
        <v-card-subtitle v-if="flag.create_home">
          <div class="red lighten-1 text-center">
            <span class="white--text">{{$t('messages.alert.create_home')}}</span>
          </div>
        </v-card-subtitle>
        <v-card-text>
          <validationProvider :name="$t('labels.home_name')" rules="required" v-slot="{errors}">
            <v-text-field
              :label="$t('labels.home_name')"
              v-model="home_infos.homeInfo.name" 
              :readonly="!flag.edit_home_info && !flag.create_home"
              :error-messages="errors"
            >
            </v-text-field>
          </validationProvider>
          <validationProvider :name="$t('labels.address')" rules="required" v-slot="{ errors }" >
            <v-text-field
              :label="$t('labels.address')"
              v-model="home_infos.homeInfo.address" 
              :readonly="!flag.edit_home_info && !flag.create_home"
              :error-messages="errors"
            >
            </v-text-field>
          </validationProvider>
          <validationProvider :name="$t('labels.address')" rules="required" v-slot="{ errors }" >
            <v-select
              v-model="home_infos.admin"
              :items="listMemberUser"
              :chips="true"
              :label="$t('labels.admin')"
              item-text="name"
              return-object
              :readonly="!flag.edit_home_info && !flag.create_home"
              :error-messages="errors"
            >
              <template v-slot:selection="{ item }">
                <v-chip>
                  <span>{{ item.name }}</span>
                </v-chip>
              </template>
            </v-select>
          </validationProvider>
        </v-card-text>
        <v-alert
          v-if="response.response_home_update.status"
          class="ml-2 mr-2"
          :type="response.response_home_update.status"
          border="left"
          outlined
          dismissible
          dense
          text
        >{{response.response_home_update.message}}</v-alert>
        <v-card-actions>
          <!-- update home info -->
          <v-btn v-if="!flag.edit_home_info && !flag.create_home && isAdmin" color="warning" @click.native="flag.edit_home_info = true">
            {{$t('buttons.edit')}}
          </v-btn>
          <v-btn v-if="flag.edit_home_info" color="primary" @click.native="updateHomeInfo" :disabled="invalid">
            <v-icon left dark>mdi-check</v-icon>
            {{$t('buttons.save')}}
          </v-btn>
          <!-- create new home info -->
          <v-btn v-if="flag.create_home" color="primary" @click.native="updateHomeInfo" :disabled="invalid || !validated">
            <v-icon left dark>mdi-check</v-icon>
            {{$t('buttons.save')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </ValidationObserver>

    <!-- member detail -->
    <div v-if="isHomeInfoLoaded">
      <v-card class="mx-auto mt-2">
        <v-list two-line>
          <div class="d-flex pr-5">
            <v-subheader>{{$t('labels.member')}}</v-subheader>
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
          <template v-for="item in home_infos.members">
            <v-list-item :key="item.user_id">
              <v-list-item-avatar>
                <v-img v-if="item.avatar" :src="item.avatar"></v-img>
                <v-img v-else src="@/static/avatar/default_avatar.png"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="item.full_name"></v-list-item-title>
                <v-list-item-subtitle v-if="item.user_id == home_infos.admin.id">{{$t('labels.manager')}}</v-list-item-subtitle>
              </v-list-item-content>
              <v-btn
                text
                icon
                color="red"
                v-if="item.user_id !== home_infos.admin.id && flag.flag_edit_member"
                @click="showDialog(item)"
              >
                <v-icon>mdi-account-remove</v-icon>
              </v-btn>
            </v-list-item>
          </template>
        </v-list>
        <!-- dialog remove member -->
        <v-dialog v-model="flag.dialog" max-width="290">
          <v-card>
            <v-card-title class="headline" v-html="$t('messages.alert.are_you_sure_delete', {'name': remove_member_detail.full_name})"></v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="removeMember(0)">{{$t('buttons.no')}}</v-btn>
              <v-btn color="green darken-1" text @click="removeMember(1)">{{$t('buttons.yes')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- dialog add member -->
        <v-dialog v-model="flag.dialog_add_member" persistent max-width="290">
          <v-card class="pa-2">
            <v-card-title class="headline">{{$t('labels.add_new_member')}}</v-card-title>
            <v-form ref="form" v-model="valid" lazy-validation>
              <validationProvider :name="$t('labels.email')" rules="required|email" v-slot="{ valid, errors }">
                <v-text-field 
                  v-model="email"
                  :label="$t('labels.email')" 
                  required
                  :success="valid"
                  :error-messages="errors"
                >
                </v-text-field>
              </validationProvider>
            </v-form>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red darken-1" text @click="addMember(false)">{{$t('buttons.cancel')}}</v-btn>
              <v-btn color="blue darken-1" text @click="addMember(true)">{{$t('buttons.add')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
      <div v-if="isAdmin">
        <v-btn
          v-if="!flag.flag_edit_member"
          class="mt-3"
          elevation="3"
          block
          color="#EF5350"
          @click="editMember()"
        >{{$t('buttons.edit_member')}}</v-btn>
        <v-btn
          v-if="flag.flag_edit_member"
          class="mt-3"
          elevation="3"
          block
          color="primary"
          @click="editMemberDone()"
        >{{$t('buttons.done')}}</v-btn>
      </div>
    </div>
    <!-- show snackbars -->
    <v-snackbar v-model="snackbar.flag" :color="snackbar.color">
      {{snackbar.message}}
      <v-btn color="white" text @click="snackbar.flag = false">{{$t('buttons.cancel')}}</v-btn>
    </v-snackbar>
  </div>
</template>


<script>
import {
  ValidationProvider,
  ValidationObserver
} from 'vee-validate'
export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data: () => ({
    home_infos: {},
    remove_member_detail: {},
    email: "",
    response: {
      response_home_update: {}
    },
    flag: {
      flag_edit_member: false,
      dialog: false,
      dialog_add_member: false,
      create_home: false,
      edit_home_info: false
    },
    valid: true,
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
      })
      .catch(error => {
        this.flag.create_home = true
        let user_info = this.$store.getters.getCurrentUserInfo
        this.home_infos = {
          admin: {},
          homeInfo: {},
          members: [{
            'full_name': user_info.name,
            'user_email': user_info.email,
            'user_id': user_info.id,
            'avatar': user_info.avatar
          }]
        }
      })
  },
  computed: {
    isHomeInfoLoaded() {
      return Object.keys(this.home_infos).length > 0;
    },
    isFormValid() {
      console.log(this.fields)
      return Object.keys(this.fields).every(key => this.fields[key].valid);
    },
    isAdmin () {
      let user_info = this.$store.getters.getCurrentUserInfo
      if((typeof this.home_infos.homeInfo !== 'undefined' && user_info.id == this.home_infos.admin.id) || this.flag.create_home) {
        return true
      } else {
        return false
      }
    },
    listMemberUser() {
      let listMember = new Array();
      this.home_infos.members.map((item) => {
        listMember.push({
          id: item.user_id,
          name: item.full_name
        })
      })
      return listMember.filter(Boolean)
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
      this.remove_member_detail = item;
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
              remove_user_id: this.remove_member_detail.user_id
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
                this.home_infos.indexOf(this.remove_member_detail),
                1
              );
            }
          });
      }
      this.flag.dialog = false;
    },
    //add member to home
    addMember(flag) {
      const $t = this.$t.bind(this)
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
            }
            const addMemberData = {
              address: this.home_infos.address,
              admin_id: this.home_infos.admin_id,
              full_name: response.data.data.name,
              home_name: this.home_infos.home_name,
              user_email: response.data.data.email,
              user_id: response.data.data.id
            }
            this.home_infos.push(addMemberData)
            this.snackbar.message = $t('messages.success.add_done')
            this.snackbar.color = "green"
            this.snackbar.flag = true
            this.flag.dialog_add_member = false;
          })
          .catch((error)  => {
            if(error.response.data.message == 405) {
              this.snackbar.message = $t('messages.error.not_exist_user')
            } else if(error.response.data.message == 404) {
              this.snackbar.message = $t('messages.error.user_is_ready_in_other_home')
            } else if(error.response.data.message = 407) {
              this.snackbar.message = $t('messages.error.need_create_home')
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
      const token = localStorage.getItem("tweetr-token")
      axios
        .put(
          "/home/update_home",
          {
            name: this.home_infos.homeInfo.name,
            address: this.home_infos.homeInfo.address,
            admin_id: this.home_infos.admin.id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(response => {
          if (response.status == 200) {
            this.response.response_home_update = response.data;
            this.flag.edit_home_info = false
          }
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  }
};
</script>