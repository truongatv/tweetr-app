<template>
  <v-container fluid>
    <v-layout column>
      <ValidationObserver ref="obs">
        <v-card slot-scope="{ invalid }">
          <v-card-text>
            <v-flex class="mb-4">
              <v-avatar size="96" class="mr-4">
                <img v-if="user.avatar" id="img" :src="user.avatar" alt="Avatar" />
                <img v-else id="img" src="@/static/avatar/default_avatar.png" alt="avatar" />
              </v-avatar>
              <v-btn @click="openAvatarPicker">{{$t('buttons.change_avatar')}}</v-btn>
              <input type="file" id="file-upload" style="display:none" @change="onFileChange" />
            </v-flex>
            <div v-if="!flag.edit_password">
              <!-- full name  -->
              <ValidationProvider
                :name="$t('labels.full_name')"
                rules="required"
                v-slot="{ validated, errors }"
              >
                <v-text-field
                  v-model="user.name"
                  :label="$t('labels.full_name')"
                  :readonly="!flag.edit_profile"
                  :success="validated"
                  :error-messages="errors"
                ></v-text-field>
              </ValidationProvider>
              <v-text-field
                v-if="user.home"
                v-model="user.home.name"
                :label="$t('labels.home_name')"
                disabled
              ></v-text-field>
              <!-- email  -->
              <v-text-field
                v-model="user.email"
                :label="$t('labels.email')"
                :readonly="!flag.edit_profile"
                disabled
              ></v-text-field>
              <validationProvider :name="$t('labels.currency')" rules="required" v-slot="{ errors }" >
                <v-select
                  v-model="user.currency_id"
                  :items="listCurrency"
                  :label="$t('labels.currency')"
                  item-text="name"
                  item-value="id"
                  :readonly="!flag.edit_profile"
                  :error-messages="errors"
                >
                  <template v-slot:selection="{ item }">
                    <span>{{ item.name }}</span>
                  </template>
                </v-select>
              </validationProvider>
            </div>
            <div v-if="flag.edit_password">
              <!-- current_password  -->
              <ValidationProvider
                :name="$t('labels.current_password')"
                rules="required|min:6|max:35"
                v-slot="{ validated, errors }"
              >
                <v-text-field
                  type="password"
                  v-if="flag.edit_password"
                  v-model="user.password"
                  :label="$t('labels.current_password')"
                  :readonly="!flag.edit_password"
                  :success="validated"
                  :error-messages="errors"
                ></v-text-field>
              </ValidationProvider>
              <!-- new password  -->
              <ValidationProvider
                :name="$t('labels.new_password')"
                rules="required|min:6|max:35"
                v-slot="{ validated, errors }"
                vid="password"
              >
                <v-text-field
                  type="password"
                  v-if="flag.edit_password"
                  v-model="user.new_password"
                  :label="$t('labels.new_password')"
                  :readonly="!flag.edit_password"
                  :success="validated"
                  :error-messages="errors"
                ></v-text-field>
              </ValidationProvider>
              <!-- confirm password  -->
              <ValidationProvider
                :name="$t('labels.confirm_password')"
                rules="required|min:6|max:35|confirmed:password"
                v-slot="{ validated, errors }"
              >
                <v-text-field
                  v-if="flag.edit_password"
                  type="password"
                  v-model="user.confirm_password"
                  :label="$t('labels.confirm_password')"
                  :readonly="!flag.edit_password"
                  :success="validated"
                  :error-messages="errors"
                ></v-text-field>
              </ValidationProvider>
            </div>
          </v-card-text>
          <v-alert
            v-if="response.status"
            class="ml-2 mr-2"
            :type="response.status"
            dismissible
            border="left"
            outlined
            dense
            text
          >{{response.message}}</v-alert>
          <v-card-actions>
            <!-- save data  -->
            <v-btn
              v-if="flag.edit_profile || flag.edit_password"
              color="primary"
              :loading="loading"
              @click.native="updateProfile"
              :disabled="invalid "
            >
              <v-icon left dark>mdi-check</v-icon>
              {{$t('buttons.save')}}
            </v-btn>
            <!-- edit profile  -->
            <v-btn v-if="!flag.edit_profile" color="light-green" @click.native="editProfile()">
              <v-icon left dark>mdi-check</v-icon>
              {{$t('buttons.edit_profile')}}
            </v-btn>
            <!-- edit password -->
            <v-btn
              v-if="!flag.edit_password"
              absolute
              right
              outlined
              color="red"
              @click.native="setChangePassword()"
            >
              <v-icon left dark>mdi-key</v-icon>
              {{$t('buttons.change_password')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </ValidationObserver>
    </v-layout>
  </v-container>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import UserJs from "@/scripts/userCommon";

export default {
  mixins: [UserJs],
  pageTitle: "My Profile",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      loading: false,
      user: {},
      response: {},
      flag: {
        edit_profile: false,
        edit_password: false
      }
    };
  },
  async created() {
    this.getUserInfo().then(response => {
      this.user = response;
    });
  },
  methods: {
    openAvatarPicker() {
      document.getElementById("file-upload").click();
    },
    async onFileChange(e) {
      var self = this;
      var files = e.target.files || e.dataTransfer.files;
      if (files.length > 0) {
        const token = localStorage.getItem("tweetr-token");
        //request save ava to api
        let formData = new FormData();
        formData.append("file", files[0]);
        await axios
          .put("account/change_ava", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "multipart/form-data"
            }
          })
          .then(response => {
            if (response.data.data) {
              self.user.avatar = response.data.data;
            }
          });
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("img").setAttribute("src", e.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
        //call function save data to store in user.js mixins
        this.setStoreUser();
      }
    },
    async updateProfile() {
      const token = localStorage.getItem("tweetr-token");
      if (this.flag.edit_password) {
        this.changePassword(token);
      } else {
        await axios
          .put(
            "/account/update_profile",
            {
              name: this.user.name,
              email: this.user.email,
              currency_id: this.user.currency_id
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            this.response = response.data;
            this.flag.edit_profile = false;
          });
      }
      this.setStoreUser();
    },
    async changePassword(token) {
      await axios
        .put(
          "/account/change_password",
          {
            password: this.user.password,
            new_password: this.user.new_password
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(response => {
          this.response = response.data;
          this.response.message = this.$t('messages.success.change_password_success')
          this.flag.edit_profile = false;
        })
        .catch(error => {
          this.response = error.response.data;
          this.response.message = this.$t("messages.error.password_not_match");
        });
    },
    editProfile() {
      this.response = {}
      this.user.password = this.user.new_password = this.user.confirm_password = "";
      this.flag.edit_password = false;
      this.flag.edit_profile = true;
      this.$refs.obs.reset();

    },
    setChangePassword() { 
      this.response = {}
      this.$refs.obs.reset();
      this.flag.edit_password = true;  
      this.flag.edit_profile = false
    }
  }
};
</script>