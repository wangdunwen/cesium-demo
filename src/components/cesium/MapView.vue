<template>
  <div id='map'>
  </div>
</template>

<script>
export default {
  name: 'map',
  data () {
      return {
        
      }
  },
  mounted() { 
      window.viewer = new Cesium.Viewer('map', {
          animation: false,
          baseLayerPicker: false,
          geocoder: false,
          scene3DOnly: false,
          sceneModePicker: false,
          selectionIndicator: false,
          infoBox: false,
          homeButton: false,
          timeline: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          // imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
          //     url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
          // })
          imageryProvider: new Cesium.createTileMapServiceImageryProvider({
            url: 'static/data/SatelliteMap/'
          })
      });

      //视角切换到中国
      viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(112, 30, 15000000)
      });

      //添加zoomControl & compass
      viewer.extend(Cesium.viewerCesiumNavigationMixin, {enableZoomControls: true, enableCompass: false});

      //去除Cesium图标和版本信息
      viewer._cesiumWidget._creditContainer.style.display = "none";

      //开启光照模式
      viewer.scene.globe.enableLighting = true;

      //禁用双击事件，禁止视角切换
      viewer.trackedEntity = undefined;
      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );

      //禁止角度倾斜
      viewer.scene.screenSpaceCameraController.enableTilt = false;

      //显示刷新率和帧率
      viewer.scene.debugShowFramesPerSecond = true;

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #map {
      position: absolute;
      width: 100%;
      height: 100%;
  }
</style>
