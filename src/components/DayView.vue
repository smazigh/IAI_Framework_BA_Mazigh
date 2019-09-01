<template>
  <div>
    <div class="card darken-1">
      <div class="card-action">
        <router-link to="/" class="btn-floating left">
          <i class="material-icons left waves-effect waves-light">home</i>
        </router-link>
        <router-link
          class="btn center waves-effect waves-light lighten-2"
          v-bind:class="{disabled: getPreviousDay()}"
          :to="{ name: 'DayViewWithID', params: { dayToShow: currentDataIndex - 1 }}"
        >
          <i class="material-icons">chevron_left</i>
        </router-link>

        <vc-date-picker :popover="{ placement: 'bottom', visibility: 'click' }">
          <a class="btn blue waves-effect waves-light">
            <i class="material-icons left">date_range</i>
            {{structuredDays[currentDataIndex].dayContent.year + "/" + (structuredDays[currentDataIndex].dayContent.month + 1) + "/" + structuredDays[currentDataIndex].dayContent.day}}
          </a>

          <div slot="day-content" slot-scope="{day}">
            <div>
              <div v-if="checkIfDateInRange(day)">
                <router-link class="btn-small btn-floating teal waves-effect waves-light"
                  :to="{ name: 'DayViewWithID', params: { dayToShow: getIndexFromDate(day) }}"
                >{{day.day}}
                </router-link>
              </div>

              <div v-if="!checkIfDateInRange(day)">
                <span class="waves-effect disabled">{{day.day}}</span>
              </div>
            </div>
          </div>
        </vc-date-picker>

        <router-link
          v-bind:class="{disabled: getNextDay()}"
          class="btn center waves-effect waves-light lighten-2"
          :to="{ name: 'DayViewWithID', params: { dayToShow: currentDataIndex + 1 }}"
        >
          <i class="material-icons">chevron_right</i>
        </router-link>
      </div>
    </div>

    <div class="row">
      <div class="col s12 m12 l12">
        <FirstCharts
          v-bind:array1="$store.getters.getHourlyUsage[currentDataIndex]"
          type="AreaChart"
          title="Usage per Hour"
          titleChart="Seifoun ta7foun"
          tileSize="day"
        />
      </div>
    </div>
    <div class="row">
      <div class="col s12 m6 l6">
        <FirstCharts
          v-bind:array1="$store.getters.getPercenHourData[currentDataIndex]"
          type="ColumnChart"
          title="Pourcentages per Hour"
          titleChart="Seifoun ta7foun"
          tileSize="day"
        />
      </div>
      <div class="col s12 m6 l6">
        <FirstCharts
          v-bind:array1="$store.getters.getGaugeUsageData[currentDataIndex]"
          type="PieChart"
          title="Resource Load"
          titleChart="Seifoun ta7foun"
          tileSize="day"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import FirstCharts from "./FirstCharts";
import VCalendar from "v-calendar";

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: "vc"
});

export default {
  name: "DayView",
  components: {
    FirstCharts,
    VCalendar
  },
  props: {
    dayToShow: undefined,
    helloProp: Boolean
  },
  data() {
    return {
      currentDataIndex: 0,
      testPass: undefined,
      structuredDays: this.$store.getters.getStructuredData,
      idArray: [],
      powerArray: [],
      final: [],
      dataForGaugeAndPieChart: [],
      hourlyPercentagePerResource: [],
      finalPercentage: []
    };
  },
  methods: {
    checkIfDateInRange: function(day) {

var dataRangeLength = this.structuredDays.length - 1;

var startRange = new Date(this.structuredDays[0].dayContent.year, this.structuredDays[0].dayContent.month, this.structuredDays[0].dayContent.day);
var endRange = new Date(this.structuredDays[dataRangeLength].dayContent.year, this.structuredDays[dataRangeLength].dayContent.month, this.structuredDays[dataRangeLength].dayContent.day);

var currentDay = new Date(day.year,day.month - 1,day.day);
return ((currentDay <= endRange) && (currentDay >= startRange));



},
getIndexFromDate(day) {
  
var dateToLookFor = new Date(day.year, day.month-1, day.day);


  var i = 0;
  var found = false;

  while ((i < this.structuredDays.length) && (!found)) {
    var selectedDay = new Date(
          this.structuredDays[i].dayContent.year,
          this.structuredDays[i].dayContent.month,
          this.structuredDays[i].dayContent.day
        );
        if (selectedDay.getTime() == dateToLookFor.getTime()) {
          found = true;
          return i;
        }
        i++;
  }

  if (!found) {
    console.log("Date Not found in the api");
    return null;
    
  }
},
    getNextDay() {
      if (this.currentDataIndex + 1 < this.structuredDays.length) return false;
      return true;
    },
    getPreviousDay() {
      console.log(this.currentDataIndex - 1 < 0);

      if (this.currentDataIndex - 1 < 0) return true;
      return false;
    },
    formatDayData(index) {
      var x = index;

      var sumPowerArray = [];
      var sumPowerPerHour = [];
      var totalPowerPerDay = 0;
      var gaugeArrayDaily = [];

      for (
        var i = 0;
        i < this.structuredDays[x].dayContent.resourcePlan.length;
        i++
      ) {
        this.idArray.push(
          this.structuredDays[x].dayContent.resourcePlan[i].resourceID
        );
        this.powerArray.push(
          this.structuredDays[x].dayContent.resourcePlan[i].powerGeneration
        );
      }
      var initial = ["Hour"];
      for (var k = 0; k < this.idArray.length; k++) {
        initial.push("#" + this.idArray[k]);
      }
      this.final.push(initial);
      for (var j = 0; j < 24; j++) {
        var current = [
          new Date(
            this.structuredDays[x].dayContent.year,
            this.structuredDays[x].dayContent.month,
            this.structuredDays[x].dayContent.day,
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

      this.dataForGaugeAndPieChart.push(["Label", "Value"]);

      for (var i = 0; i < this.idArray.length; i++) {
        this.dataForGaugeAndPieChart.push([
          "Source " + this.idArray[i],
          gaugeArrayDaily[i]
        ]);
      }

      console.log(sumPowerPerHour);
      console.log(this.powerArray);

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
        var current = [
          new Date(
            this.structuredDays[x].dayContent.year,
            this.structuredDays[x].dayContent.month,
            this.structuredDays[x].dayContent.day,
            j,
            0,
            0
          )
        ];
        for (var i = 0; i < this.idArray.length; i++) {
          current.push(this.hourlyPercentagePerResource[i][j]);
        }
        this.finalPercentage.push(current);
      }
    },
    getWholePercent: function(percentFor, percentOf) {
      return Math.round((percentFor / percentOf) * 100);
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
    displayDate: function(date) {
      return date.getMonth() + "/" + date.getDate();
    },
    getDayIndex: function(selector) {
      var dateToLookFor = new Date(selector[0], selector[1], selector[2]);
      console.log(dateToLookFor);
      var i = 0;
      while (
        new Date(
          this.structuredDays[i].dayContent.year,
          this.structuredDays[i].dayContent.month,
          this.structuredDays[i].dayContent.day
        ).getTime() != dateToLookFor.getTime() &&
        i < this.structuredDays.length
      ) {
        i++;
        console.log(i);
      }
      console.log(i);
      return i;
    }
  },
  created() {
    var index = 0;
    if (this.helloProp) {
      this.currentDataIndexComp = this.$route.params.dayToShow;
    } else {
      this.currentDataIndexComp = 0;
    }
    if (this.currentDataIndex == 0) {
      this.formatDayData(0);
    } else {
      this.formatDayData(this.currentDataIndex);
    }
    console.log(this.getNextDay());
  },
  computed: {
    currentDataIndexComp: {
      get: function() {
        return this.currentDataIndex;
      },
      set: function(value) {
        this.currentDataIndex = value;
      }
    }
  }
};
</script>

<style scoped>
</style>