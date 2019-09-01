<template>
  <div>
  <div class="card darken-1">
      <div class="card-action">
        <router-link to="/" class="btn-floating left waves-effect waves-light">
          <i class="material-icons left">home</i>
        </router-link>
        </div>
    </div> 
 <div class="row">
   <div class="col s12 m12 l12">
  <vc-calendar  class="container" :attributes="attributes" :from-date="new Date(2019, 7, 1)" transition="fade" navVisibility="hover">
     
<div slot="day-content" slot-scope="{day}">
  <div >
    
    <div v-if="checkIfDateInRange(day)" >
      <span class="btn-floating green">{{day.day}}</span> 
  <router-link  :to="{ name: 'DayViewWithID', params: { dayToShow: getIndexFromDate(day) }}"><FirstCharts tileSize="month" v-bind:array1="$store.getters.getColDayPercUsageData[getIndexFromDate(day)]" type="ColumnChart" titleChart="Seifoun ta7foun"/></router-link>


    </div>
 
 <div v-if="!checkIfDateInRange(day)">
   <span class="btn-floating black disabled">{{day.day}}</span>
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
import Vue from 'vue'
import FirstCharts from "./FirstCharts"
import Weekly from './Weekly.vue'
import VCalendar from 'v-calendar';

// Use v-calendar & v-date-picker components
Vue.use(VCalendar, {
  componentPrefix: 'vc'
});

export default {
  name: 'MonthViewComponent',
  components: {
    FirstCharts, Weekly, VCalendar
  },
  props: {
    mainApiData: undefined,
    array2: Array,
    isStack: Boolean, 
    type : String,
    titleChart : String,
    title: String
  },
   data() {
    return {

      structuredDays : this.$store.getters.getStructuredData,

        apiData: this.mainApiData,
    attributes: [
      {
        key: new Date(2016,6,1),
       dates: [
    { start: new Date(2019, 7, 1), end: new Date(2019, 9, 1) },// # of days
  ]
      }
    ]
   

  }
},mounted() {

  

}, methods: {

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

// This method generates the Graphic data for comp usage 
// generated data can be used in Lines/Column charts 
// displays Hourly usage for all resources for a specific day
 getHourlyUsageForColorLines(day) {
   var index = this.getIndexFromDate(day);
   
   
    var readyDataForExport = []; 
    var idArray = [];
    var powerArray = [];
     for (
        var i = 0;
        i < this.structuredDays[index].dayContent.resourcePlan.length;
        i++
      ) {
        idArray.push(
          this.structuredDays[index].dayContent.resourcePlan[i].resourceID
        );
        powerArray.push(
          this.structuredDays[index].dayContent.resourcePlan[i].powerGeneration
        );
      }
      var initial = ["Hour"];
      for (var k = 0; k < idArray.length; k++) {
        initial.push("#" + idArray[k]);
      }
      readyDataForExport.push(initial);
      for (var j = 0; j < 24; j++) {
        var current = [
          new Date(
            this.structuredDays[index].dayContent.year,
            this.structuredDays[index].dayContent.month,
            this.structuredDays[index].dayContent.day,
            j,
            0,
            0
          )
        ];
        for (var i = 0; i < idArray.length; i++) {
          current.push(powerArray[i][j]);
        }
        readyDataForExport.push(current);
      }
      
      return readyDataForExport;

 },

      formatData: function() {

            
            for (var i = 0; i < this.apiData.data[0].resourcePlan.length; i++) {
          this.idArray.push(this.apiData.data[0].resourcePlan[i].resourceID);
           this.powerArray.push(this.apiData.data[0].resourcePlan[i].powerGeneration);
            }
            var Combined = new Array(this.powerArray.length + 1);
            var initial = ['Hour'];
            for (var k = 0; k < this.idArray.length; k++) {
              initial.push('#' + this.idArray[k]);
            }
              this.final.push(initial);
                  for (var j = 0; j < 24; j++){
                    var current = [new Date(this.apiData.data[0].year,this.apiData.data[0].month,this.apiData.data[0].day,j,0,0)];
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
      gaugeArrayDaily.push(this.getWholePercent(sumPowerArray[i],totalPowerPerDay));
          
        }
      
      this.finalGauge.push(["Label", "Value"]);
      this.finalGauge.push(["Source 1",gaugeArrayDaily[0]]);
      this.finalGauge.push(["Source 2",gaugeArrayDaily[1]]);
      this.finalGauge.push(["Source 3",gaugeArrayDaily[2]]);
      
    
        for (let i = 0; i < this.powerArray.length; i++) {
          var currentResource = [];
          for (let j = 0; j < 24; j++) 
            currentResource.push(this.getWholePercent(this.powerArray[i][j],sumPowerPerHour[j]));
          this.hourlyPercentagePerResource.push(currentResource);    
        }
    
           var initial = ['Hour'];
            for (var k = 0; k < this.idArray.length; k++) {
              initial.push('#' + this.idArray[k]);
            }
              this.finalPercentage.push(initial);
                  for (var j = 0; j < 24; j++){
                    var current = [new Date(0,0,0,j,0,0)];
                    for (var i = 0; i < this.idArray.length; i++) {
                      current.push(this.hourlyPercentagePerResource[i][j]);
                    }
                  this.finalPercentage.push(current);
                  }

      },
      getWholePercent: function(percentFor,percentOf)
{
    return Math.round(percentFor/percentOf*100);
},

checkIfDateInRange: function(day) {

var dataRangeLength = this.structuredDays.length - 1;

var startRange = new Date(this.structuredDays[0].dayContent.year, this.structuredDays[0].dayContent.month, this.structuredDays[0].dayContent.day);
var endRange = new Date(this.structuredDays[dataRangeLength].dayContent.year, this.structuredDays[dataRangeLength].dayContent.month, this.structuredDays[dataRangeLength].dayContent.day);

var currentDay = new Date(day.year,day.month - 1,day.day);
return ((currentDay <= endRange) && (currentDay >= startRange));



}
          

          
      },
     
     

}

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
