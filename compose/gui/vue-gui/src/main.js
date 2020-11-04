import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';

Vue.config.productionTip = false;

Vue.use(VueRx, Rx);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');
