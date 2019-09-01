<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
    <!--
   <div class="row">
     <div class="col s12 m4 l12">
      <div class="card grey darken-1">
        <div class="card-content white-text">
          <span class="card-title">Hourly Percentages</span>
         <div>
          <FirstCharts v-if="renderComponent" v-bind:array1="finalPercentage" v-bind:isStack="isStackk" type="ColumnChart"/>
        </div>
        </div>
        <div class="card-action">
          <a v-on:click="setStacked" class="waves-effect waves-ligh btn">Stacked</a>
        </div>
      </div>
    </div>  
  </div>
  

<div class="row">
  <div class="col s12 m12 l12">
     <FirstCharts  v-bind:array1="final" type="AreaChart" title="Pourcentages" titleChart="Seifoun ta7foun"/>
    </div>
</div>
<div class="row">
    <div class="col s6 m6 l6">
     <FirstCharts  v-bind:array1="finalPercentage" type="ColumnChart" title="Pourcentages" titleChart="Seifoun ta7foun"/>
    </div>
    <div class="col s6 m6 l6">
     <FirstCharts  v-bind:array1="finalGauge" type="Gauge" title="Load" titleChart="Seifoun ta7foun"/>
    </div>
  </div>
  
// test change
<div class="row">
  <Weekly v-bind:array1="final"/>
 
<vc-calendar class="container"
  >
  <div slot="day-content" slot-scope="{day, attributes,attributesMap}">
    <h7>{{day.day}}</h7>
    <FirstCharts  v-bind:array1="final" type="ColumnChart" title="Pourcentages" titleChart="Seifoun ta7foun"/>
  </div>
  </vc-calendar> 
    
    <div class="row">
      <div class="col s12 m12 l12">
        <vc-calendar class="container" :attributes="attributes" :from-date="new Date(2019, 7, 1)">
          <div slot="day-content" slot-scope="{day}">
            <h7 v-if="checkIfDateInRange(day)">{{day.day}}</h7>
            <FirstCharts
              v-if="checkIfDateInRange(day)"
              v-bind:array1="finalGauge"
              type="ColumnChart"
              title="Pourcentages"
              titleChart="Seifoun ta7foun"
            />
            <div v-if="!checkIfDateInRange(day)" style="height: 100px;">
              <h7>{{day.day}}</h7>
            </div>
          </div>
        </vc-calendar>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import Vue from "vue";
import FirstCharts from "./components/FirstCharts.vue";
import Weekly from "./components/Weekly.vue";
import VCalendar from "v-calendar";
import { mapGetters, mapActions, mapState } from "vuex";
import DayView from "./components/DayView.vue";
import Month from "./components/MonthViewComponent";

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: "vc"
});

export default {
  name: "app",
  components: {
    FirstCharts,
    Weekly,
    VCalendar,
    DayView
  },
  data() {
    return {
      storeData: this.$store.getters.getStructuredData,
      apiData: undefined,
      idArray: undefined,
      powerArray: undefined,
      final: [],
      isStackk: true,
      renderComponent: true,
      finalGauge: [],
      hourlyPercentagePerResource: [],
      finalPercentage: [],
      attributes: [
        {
          key: new Date(2016, 6, 1),
          dates: [
            { start: new Date(2019, 7, 1), end: new Date(2019, 9, 1) } // # of days
          ]
        }
      ]
    };
  },
  mounted() {
    this.loadApi();
  },
  methods: {
    ...mapActions(["fetchApiData"]),
    ...mapActions(["formatDataR"]),

    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },

    setStacked: function() {
      if (this.isStackk) {
        this.isStackk = false;
      } else {
        this.isStackk = true;
      }
      this.forceRerender();
    },
    loadApi: function() {
      this.$http
        .get("https://api.myjson.com/bins/ahcg3")
        .then(this.successCallback, this.errorCallback);
      //https://api.myjson.com/bins/6bb7n
      // One day https://api.myjson.com/bins/1gkfcj
    },
    successCallback: function(response) {
      this.apiData = response.data;
      this.idArray = new Array();
      this.powerArray = new Array();
      // for (var i = 0; i < this.apiData.resourcePlan.length; i++) {
      // this.idArray.push(response.data.resourcePlan[i].resourceID);
      // this.powerArray.push(this.apiData.resourcePlan[i].powerGeneration);
      // }
      this.formatData();
      this.formatPercentages();
    },
    errorCallback: function(response) {
      //this.apiData = response.data;
    },
    formatData: function() {
      for (var i = 0; i < this.apiData.data[0].resourcePlan.length; i++) {
        this.idArray.push(this.apiData.data[0].resourcePlan[i].resourceID);
        this.powerArray.push(
          this.apiData.data[0].resourcePlan[i].powerGeneration
        );
      }
      var Combined = new Array(this.powerArray.length + 1);
      var initial = ["Hour"];
      for (var k = 0; k < this.idArray.length; k++) {
        initial.push("#" + this.idArray[k]);
      }
      this.final.push(initial);
      for (var j = 0; j < 24; j++) {
        var current = [
          new Date(
            this.apiData.data[0].year,
            this.apiData.data[0].month,
            this.apiData.data[0].day,
            j,
            0,
            0
          )
        ];
        for (var i = 0; i < this.idArray.length; i++) {
          current.push(this.powerArray[i][j]);
        }
        this.final.push(current);
      }
    },
    formatPercentages: function() {
      var sumPowerArray = [];
      var sumPowerPerHour = [];
      var totalPowerPerDay = 0;
      var gaugeArrayDaily = [];
      for (let i = 0; i < this.powerArray.length; i++) {
        var currentDay = 0;
        for (let j = 0; j < 24; j++) {
          currentDay += this.powerArray[i][j];
        }
        sumPowerArray.push(currentDay);
      }
      for (let i = 0; i < 24; i++) {
        var hourlyUsage = 0;
        for (let j = 0; j < this.powerArray.length; j++) {
          hourlyUsage += this.powerArray[j][i];
        }
        sumPowerPerHour.push(hourlyUsage);
      }
      for (let i = 0; i < sumPowerArray.length; i++) {
        totalPowerPerDay += sumPowerArray[i];
      }
      for (let i = 0; i < sumPowerArray.length; i++) {
        gaugeArrayDaily.push(
          this.getWholePercent(sumPowerArray[i], totalPowerPerDay)
        );
      }

      this.finalGauge.push(["Label", "Value"]);
      this.finalGauge.push(["Source 1", gaugeArrayDaily[0]]);
      this.finalGauge.push(["Source 2", gaugeArrayDaily[1]]);
      this.finalGauge.push(["Source 3", gaugeArrayDaily[2]]);

      // console.log(sumPowerPerHour);
      //console.log(this.powerArray);

      for (let i = 0; i < this.powerArray.length; i++) {
        var currentResource = [];
        for (let j = 0; j < 24; j++)
          currentResource.push(
            this.getWholePercent(this.powerArray[i][j], sumPowerPerHour[j])
          );
        this.hourlyPercentagePerResource.push(currentResource);
      }

      var initial = ["Hour"];
      for (var k = 0; k < this.idArray.length; k++) {
        initial.push("#" + this.idArray[k]);
      }
      this.finalPercentage.push(initial);
      for (var j = 0; j < 24; j++) {
        var current = [new Date(0, 0, 0, j, 0, 0)];
        for (var i = 0; i < this.idArray.length; i++) {
          current.push(this.hourlyPercentagePerResource[i][j]);
        }
        this.finalPercentage.push(current);
      }
    },
    getWholePercent: function(percentFor, percentOf) {
      return Math.round((percentFor / percentOf) * 100);
    },

    checkIfDateInRange: function(day) {
      var dataRangeLength = this.apiData.data.length - 1;
      console.log(this.apiData);

      var startRange = new Date(
        this.apiData.data[0].year,
        this.apiData.data[0].month,
        this.apiData.data[0].day
      );
      var endRange = new Date(
        this.apiData.data[dataRangeLength].year,
        this.apiData.data[dataRangeLength].month,
        this.apiData.data[dataRangeLength].day
      );

      var currentDay = new Date(day.year, day.month - 1, day.day);
      console.log(currentDay);
      console.log(currentDay < endRange && currentDay > startRange);
      return currentDay <= endRange && currentDay >= startRange;
    }
  },
  computed: {
    ...mapGetters(["getApiData"]),
    ...mapGetters(["getStructuredData"]),
    ...mapState(["dataStructured"])
  },
  created() {
    this.fetchApiData();
    var context = this;

    setTimeout(function() {
      context.formatDataR();
    }, 1500);
  },
  watch: {
    storeData(value) {
      console.log("change");

      this.storeData = value;
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  background-image: "./assets/background.jpg";
}
body {
}
</style>
