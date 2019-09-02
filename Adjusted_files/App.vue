<template>
  <div id="app">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import Vue from "vue";
import VCalendar from "v-calendar";
import { mapGetters, mapActions, mapState } from "vuex";

Vue.use(VCalendar, {
  componentPrefix: "vc"
});

export default {
  name: "app",

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

    checkIfDateInRange: function(day) {
      var dataRangeLength = this.apiData.data.length - 1;
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
  }
};
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  background-image: "./assets/background.jpg";
}
</style>
