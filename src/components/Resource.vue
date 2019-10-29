<template>
     <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              
              <div class="row">
                <div class="col s6 m6 l6">
                  <span class="card-title">Resource View for #{{resourceID}}</span>
                </div>
                  
           <div class="col s3 m3 l3">
            <paper-dropdown-menu label="Time Period">
                  <paper-listbox slot="dropdown-content" :selected="timePIndex">
                    <paper-item v-on:click ="adjustTimeP(5)">5 Days</paper-item>
                    <paper-item v-on:click ="adjustTimeP(15)">15 Day</paper-item>
                    <paper-item v-on:click ="adjustTimeP(30)">30 Days</paper-item>
                  </paper-listbox>
                </paper-dropdown-menu>
</div>

     <div class="col s3 m3 l3">
            <paper-dropdown-menu label="Resource">
                  <paper-listbox slot="dropdown-content" :selected="resourceID">
                    <paper-item v-for="item in this.$store.getters.getResourceData" v-bind:key="item.resourceID"  v-on:click="adjustResource(item.resourceID)">#{{item.resourceID}}</paper-item>
                  </paper-listbox>
                </paper-dropdown-menu>
</div>
            
   
        </div>
        <div>
</div>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
     <div class="card teal">         
  <GChart

        v-if="renderComponent"

        v-bind:type="chartType"
          v-bind:data="dataArray"

        />
     </div>
        <div class="card-action"> <a
          class="waves-effect waves-light btn-large center "
          v-on:click="setLines"
          v-bind:class="{ red: isLines() }"
          ><i class="material-icons left">timeline</i>Lines</a
        >
        <a
          class="waves-effect waves-light btn-large center  "
          v-on:click="setColumns"
          v-bind:class="{ red: isColumns() }"
          ><i class="material-icons left">assessment</i>Column</a
        ></div>
       
            </slot>
          </div>
       
          <div class="modal-footer">
            <slot name="footer">
       

              
              <button class="waves-effect waves-light btn-small center" @click="$emit('close')">
                Close
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { GChart } from "vue-google-charts";


export default {
    name: "Resource",
  components: {
    GChart
  },
   data() {
    return {
        dataArray: [],
        timePIndex: 0,
        chartType: "LineChart",
        renderComponent: true
    }
    
    
},
props: {
resourceID: 0,
timeP: 0
},

methods : {
  prepareData : function (timePeriod, resourceID) {
    var dataArray = []
          dataArray.push(["Day", "Usage"]);
    if (timePeriod == 30) {
      for (let k = 0; k < this.$store.getters.getResourceData[resourceID].dates.length; k++) {
        dataArray.push([this.$store.getters.getResourceData[resourceID].dates[k] , this.$store.getters.getResourceData[resourceID].powerGeneration[k]]);
      }
              this.updateDataArray = dataArray;
        this.timePIndex = 2;
       return;
    }

     if (timePeriod == 15) {
      for (let ki = this.$store.getters.getResourceData[resourceID].dates.length -15; ki < this.$store.getters.getResourceData[resourceID].dates.length; ki++) {
         dataArray.push([this.$store.getters.getResourceData[resourceID].dates[ki] , this.$store.getters.getResourceData[resourceID].powerGeneration[ki]]);
      }
        this.updateDataArray = dataArray;
        this.timePIndex = 1;
        return;
      }
    

   if (timePeriod == 5) {
      for (let kii = this.$store.getters.getResourceData[resourceID].dates.length -5; kii < this.$store.getters.getResourceData[resourceID].dates.length; kii++) {
         dataArray.push([this.$store.getters.getResourceData[resourceID].dates[kii] , this.$store.getters.getResourceData[resourceID].powerGeneration[kii]]);
      }
        this.updateDataArray = dataArray;
        this.timePIndex = 0;
        return;
      }
  }
    
  , adjustResource: function (value){
      this.resourceID = value;
      console.log(this.resourceID);
      this.prepareData(this.timeP,this.resourceID);
    }, 
     adjustTimeP: function(value) {
      this.timeP = value;
      this.prepareData(this.timeP,this.resourceID);
    },
    isColumns() {
      return this.chartType === "ColumnChart";
    },
    isLines() {
      return this.chartType === "LineChart";
    },

    forceRerender() {
      // Remove my-component from the DOM
      this.renderComponent = false;

      this.$nextTick(() => {
        // Add the component back in
        this.renderComponent = true;
      });
    },

    setLines: function() {
      this.chartType = "LineChart";
      this.forceRerender();
    },
    setColumns: function() {
      this.chartType = "ColumnChart";
      this.forceRerender();
    },

},
computed : {
  updateDataArray : {
     get: function() {
        return this.dataArray;
      },
      set: function(value) {
        this.dataArray = value;
      }
  }
}, 
created()  {
  this.prepareData(this.timeP,this.resourceID);
}
}
</script>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 75%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 40px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
<style lang="scss" scoped>
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
</style>

