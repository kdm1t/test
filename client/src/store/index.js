import Vue from 'vue'
import Vuex from 'vuex'
import auth from "./modules/auth"
import audioPlayer from "./modules/audioPlayer";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth, audioPlayer
  }
})
