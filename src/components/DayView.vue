<template>
  <div>
    <div class="card darken-1">
      <div class="card-action">
        <router-link to="/" class="btn-floating left">
          <i class="material-icons left waves-effect waves-light">home</i>
        </router-link>
        <router-link
          class="btn center waves-effect waves-light lighten-2"
          v-bind:class="{ disabled: getPreviousDay() }"
          :to="{
            name: 'DayViewWithID',
            params: { dayToShow: currentDataIndex - 1 }
          }"
        >
          <i class="material-icons">chevron_left</i>
        </router-link>

        <vc-date-picker
          :popover="{ placement: 'bottom', visibility: 'click' }"
          :value="getStartDate()"
        >
          <a class="btn blue waves-effect waves-light">
            <i class="material-icons left">date_range</i>
            {{
              structuredDays[currentDataIndex].dayContent.year +
                "/" +
                (structuredDays[currentDataIndex].dayContent.month + 1) +
                "/" +
                structuredDays[currentDataIndex].dayContent.day
            }}
          </a>

          <div slot="day-content" slot-scope="{ day }">
            <div>
              <div v-if="checkIfDateInRange(day)">
                <router-link
                  class="btn-small btn-floating teal waves-effect waves-light"
                  :to="{
                    name: 'DayViewWithID',
                    params: { dayToShow: getIndexFromDate(day) }
                  }"
                  >{{ day.day }}
                </router-link>
              </div>

              <div v-if="!checkIfDateInRange(day)">
                <span class="waves-effect disabled">{{ day.day }}</span>
              </div>
            </div>
          </div>
        </vc-date-picker>

        <router-link
          v-bind:class="{ disabled: getNextDay() }"
          class="btn center waves-effect waves-light lighten-2"
          :to="{
            name: 'DayViewWithID',
            params: { dayToShow: currentDataIndex + 1 }
          }"
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
    FirstCharts
  },
  props: {
    dayToShow: undefined,
    fromRoute: Boolean
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
    getStartDate() {
      return new Date(
        this.structuredDays[0].dayContent.year,
        this.structuredDays[0].dayContent.month,
        this.structuredDays[0].dayContent.day
      );
    },
    checkIfDateInRange: function(day) {
      var dataRangeLength = this.structuredDays.length - 1;

      var startRange = new Date(
        this.structuredDays[0].dayContent.year,
        this.structuredDays[0].dayContent.month,
        this.structuredDays[0].dayContent.day
      );
      var endRange = new Date(
        this.structuredDays[dataRangeLength].dayContent.year,
        this.structuredDays[dataRangeLength].dayContent.month,
        this.structuredDays[dataRangeLength].dayContent.day
      );

      var currentDay = new Date(day.year, day.month - 1, day.day);
      return currentDay <= endRange && currentDay >= startRange;
    },
    getIndexFromDate(day) {
      var dateToLookFor = new Date(day.year, day.month - 1, day.day);

      var i = 0;
      var found = false;

      while (i < this.structuredDays.length && !found) {
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
        return null;
      }
    },
    getNextDay() {
      if (this.currentDataIndex + 1 < this.structuredDays.length) return false;
      return true;
    },
    getPreviousDay() {
      if (this.currentDataIndex - 1 < 0) return true;
      return false;
    }
  },
  created() {
    if (this.fromRoute) {
      this.currentDataIndexComp = this.$route.params.dayToShow;
    } else {
      this.currentDataIndexComp = 0;
    }
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

<style scoped></style>
