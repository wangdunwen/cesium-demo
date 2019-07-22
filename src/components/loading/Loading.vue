<template>
    <div class='main'>
        <mu-circular-progress :size='60' :strokeWidth='5' style="margin-top:40%;"/>
        <br/>
        <div style='text-align: center'>正在加载数据...</div>
    </div>
</template>

<script>
export default {
  name: 'loading',
  data () {
    return {
      
    }
  },
  mounted() { 
      this.$router.push({name: 'main'});
  }
}
</script>

<style scoped>
    .main {
        position: absolute;
        text-align: center;
        height: 100%;
        width: 100%;
    }
</style>