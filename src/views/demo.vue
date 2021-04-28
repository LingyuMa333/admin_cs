<template>
  <div>
    <input type="file" @change="imgChange" />
    <div id="chart"></div>
  </div>
</template>


<script>
import QRCode from "qrcode";
import { upload } from "@/utils/fetch";
import { Chart } from "@antv/g2";

export default {
  data() {
    return {
      count: 0,
      img: "",
      data: [
        { type: "未知", value: 654, percent: 0.02 },
        { type: "17 岁以下", value: 654, percent: 0.02 },
        { type: "18-24 岁", value: 4400, percent: 0.2 },
        { type: "25-29 岁", value: 5300, percent: 0.24 },
        { type: "30-39 岁", value: 6200, percent: 0.28 },
        { type: "40-49 岁", value: 3300, percent: 0.14 },
        { type: "50 岁以上", value: 1500, percent: 0.06 }
      ]
    };
  },

  mounted() {
    this.initChart();
  },

  methods: {
    initChart() {
      const chart = new Chart({
        container: "chart",
        autoFit: true,
        height: 300,
        padding: [50, 20, 50, 20]
      });
      chart.data(this.data);
      chart.scale("value", {
        alias: "销售额(万)"
      });

      chart.axis("type", {
        tickLine: {
          alignTick: false
        }
      });
      chart.axis("value", false);

      chart.tooltip({
        showMarkers: false
      });
      chart.interval().position("type*value");
      chart.interaction("element-active");

      // 添加文本标注
      this.data.forEach(item => {
        chart
          .annotation()
          .text({
            position: [item.type, item.value],
            content: item.value,
            style: {
              textAlign: "center"
            },
            offsetY: -30
          })
          .text({
            position: [item.type, item.value],
            content: (item.percent * 100).toFixed(0) + "%",
            style: {
              textAlign: "center"
            },
            offsetY: -12
          });
      });
      chart.render();
    },

    imgChange(e) {
      console.log(e);
      let file = e.target.files[0];
      let formdata = new FormData();
      formdata.append("file", e.target.files[0]);
      upload("/common/pictureUpload", formdata);
    },

    start() {
      if (this.count < 10) {
        console.log(this.count);
        this.count++;
        setTimeout(() => {
          this.start();
        }, 3e3);
      }
    },

    draw() {
      QRCode.toDataURL("www.bd.com")
        .then(res => {
          this.img = res;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style>
</style>