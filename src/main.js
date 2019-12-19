import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VeeValidate from 'vee-validate'
import axios from 'axios'

// add these before Vue is instantiated
window.axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:3333'

Vue.use(VeeValidate)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
