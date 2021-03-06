import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_component: 'PersonalFee',
    user_infos: {},
    languages: 'vn',
  },
  getters: {
    currentComponent: state => {
      return state.current_component
    },
    getCurrentUserInfo: state => {
      return state.user_infos
    },
    getCurrentLanguages: state => {
      return state.languages
    }
  },
  actions: {
  },
  mutations: {
    setCurrentComponent(state, current_component) {
      Vue.set(state, 'current_component', current_component)
    },
    setCurrentUserInfo(state, user_infos) {
      Vue.set(state, 'user_infos', user_infos)
    },
    setLanguage(state, lang) {
      Vue.set(state, 'languages', lang)
    }
  },
  modules: {
  }
})
