<template>
  <div class="top">
    <mu-appbar title="Cesium" v-show="appbarShow">
      <mu-icon-button slot="left" @click="takeBack">
        <mu-icon value="keyboard_arrow_left" :size="24"/>
      </mu-icon-button>
      <mu-text-field icon="search" class="appbar-search-field"  slot="right" hintText="请输入搜索内容"/>
      <mu-icon-menu
        icon="more_vert"
        :anchorOrigin="leftTop"
        :targetOrigin="leftTop" slot="right">
        <mu-menu-item title="test1" />
        <mu-menu-item title="test2" />
        <mu-menu-item title="test3" />
        <mu-menu-item title="test4" />
        <mu-menu-item title="test5" />
      </mu-icon-menu>
      <mu-icon-button icon="menu" slot="right" @click="toggle(true)"/>
    </mu-appbar>
    <!-- 底部返回按钮 -->
    <mu-avatar icon="keyboard_arrow_right" color="white" backgroundColor="#009688" :size="50" 
    style="margin-top:10px;cursor:pointer;" :iconSize="24" v-show="!appbarShow" @click="takeBack"/> 
    <!-- 抽屉 -->
    <mu-drawer right :open="drawOpen" :docked="docked" @close="toggle()" style="background-color: #B0E2FF;opacity: 0.9;">
      <mu-list @itemClick="docked ? '' : toggle()">
        <mu-list-item title="画面" @click="drawPolygon"/>
        <mu-list-item title="编辑面" @click="editPolygon"/>
        <mu-list-item title="镜头缩放插件" @click="showZoomControl"/>
        <mu-list-item v-if="docked" @click.native="open = false" title="Close"/>
      </mu-list>
    </mu-drawer>
    <mu-raised-button label="结束标绘" class="demo-raised-button" primary style="position:absolute;top:100%;left: 45%;" v-show="drawPolygonShow" @click="endPlot"/>
    <mu-raised-button label="结束编辑" class="demo-raised-button" primary style="position:absolute;top:100%;left: 45%;" v-show="editPolygonShow" @click="endEditPolygon"/>

    <!-- 视角缩放工具 -->
    <div style="position: absolute;top: 300px;left:5px;z-index: 10010;" v-show="zoomControlShow">
      <el-button-group>
        <el-button type="primary" @click="zoomIn">+</el-button>
        <el-button type="primary" @click="zoomOut">-</el-button>
      </el-button-group>
    </div>
  </div>    
</template>

<script>
export default {
  name: 'top',
  data () {
    return {
      activeIndex: '1',
      appbarShow: false,
      leftTop: {horizontal: 'left', vertical: 'top'},
      drawOpen: false,
      docked: true,
      pointsId: [],
      drawPolygonShow: false,
      handler: null,
      editPolygonShow: false,
      zoomControlShow: false
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath);
    },
    takeBack () {
      this.appbarShow = !this.appbarShow;
      if (this.appbarShow) {
        viewer.scene.debugShowFramesPerSecond = false;
      }else {
        viewer.scene.debugShowFramesPerSecond = true;
      }
    },
    toggle (flag) {
      this.drawOpen = !this.drawOpen
      this.docked = !flag
    },
    drawPolygon() {
      this.drawPolygonShow = true;
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      let gon = undefined;

      let points = [];

      // 对鼠标按下事件的监听
      this.handler.setInputAction((event) => {
        let windowPosition = event.position;
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);

        if (!cartesian) {
          return;
        }

        let point = viewer.entities.add({
          name: 'gon_point',
          position: cartesian,
          point: {
            color: Cesium.Color.WHITE,
            pixelSize: 5,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 1
          }
        });

        this.pointsId.push(point.id);

        points.push(cartesian);

        if (points.length >= 3) {
          if (gon === undefined) {
            gon = viewer.entities.add({
              name: 'polygon',
              polygon: {
                hierarchy: new Cesium.CallbackProperty(() => {
                  return points;
                }, false),
                material: Cesium.Color.RED.withAlpha(0.5)
              }
            });
          } else {
            gon.polygon.hierarchy = new Cesium.CallbackProperty(() => {
              return points;
            }, false);
          }
        } 
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    endPlot() {
      this.drawPolygonShow = false;

      if (this.handler !== null && !this.handler.isDestroyed()) {
        this.handler.destroy();
      }

      for (let id of this.pointsId) {
        viewer.entities.removeById(id);
      }

      this.pointsId = [];
    },
    editPolygon() {
      let gon = undefined;
      let isEditting = false;
      let currentPoint = undefined;

      this.editPolygonShow = true;
      this.handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      this.pointsId = [];

      // 对鼠标按下事件的监听
      this.handler.setInputAction((event) => {
        let windowPosition = event.position;
        let pickedObject = viewer.scene.pick(windowPosition);

        if (Cesium.defined(pickedObject)) {
          let entity = pickedObject.id;

          if (entity.name === "polygon" && !isEditting) {
            gon = entity;

            // 生成编辑点
            for (let cartesian of gon.polygon.hierarchy.getValue()) {
              let point = viewer.entities.add({
                name: "gon_point",
                position: cartesian,
                point: {
                  color: Cesium.Color.WHITE,
                  pixelSize: 8,
                  outlineColor: Cesium.Color.BLACK,
                  outlineWidth: 1
                }
              });

              this.pointsId.push(point.id);
            }

            isEditting = true;

            viewer.scene.screenSpaceCameraController.enableRotate = false;
            viewer.scene.screenSpaceCameraController.enableZoom = false;
          } else if (entity.name === "gon_point") {
            currentPoint = entity;
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      // 对鼠标移动事件的监听
      this.handler.setInputAction((event) => {
        if (isEditting && currentPoint) {
          let windowPosition = event.startPosition;
          let ellipsoid = viewer.scene.globe.ellipsoid;
          let cartesian = viewer.camera.pickEllipsoid(windowPosition, ellipsoid);
          let points = [];

          if (!cartesian) {
            return;
          }

          currentPoint.position = cartesian;

          for (let id of this.pointsId) {
            points.push(viewer.entities.getById(id).position._value);
          }

          gon.polygon.hierarchy = new Cesium.CallbackProperty(() => {
            return points;
          }, false);

          // gon.polygon.hierarchy = new Cesium.CallbackProperty(() => {
          //     return Cesium.Cartesian3.fromDegreesArray(points);
          // }, false);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // 对鼠标抬起事件的监听
      this.handler.setInputAction((event) => {
        // isEditting = false;
        currentPoint = undefined;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
    },
    endEditPolygon() {
      this.editPolygonShow = false;

      viewer.scene.screenSpaceCameraController.enableRotate = true;
      viewer.scene.screenSpaceCameraController.enableZoom = true;

      if (this.handler !== null && !this.handler.isDestroyed()) {
        this.handler.destroy();
      }

      for (let id of this.pointsId) {
        viewer.entities.removeById(id);
      }

      this.pointsId = [];
    },
    showZoomControl() {
      this.zoomControlShow = true;
    },
    zoomIn() {
      let cameraPos = viewer.camera.position;
      let ellipsoid = viewer.scene.globe.ellipsoid;
      let cartographic = ellipsoid.cartesianToCartographic(cameraPos);
      let height = cartographic.height;

      // viewer.camera.zoomIn(height / 3);

      let centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
      let centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height / 1.8),
        duration: 1.0
      });
    },
    zoomOut() {
      let cameraPos = viewer.camera.position;
      let ellipsoid = viewer.scene.globe.ellipsoid;
      let cartographic = ellipsoid.cartesianToCartographic(cameraPos);
      let height = cartographic.height;

      // viewer.camera.zoomOut(height * 1.2);

      let centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
      let centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height * 1.8),
        duration: 1.0
      });
    }
  },
  mounted() { 
      
  }
}
</script>

<style lang='less' scoped>
  .top {
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: align-self;
  }

  .left {
    position: absolute;
    top: 10%;
    height: 10%;
    width: 50px;
  }

  .appbar-search-field{
    color: #FFF;
    margin-bottom: 0;
    &.focus-state {
      color: #FFF;
    }
    .mu-text-field-hint {
      color: fade(#FFF, 54%);
    }
    .mu-text-field-input {
      color: #FFF;
    }
    .mu-text-field-focus-line {
      background-color: #FFF;
    }
  }
</style>