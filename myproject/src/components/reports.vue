<template>
  <div id="mapbox" style="width:100%;height:400px"></div>
</template>

<script>
import Echarts from "echarts";
export default {
  mounted() {
    var echarts = Echarts.init(document.getElementById("mapbox"));
    this.$http({
      url: "http://localhost:8888/api/private/v1/reports/type/1",
      method: "get"
    }).then(res => {
        res.data.data.xAxis[0].boundaryGap=false
        res.data.data.grid= {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    }
      var options = res.data.data;
      echarts.setOption(options);
    });
  }
};
</script>

<style>
</style>
