<template>
  <div id="mapbox" style="width:100%;height:100%"></div>
</template>

<script>
import BMap from "BMap";
export default {
  mounted() {
    // 创建地图实例
    var map = new BMap.Map("mapbox");
    // 设置中心点
    var point = new BMap.Point(116.404, 39.915);
    // 初始化地图
    map.centerAndZoom(point, 15);

    map.centerAndZoom(new BMap.Point(116.404, 39.915), 14);
    var riding = new BMap.RidingRoute(map, {
      renderOptions: { map: map }
    });
    var start = new BMap.Point(116.310791, 40.003419);
    var end = new BMap.Point(116.486419, 39.877282);
    riding.search(start, end);

    // var map = new BMap.Map("allmap");
    // var point = new BMap.Point(116.331398, 39.897445);
    // map.centerAndZoom(point, 12);

    // var geolocation = new BMap.Geolocation();
    // // 开启SDK辅助定位
    // geolocation.enableSDKLocation();
    // geolocation.getCurrentPosition(function (r) {
    //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
    //         var mk = new BMap.Marker(r.point);
    //         map.addOverlay(mk);
    //         map.panTo(r.point);
    //         alert('您的位置：' + r.point.lng + ',' + r.point.lat);
    //     }
    //     else {
    //         alert('failed' + this.getStatus());
    //     }
    // });

    var styleOptions = {
        strokeColor: "red",    //边线颜色。
        fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    //实例化鼠标绘制工具
    var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: true, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
        },
        circleOptions: styleOptions, //圆的样式
        polylineOptions: styleOptions, //线的样式
        polygonOptions: styleOptions, //多边形的样式
        rectangleOptions: styleOptions //矩形的样式
    });
  }
};
</script>

<style>
</style>
