import Vue from "vue";
import App from "./App.vue";
import VueResource from "vue-resource";
import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import router from "./router";
import store from "./store";
import VCalendar from "v-calendar";
Vue.use(VCalendar, {
  componentPrefix: "vc"
});
Vue.use(VueResource);

Vue.config.productionTip = false;

new Vue({ router, store, render: h => h(App) }).$mount("#app");
