<template>
  <v-container fluid>
    <v-layout column>
      <ValidationObserver ref="obs">
        <v-card slot-scope="{ invalid }">
          <v-card-text>
            <v-flex class="mb-4">
              <v-avatar size="96" class="mr-4">
                <img id="img" src="https://randomuser.me/api/portraits/women/81.jpg" alt="Avatar" />
              </v-avatar>
              <v-btn @click="openAvatarPicker">Change Avatar</v-btn>
              <input type="file" id="file-upload" style="display:none" @change="onFileChange" />
            </v-flex>
            <ValidationProvider :name="labels.fullName" rules="required">
              <v-text-field 
                slot-scope="{
                  valid,
                  errors
                }"
                v-model="form.name" 
                label="Tên đầy đủ" 
                :readonly="!flag.editProfile"
                :success="valid"
                :error-messages="errors"
              >
              </v-text-field>
            </ValidationProvider>
            <v-text-field v-if="form.home" v-model="form.home.name" label="Tên nhà" disabled></v-text-field>
            <ValidationProvider :name="labels.email" rules="required|email">
            <v-text-field 
              slot-scope="{
                valid,
                errors
              }"
              v-model="form.email" 
              :label="labels.email" 
              :readonly="!flag.editProfile"
              :success="valid"
              :error-messages="errors"
            >
            </v-text-field>
            </ValidationProvider>
          </v-card-text>
          <v-alert v-if="response.status" class="ml-2 mr-2" :type=response.status border="left" outlined dense text>
            {{response.message}}
          </v-alert>
          <v-card-actions>
            <v-btn v-if="flag.editProfile" color="primary" :loading="loading" @click.native="updateProfile" :disabled="invalid ">
              <v-icon left dark>mdi-check</v-icon>{{button_label.save}}
            </v-btn>
            <v-btn v-if="!flag.editProfile" color="warning" @click.native="flag.editProfile = true">
              <v-icon left dark>mdi-check</v-icon>{{button_label.edit}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </ValidationObserver>
    </v-layout>
  </v-container>
</template>

<script>
import { button, error, label } from '@/static/define/const'
import {
  ValidationProvider,
  ValidationObserver
} from 'vee-validate'
export default {
  pageTitle: "My Profile",
  components: {
    ValidationObserver,
    ValidationProvider
  },
  data() {
    return {
      loading: false,
      form: {},
      showAvatarPicker: false,
      response: {},
      button_label: button,
      labels: label,
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
        this.form = response.data.data[0];
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
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById("img").setAttribute("src", e.target.result);
        }
        reader.readAsDataURL(e.target.files[0]);
      }
    },
    uploadFile() {
      var self = this;
      axios
        .post("URL", self.formData)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    updateProfile() {
      const token = localStorage.getItem("tweetr-token");
      axios.put("/account/update_profile",
        {
          name: this.form.name,
          email: this.form.email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(response => {
        this.response = response.data
        this.flag.editProfile = false
      })
    }
  }
};
</script>