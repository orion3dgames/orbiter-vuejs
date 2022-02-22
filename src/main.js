import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'

Vue.config.productionTip = false;
Vue.config.ignoredElements = [
  'a-scene',
  'a-camera',
  'a-box',
  'a-image',
  'a-asset',
  'a-asset-item',
  'a-assets',
  'a-sphere',
  'a-entity',
  'a-cursor',
  'a-mixin',
  'a-sky',
  'a-cylinder',
];

// import styles
import "@/scss/site.scss";

// IMPORT LAYOUTS
import DefaultLayout from "./layouts/Default";
import PublicLayout from "./layouts/Public";
import GameLayout from "./layouts/Game";
Vue.component('default_layout', DefaultLayout);
Vue.component('public_layout', PublicLayout);
Vue.component('game_layout', GameLayout);

// VUEX
Vue.use(Vuex);
import store from './store'

// INITIALIZE VUE
new Vue({
  router,
  store: store,
  render: h => h(App),
  data: function(){
    return {
      user: {}
    }
  },
}).$mount('#app')
