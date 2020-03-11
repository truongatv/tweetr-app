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
            <ValidationProvider
              :name="$t('labels.full_name')"
              rules="required"
              v-slot="{ validated, errors }"
            >
              <v-text-field
                v-model="user.name"
                :label="$t('labels.full_name')"
                :readonly="!flag.editProfile"
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
            <ValidationProvider
              :name="$t('labels.email')"
              rules="required|email"
              v-slot="{ validated, errors }"
            >
              <v-text-field
                v-model="user.email"
                :label="$t('labels.email')"
                :readonly="!flag.editProfile"
                :success="validated"
                :error-messages="errors"
              ></v-text-field>
            </ValidationProvider>
          </v-card-text>
          <v-alert
            v-if="response.status"
            class="ml-2 mr-2"
            :type="response.status"
            border="left"
            outlined
            dense
            text
          >{{response.message}}</v-alert>
          <v-card-actions>
            <v-btn
              v-if="flag.editProfile"
              color="primary"
              :loading="loading"
              @click.native="updateProfile"
              :disabled="invalid "
            >
              <v-icon left dark>mdi-check</v-icon>
              {{$t('buttons.save')}}
            </v-btn>
            <v-btn v-if="!flag.editProfile" color="warning" @click.native="flag.editProfile = true">
              <v-icon left dark>mdi-check</v-icon>
              {{$t('buttons.edit')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </ValidationObserver>
    </v-layout>
  </v-container>
</template>

<script>
// import { button, error, label } from '@/static/define/const'
import { ValidationProvider, ValidationObserver } from "vee-validate";
export default {
  pageTitle: "My Profile",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      loading: false,
      user: {},
      showAvatarPicker: false,
      response: {},
      flag: {
        editProfile: false
      }
    };
  },
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
    openAvatarPicker() {
      document.getElementById("file-upload").click();
    },
    onFileChange(e) {
      var self = this;
      var files = e.target.files || e.dataTransfer.files;
      if (files.length > 0) {
        const token = localStorage.getItem("tweetr-token");
        //request save ava to api
        let formData = new FormData();
        formData.append("file", files[0]);
        axios
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
      }
    },
    updateProfile() {
      const token = localStorage.getItem("tweetr-token");
      axios
        .put(
          "/account/update_profile",
          {
            name: this.user.name,
            email: this.user.email
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then(response => {
          this.response = response.data;
          this.flag.editProfile = false;
        });
    }
  }
};
</script>