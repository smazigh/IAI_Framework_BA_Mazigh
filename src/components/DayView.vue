<template >
  <div>
    <div class="card  darken-5">
      <div class="row card-action flex">
        <div class="col l4 m4 s4">
        <router-link to="/" class="btn-floating left valign-center">
          <i class="material-icons left waves-effect waves-light " >home</i>
        </router-link>
        </div>
        <div class="col l4 m4 s8">
        <router-link
          class="btn waves-effect waves-light lighten-2 center"
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
          <a class="btn blue waves-effect waves-light center  ">
            <i class="material-icons left">date_range</i><span class="hide-on-small-only">
            {{
              structuredDays[currentDataIndex].dayContent.year +
                "/" +
                (structuredDays[currentDataIndex].dayContent.month + 1) +
                "/" +
                structuredDays[currentDataIndex].dayContent.day
            }}</span>
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
          class="btn center waves-effect waves-light lighten-2 "
          :to="{
            name: 'DayViewWithID',
            params: { dayToShow: currentDataIndex + 1 }
          }"
        >
          <i class="material-icons">chevron_right</i>
        </router-link>
        </div>  
        <div class="col l4 m4 s12">
         <paper-dropdown-menu label="Time period" class=" right ">
                  <paper-listbox class="" slot="dropdown-content" selected="0">
                    <paper-item><router-link to="/Daily"><span>Day</span></router-link></paper-item>
                    <paper-item><router-link to="/Month"><span>Month</span></router-link></paper-item>
                  </paper-listbox>
                </paper-dropdown-menu>


</div>
 

                
        
      </div>
      
    </div>
<!-- For Demo purposes -->
<!-- First View in the daily-layout -->
    <div class="row">
      <div class="col s12 m12 l12">
        <Chart
          v-bind:array1="$store.getters.getHourlyUsage[currentDataIndex]"
          type="AreaChart"
          title="Usage per Hour"
          tileSize="day"
          v-bind:animation="true"
          titleChart="KWh "
        
          v-bind:showLoad="false"
          
        
        />
        <!-- colors config   v-bind:colors="['red','blue','gold','green']" -->
      </div>
    </div>

    <!-- Second View in the daily-layout -->
    <div class="row">
      <div class="col s12 m6 l6">
        <Chart
          v-bind:array1="$store.getters.getPercenHourData[currentDataIndex]"
          type="ColumnChart"
          title="Percentages per Hour"
         titleChart="%"
          tileSize="day"
          
        />
      </div>
      <!-- Third View in the daily-layout -->
      <div class="col s12 m6 l6">
        <Chart
          v-bind:array1="$store.getters.getGaugeUsageData[currentDataIndex]"
          type="PieChart"
          title="Resources Usage"
          tileSize="day"
            titleChart="Power distribution  "
         
        />
      
      </div>
      <!-- Extra two charts to cofigure -->
  <!--
      <div class="col s12 m6 l4">
        <Chart
          v-bind:array1="$store.getters.getColDayPercUsageData[currentDataIndex]"
          type="Gauge"
          title="Resource Load"
          tileSize="month"
         
        />
         <Chart
          v-bind:array1="$store.getters.getGaugeUsageData[currentDataIndex]"
          type="LineChart"
          title="Resource Load"
          tileSize="month"
         
        />
      </div>
      -->
      
    </div>
   
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
  name: "DayView",
  components: {
    Chart
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

<style scoped>
.adjust{
 display: inline-block;
  width: 150px;
  height: 70px;
  padding: 0px;
}

.flex {
  display: flex;
  flex-wrap: wrap;
}
</style>
