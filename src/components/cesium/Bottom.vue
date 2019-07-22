<template>
    <div class="bottom">
        <mu-avatar :icon="screenIcon" color="black" backgroundColor="white" :size="50" 
        :iconSize="32" @click="change_screen" style="cursor:pointer;"/>
        <br/>
        <mu-avatar icon="home" color="black" backgroundColor="white" :size="50" 
        :iconSize="32" v-show="!appbarShow" @click="back" style="cursor:pointer;"/> 
    </div>    
</template>

<script>
export default {
  name: 'bottom',
  data () {
      return {
          activeIndex: '1',
          appbarShow: false,
          screenIcon: 'fullscreen'
      }
  },
  methods: {
      back() {
          this.$router.replace('/main');
      },
      change_screen() {
          if(this.screenIcon === 'fullscreen') {
              this.screenIcon = 'close';
              this.launchFullscreen(document.documentElement);
          }else {
              this.screenIcon = 'fullscreen';
              this.exitFullscreen();
          }
          
      },
      launchFullscreen(element) {
          if(element.requestFullscreen) {
              element.requestFullscreen();
          } else if(element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
          } else if(element.webkitRequestFullscreen) {
              element.webkitRequestFullscreen();
          } else if(element.msRequestFullscreen) {
              element.msRequestFullscreen();
          }
      },
      exitFullscreen() {
          if(document.exitFullscreen) {
              document.exitFullscreen();
          } else if(document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
          } else if(document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
          }
      }
  },
  mounted() { 
      
  }
}
</script>

<style lang='less' scoped>
    .bottom {
        position: absolute;
        top: 75%;
        display: flex;
        flex-direction: column;
    }
</style>