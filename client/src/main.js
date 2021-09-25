import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'materialize-css/dist/js/materialize.min'
import vuelidate from 'vuelidate'
import contenteditable from 'vue-contenteditable'
import infiniteScroll from 'vue-infinite-scroll'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import vmodal from 'vue-js-modal'

export const eventBus = new Vue();

Vue.use(vmodal)
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
Vue.use(infiniteScroll)
Vue.use(require('vue-moment'));
Vue.use(contenteditable)
Vue.use(vuelidate)
Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
