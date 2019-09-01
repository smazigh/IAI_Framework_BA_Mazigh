<template>
  <div>
    <div v-show="tileSize == 'day'" class="card darken-1">
      <div class="card-content black-text">
        <span class="card-title align-center">{{ title }}</span>
        <GChart
          v-bind:class="{ container: isGauge() }"
          v-if="renderComponent"
          :type="chartType"
          :data="chartData"
          :options="chartOptions"
          :settings="{ packages: ['corechart', 'gauge', 'timeline'] }"
        />
      </div>
      <div class="card-action">
        <a
          class="waves-effect waves-light btn-small "
          v-on:click="setLines"
          v-bind:class="{ red: isLines() }"
          ><i class="material-icons left">timeline</i>Lines</a
        >
        <a
          class="waves-effect waves-light btn-small "
          v-on:click="setColumns"
          v-bind:class="{ red: isColumns() }"
          ><i class="material-icons left">assessment</i>Column</a
        >
        <a
          class="waves-effect waves-light btn-small "
          v-on:click="setStacked"
          v-bind:class="{ red: chartOptions.isStacked }"
          ><i class="material-icons left">view_column</i>Stacked</a
        >
      </div>
    </div>

    <GChart
      v-show="tileSize == 'month'"
      v-bind:class="{ container: isGauge() }"
      v-if="renderComponent"
      :type="chartType"
      :data="chartData"
      :options="chartOptions"
      :settings="{ packages: ['corechart', 'gauge', 'timeline'] }"
    />
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";

export default {
  name: "FirstCharts",
  components: {
    GChart
  },
  props: {
    array1: Array,
    array2: Array,
    isStack: Boolean,
    type: String,
    titleChart: String,
    title: undefined,
    tileSize: String
  },
  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      containerClass: "container",
      chartType: this.type,
      chartData: this.array1,
      chartOptions: {
        isStacked: false,
        title: this.title,
        animation: {
          duration: 1500,
          startup: true,
          easing: "inAndOut"
        },

        redFrom: 90,
        redTo: 100,
        yellowFrom: 60,
        yellowTo: 90,
        greenFrom: 20,
        greenTo: 60
      },
      renderComponent: true
    };
  },
  methods: {
    isColumns() {
      return this.chartType === "ColumnChart";
    },
    isLines() {
      return this.chartType === "AreaChart";
    },

    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },

    setStacked: function() {
      if (this.chartOptions.isStacked) {
        this.chartOptions.isStacked = false;
        this.forceRerender();
      } else {
        this.chartOptions.isStacked = true;
        this.forceRerender();
      }
    },
    setLines: function() {
      this.chartType = "AreaChart";
      this.forceRerender();
    },
    setColumns: function() {
      this.chartType = "ColumnChart";
      this.forceRerender();
    },
    isGauge: function() {
      return this.chartType === "Gauge";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

.card-image {
  height: 400px;
  overflow: hidden;
}
</style>
