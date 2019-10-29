<template>
  <div>
    <div class="card darken-1">
      <div class=" container navbar">
        <router-link to="/" class="btn-floating left waves-effect waves-light">
          <i class="material-icons left">home</i>
        </router-link>
         <paper-dropdown-menu label="Time period" class=" right ">
                  <paper-listbox class="" slot="dropdown-content" selected="1">
                    <paper-item><router-link to="/Daily">Day</router-link></paper-item>
                    <paper-item><router-link to="/Month">Month</router-link></paper-item>
                  </paper-listbox>
                </paper-dropdown-menu>
      </div>
    </div>
    <div class="row">
      <div class="col s12 m12 l12">
        <vc-calendar
          class="container"
          :attributes="attributes"
          :from-date="new Date(2019, 10, 1)"
          transition="fade"
          navVisibility="hover"
          is-expanded
        >
          <div slot="day-content" slot-scope="{ day }">
            <div>
              <div v-if="checkIfDateInRange(day)">
                <span class="btn-floating green">{{ day.day }}</span>
                <router-link
                  :to="{
                    name: 'DayViewWithID',
                    params: { dayToShow: getIndexFromDate(day) }
                  }"
                  ><Chart
                    tileSize="month"
                    v-bind:array1="
                      $store.getters.getColDayPercUsageData[
                        getIndexFromDate(day)
                      ]
                    "
                    type="ColumnChart"
                    titleChart=""
                /></router-link>
              </div>

              <div v-if="!checkIfDateInRange(day)">
                <span class="btn-floating black disabled">{{ day.day }}</span>
              </div>
            </div>
          </div>
        </vc-calendar>
      </div>
    </div>

    <!--  
    <FirstCharts
      v-bind:array1="getHourlyUsageForColorLines(0)"
      type="ColumnChart"
      title="TestForMonths"
      titleChart="Seifoun ta7foun"
    />
    -->
  </div>
</template>

<script>
import Vue from "vue";
import Chart from "./FirstCharts";
import VCalendar from "v-calendar";

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: "vc"
});

export default {
  name: "MonthViewComponent",
  components: {
    Chart
  },
  props: {
    mainApiData: undefined,
    array2: Array,
    isStack: Boolean,
    type: String,
    titleChart: String,
    title: String
  },
  data() {
    return {
      structuredDays: this.$store.getters.getStructuredData,

      apiData: this.mainApiData,
      attributes: [
        {
 
        }
      ]
    };
  },
  mounted() {},
  methods: {
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
  margin-top: 60px;
  background-image: "./assets/background.jpg";
}
</style>
