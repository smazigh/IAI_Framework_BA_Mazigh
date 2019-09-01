import Vuex from 'vuex';
import Vue from 'vue';
import EnergyData from './modules/energydata'

Vue.use(Vuex);


export default new Vuex.Store({
    modules: {EnergyData
    }
});