import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Loading from '@/components/loading/Loading'
import Cesium from '@/components/cesium/Cesium'

Vue.use(Router);

let router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'loading',
      component: Loading
    },
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path: '/cesium',
      name: 'cesium',
      component: Cesium
    }
  ]
});

export default router;

