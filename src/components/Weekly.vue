<template>
  <div>
 

    <div class="row-cover">
      <div class="row-wrap">
        <div class="row centered">
          <div class="center col s1 offset-s2">
            <div class="card darken-1">
              <div class="card-content black-text">
                   <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
                    <GChart type="LineChart" :data="chartData" :options="chartOptions" />
              </div>
            </div>
          </div>
          <div class="center col s1" v-for="item in items">
            <div class="card darken-1">
              <div class="card-content black-text">
                  <h5>{{displayDate(item)}}</h5>
                <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
                 <GChart type="LineChart" :data="chartData" :options="chartOptions" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    </div>

</template>

<script>
import { GChart } from "vue-google-charts";

export default {
  name: "Weekly",
  components: {
    GChart
  },
  props: {
    array1: Array,
    array2: Array,
    isStack: Boolean,
    type: String,
    titleChart: String,
    title: String
  },
  data() {
    return {
      // Array will be automatically processed with visualization.arrayToDataTable function
      items: [new Date(2019,8,22), new Date(2019,8,23), new Date(2019,8,24), new Date(2019,8,25), new Date(2019,8,26), new Date(2019,8,27)],
      containerClass: "container",
      chartType: this.type,
      chartData: this.array1,
      chartOptions: {
        isStacked: true,
        title: this.isStackk,
        animation: {
          duration: 1500,
          startup: true,
          easing: "inAndOut"
        },
        colors: ["pink", "green", "blue"],
        redFrom: 90,
        redTo: 100,
        yellowFrom: 60,
        yellowTo: 90,
        greenFrom: 20,
        greenTo: 60,
        trendlines: {},
        scaleType: "linear",
        curveType: "function"
      },
      renderComponent: true
    };
  },
  methods: {
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
      } else {
        this.chartOptions.isStacked = true;
      }
      this.forceRerender();
    },
    setLines: function() {
      this.chartType = "LineChart";
      this.forceRerender();
    },
    setColumns: function() {
      this.chartType = "ColumnChart";
      this.forceRerender();
    },
    isGauge: function() {
      return this.chartType === "Gauge";
    },
    displayDate: function (date) {
       return  date.getMonth() + "/" + date.getDate();
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
a {
  color: #42b983;
}

.row-cover {
  overflow: hidden;
}
.row-wrap {
  margin: 0 -8.33333%;
}
@media only screen and (max-width: 767px) {
  .row-wrap {
    margin: 0;
  }
}
.centered {
  margin-left: 5%;
}
</style>
