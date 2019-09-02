import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import DayView from "./components/DayView.vue";
import MonthView from "./components/MonthViewComponent.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/Daily",
      name: "DayView",
      component: DayView
    },
    {
      path: "/Daily/:dayToShow",
      name: "DayViewWithID",
      component: DayView,
      props: { fromRoute: true }
    },
    {
      path: "/Month",
      name: "month",
      component: MonthView
    }
  ]
});
