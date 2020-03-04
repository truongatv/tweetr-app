<template>
  <div>
    <div class="d-inline">
      <v-btn v-if="!loginStatus" text to="/login">
        <span class="mr-2">{{$t('buttons.login')}}</span>
      </v-btn>
      <v-btn v-if="loginStatus" @click="logout" text>
        <span class="mr-2">{{$t('buttons.logout')}}</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn v-if="!loginStatus" text to="/signup">
        <span class="mr-2">{{$t('buttons.sign_up')}}</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </div>
    <div class="d-inline">
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn class="ma-2" v-on="on" tile large color="teal" icon>
            <country-flag :country="getCountry" size="normal" />
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" @click="changeLanguage(item)">
            <v-btn class="ma-2" tile large color="teal" icon>
              <country-flag :country="item" size="normal" />
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import CountryFlag from "vue-country-flag";
export default {
  components: {
    CountryFlag
  },
  data() {
    return {
      loginStatus: false,
      items: ["vn", "jp", "us"]
    };
  },
  created() {
    const token = localStorage.getItem("tweetr-token");
    if (token) this.loginStatus = true;
  },
  computed: {
    getCountry() {
      //setup language
      const language = this.$cookie.get('language')
      if(language) {
        this.$store.commit("setLanguage", language)
      }
      const country = this.$store.getters.getCurrentLanguages
      this.$i18n.locale = country
      return country
    }
  },
  methods: {
    logout() {
      if (this.loginStatus) {
        localStorage.removeItem("tweetr-token");
        this.$router.push("login");
      }
    },
    changeLanguage(item) {
      if(this.loginStatus) {
        const token = localStorage.getItem("tweetr-token");
        axios.put("/account/update_language", 
            {
              language: item
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            
          })
      }
      this.$store.commit("setLanguage", item)
      this.$i18n.locale = item
      this.$cookie.set('language', item)
    }
  },
  watch: {
    $route(to, from) {
      const token = localStorage.getItem("tweetr-token");
      if (token) this.loginStatus = true;
      else this.loginStatus = false;
    }
  }
};
</script>