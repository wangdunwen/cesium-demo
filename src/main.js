// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'highlight.js/styles/googlecode.css'
import hljs from 'highlight.js'
// import VueResource from 'vue-resource'

// 引入UI库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-teal.css'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(MuseUI);

Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');

  blocks.forEach((block) => {
    hljs.highlightBlock(block);
  });
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
