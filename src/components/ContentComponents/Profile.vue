<template>
  <v-container fluid>
    <v-layout column>
      <v-card>
        <v-card-text>
          <v-flex class="mb-4">
            <v-avatar size="96" class="mr-4">
              <img id="img" src="https://randomuser.me/api/portraits/women/81.jpg" alt="Avatar" />
            </v-avatar>
            <v-btn @click="openAvatarPicker">Change Avatar</v-btn>
            <input type="file" id="file-upload" style="display:none" @change="onFileChange" />
          </v-flex>
          <v-text-field v-model="form.firstName" label="Full name"></v-text-field>
          <v-text-field v-model="form.homeName" label="Home Name"></v-text-field>
          <v-text-field v-model="form.contactEmail" label="Email Address"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :loading="loading" @click.native="update">
            <v-icon left dark>mdi-check</v-icon>Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  pageTitle: "My Profile",
  data() {
    return {
      loading: false,
      form: {
        firstName: "John",
        lastName: "Doe",
        contactEmail: "john@doe.com",
        avatar: "MALE_CAUCASIAN_BLOND_BEARD",
        homeName: "truongatv"
      },
      showAvatarPicker: false
    };
  },
  methods: {
    openAvatarPicker() {
      document.getElementById("file-upload").click();
    },
    onFileChange(e) {
      var self = this;
      var files = e.target.files || e.dataTransfer.files
      if (files.length > 0) {
        var reader = new FileReader()
        reader.onload = function (e) {
          document.getElementById("img").setAttribute('src', e.target.result);
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
    }
  }
};
</script>