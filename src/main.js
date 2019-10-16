import Vue from "vue";
import App from "./App.vue";
import VueResource from "vue-resource";

import "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import router from "./router";
import store from "./store";
import VCalendar from "v-calendar";
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js'; 
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';


import vSelect from 'vue-select'

Vue.component('v-select', vSelect);
import 'vue-select/dist/vue-select.css';

import { DropdownPlugin } from "bootstrap-vue";
Vue.use(DropdownPlugin);
Vue.use(VCalendar, {
  componentPrefix: "vc"
});
Vue.use(VueResource);

Vue.config.productionTip = false;
new Vue({ router, store, render: h => h(App) }).$mount("#app");
