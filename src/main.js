import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VeeValidate, { Validator } from 'vee-validate'
import axios from 'axios'
import vi from 'vee-validate/dist/locale/vi'

// add these before Vue is instantiated
window.axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:3333'

Vue.use(VeeValidate);
Validator.localize('vi', vi);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
