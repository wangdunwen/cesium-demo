<template>
    <div class='main'>
        <map-view></map-view>
        <top></top>
        <bottom></bottom>
        <div>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import router from '../../router';
import mapView from './MapView';
import top from './Top';
import bottom from './Bottom';

export default {
  name: 'cesium',
  data () {
      return {
        
      }
  },
  methods: {
      
  },
  mounted() { 
      
  },
  router: router,
  components: {
    mapView,
    top,
    bottom
  }
}
</script>

<style scoped>
    .main {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>