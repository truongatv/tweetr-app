import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_component: 'Test'
  },
  getters: {
    currentComponent: state => {
      return state.current_component
    }
  },
  actions: {
  },
  mutations: {
    setCurrentComponent (state, current_component) {
      Vue.set(state, 'current_component', current_component)
    }
  },
  modules: {
  }
})
