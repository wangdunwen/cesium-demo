<template>
  <div class="main" ref="main">
  </div>
</template>

<script>

export default {
  name: 'main',
  data () {
    return {
    }
  },
  components: {
  },
  methods: {
  },
  mounted() { 
    this.$router.push({name: 'cesium'});
  }
}
</script>

<style scoped>
</style>