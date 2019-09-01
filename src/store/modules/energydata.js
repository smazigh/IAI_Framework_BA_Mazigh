import axios from "axios";
import { stat } from "fs";

const state = {
  apiData: {},
  dataStructured: [],
  startRange: {},
  endRange: {},
  fullHourlyUsage: [],
  fullGaugeUsage: [],
  percHourUsageData: [],
  colDayPercUsageData: []
};
const getters = {
  getApiData: state => state.apiData,
  getStructuredData: state => state.dataStructured,
  getHourlyUsage: state => state.fullHourlyUsage,
  getGaugeUsageData: state => state.fullGaugeUsage,
  getPercenHourData: state => state.percHourUsageData,
  getColDayPercUsageData: state => state.colDayPercUsageData
};
const actions = {
  async fetchApiData({ commit }) {
    const response = await axios.get("https://api.myjson.com/bins/gwzev");
    //   https://api.myjson.com/bins/ahcg3
    commit("setApiData", response.data);
    var dataStructured = [];
    for (let index = 0; index < state.apiData.data.length; index++) {
      dataStructured.push({
        id: new Date(
          state.apiData.data[index].year,
          state.apiData.data[index].month,
          state.apiData.data[index].day
        ),
        dayContent: state.apiData.data[index]
      });
    }
    commit("setStructuredData", dataStructured);
  },
  formatDataR({ commit }) {
    var hourlyUsageData = [];
    var pourcentageDailyData = [];
    var gaugeUsageData = [];
    var colDailyUsageperSource = [];
    for (var index = 0; index < state.dataStructured.length; index++) {
      var readyDataForExport = [];
      var idArray = [];
      var powerArray = [];
      var sumPowerArray = [];
      var sumPowerPerHour = [];
      var totalPowerPerDay = 0;
      var gaugeArrayDaily = [];
      var dataForGaugeAndPieChart = [];
      var hourlyPercentagePerResource = [];
      var percentHourly = [];
      var colorfulDailyUsagePerSource = [];
      //Hourly Usage data preparation
      for (
        var i = 0;
        i < state.dataStructured[index].dayContent.resourcePlan.length;
        i++
      ) {
        idArray.push(
          state.dataStructured[index].dayContent.resourcePlan[i].resourceID
        );
        powerArray.push(
          state.dataStructured[index].dayContent.resourcePlan[i].powerGeneration
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
            state.dataStructured[index].dayContent.year,
            state.dataStructured[index].dayContent.month,
            state.dataStructured[index].dayContent.day,
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
      // hourlyUsageData contains formated data for graphical usage in columns, lines and area charts (per Day)
      hourlyUsageData.push(readyDataForExport);
      //Daily Usage pourcentages data preparation
      for (let i = 0; i < powerArray.length; i++) {
        var currentDay = 0;
        for (let j = 0; j < 24; j++) {
          currentDay += powerArray[i][j];
        }
        sumPowerArray.push(currentDay);
      }
      //sumPowerArray contains the total energy usage per Source

      for (let i = 0; i < 24; i++) {
        var hourlyUsage = 0;
        for (let j = 0; j < powerArray.length; j++) {
          hourlyUsage += powerArray[j][i];
        }
        sumPowerPerHour.push(hourlyUsage);
      }
      //sumPowerPerHour contains the enrgy usage per hour (sum of all sources per hour)
      for (let i = 0; i < sumPowerArray.length; i++) {
        totalPowerPerDay += sumPowerArray[i];
      }
      //totalPowerPerDay is the total power generated daily (all sources)
      for (let i = 0; i < sumPowerArray.length; i++) {
        gaugeArrayDaily.push(
          Math.round((sumPowerArray[i] / totalPowerPerDay) * 100)
        );
      }
      //dataForGaugeAndPieChart contains data formated for Pie and Gauge chart usage, pourcentages of usage per source for one day
      dataForGaugeAndPieChart.push(["Label", "Value"]);

      for (var i = idArray.length - 1; i >= 0; i--) {
        dataForGaugeAndPieChart.push(["# " + idArray[i], gaugeArrayDaily[i]]);
      }
      gaugeUsageData.push(dataForGaugeAndPieChart);

      var initial = ["Day"];
      for (var i = idArray.length - 1; i >= 0; i--) {
        initial.push("# " + idArray[i]);
      }
      colorfulDailyUsagePerSource.push(initial);
      /** 
      for (var k = 0; k < idArray.length; k++) {
     colorfulDailyUsagePerSource.push(["#" + idArray[k],gaugeArrayDaily[k]]);
      }
      */
      var initial2 = ["Sources"];
      for (var k = 0; k < idArray.length; k++)
        initial2.push(gaugeArrayDaily[k]);
      colorfulDailyUsagePerSource.push(initial2);

      colDailyUsageperSource.push(colorfulDailyUsagePerSource);

      //----------------------

      for (let i = 0; i < powerArray.length; i++) {
        var currentResource = [];
        for (let j = 0; j < 24; j++)
          currentResource.push(
            Math.round((powerArray[i][j] / sumPowerPerHour[j]) * 100)
          );
        hourlyPercentagePerResource.push(currentResource);
      }

      var initial = ["Hour"];
      for (var k = 0; k < idArray.length; k++) {
        initial.push("#" + idArray[k]);
      }
      percentHourly.push(initial);
      for (var j = 0; j < 24; j++) {
        var current = [
          new Date(
            state.dataStructured[index].dayContent.year,
            state.dataStructured[index].dayContent.month,
            state.dataStructured[index].dayContent.day,
            j,
            0,
            0
          )
        ];
        for (var i = 0; i < idArray.length; i++) {
          current.push(hourlyPercentagePerResource[i][j]);
        }
        percentHourly.push(current);
      }

      pourcentageDailyData.push(percentHourly);
    }
    commit("setHourlyUsageData", hourlyUsageData);
    commit("setGaugeUsageData", gaugeUsageData);
    commit("setPerHourUsageData", pourcentageDailyData);
    commit("setColDailyUsage", colDailyUsageperSource);
  }
};
const mutations = {
  setApiData: (state, data) => (state.apiData = data),
  setStructuredData: (state, data) => (state.dataStructured = data),
  setHourlyUsageData: (state, data) => (state.fullHourlyUsage = data),
  setGaugeUsageData: (state, data) => (state.fullGaugeUsage = data),
  setPerHourUsageData: (state, data) => (state.percHourUsageData = data),
  setColDailyUsage: (state, data) => (state.colDayPercUsageData = data)
};

export default {
  state,
  getters,
  actions,
  mutations
};
