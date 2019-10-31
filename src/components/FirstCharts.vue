<template>
  <div>
    <div v-show="tileSize == 'day'" class="card darken-1">
      <div class="card-content black-text">
        <span class="card-title align-center">{{ this.title }}</span>
        <GChart
          v-bind:class="{ container: isGauge() }"
          v-if="renderComponent"
          :type="chartType"
          :data="chartData"
          :options="chartOptions"
          :settings="{ packages: ['corechart', 'gauge', 'timeline'] }"
            :events="chartEvents"
            ref="gChart"
        />
      </div>
      <div class="card-action">
        <a
          class="waves-effect waves-light btn-small "
          v-on:click="setLines"
          v-bind:class="{ red: isLines() }"
          ><i class="material-icons left">timeline</i><span class="hide-on-small-only">Lines</span></a
        >
        <a
          class="waves-effect waves-light btn-small "
          v-on:click="setColumns"
          v-bind:class="{ red: isColumns() }"
          ><i class="material-icons left">assessment</i><span class="hide-on-small-only">Column</span></a
        >
        <a
          class="waves-effect waves-light btn-small "
          v-on:click="setStacked"
          v-bind:class="{ red: chartOptions.isStacked }"
          ><i class="material-icons left">view_column</i><span class="hide-on-small-only">Stacked</span></a
        >

 
      <Resource :resourceID="resourceSelected" :timeP="timePeriod" v-if="showModal" @close="showModal = false">
    <!--
      you can use custom content here to overwrite
      default content 
    -->
  </Resource>
      </div>
    </div>

    <GChart
      v-show="tileSize == 'month'"
      v-bind:class="{ container: isGauge() }"
      v-if="renderComponent"
      :type="chartType"
      :data="chartData"
      :options="chartOptionsUpdate"
      :settings="{ packages: ['corechart', 'gauge', 'timeline'] }"
    />

  </div>
</template>

<script>
import { GChart } from "vue-google-charts";
import Resource from "./Resource";

export default {
  name: "Chart",
  components: {
    GChart,Resource
  },
  props: {
    array1: Array,
    isStack: Boolean,
    type: String,
    titleChart: String,
    title: String,
    tileSize: String,
    animation: {
      type:Boolean,
      default:true},
    animationType: String,
    colors: Array,
    showLoad : Boolean
    
   
  },
  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      showModal: false,
      resourceSelected : 0,
      timePeriod: 30,
      chartType: this.type,
      chartData: this.array1,
      chartOptions: {
        isStacked: false,
        title: this.titleChart,
        animation: {
          duration: 1500,
          startup: this.animation,
          easing: "inAndOut"
        },

        redFrom: 90,
        redTo: 100,
        yellowFrom: 60,
        yellowTo: 90,
        greenFrom: 20,
        greenTo: 60
      },
      renderComponent: true,
        chartEvents: {
       select: () => {          
          const table = this.$refs.gChart.chartObject;
          const selection = table.getSelection(); 
          this.selectedResource = selection[0].column - 1;
          this.showModal = true;
                   
          
        }
      }
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
    },
    adjustResource: function (value){
      this.selectedResource = value;
    }, 
    adjustTimePeriod: function(value) {
      this.selectedTimePeriod = value;
    }
  },
  computed: {
    selectedResource:{
      get: function() {
        return this.resourceSelected;
      },
      set: function(value) {
        this.resourceSelected = value;
      }
    },
    chartOptionsUpdate: {
      get: function() {
      if (this.colors != null)
        this.chartOptions.colors = this.colors;


//put the load in the #0 source 
        if (this.showLoad != null) {
          if (this.showLoad == true) 
            this.chartOptions.series = {0: {type: 'line'}};
        }

        return this.chartOptions;
      }
    },
    
        
      
    
  }
};
</script>


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
