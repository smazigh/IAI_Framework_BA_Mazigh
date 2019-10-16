<template>
     <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              
              <div class="row">
                <div class="col s6 m6 l6">
                  <span class="card-title">Resource View for #2</span>
                </div>
                  
           <div class="col s3 m3 l3">
            <paper-dropdown-menu label="Time Period">
                  <paper-listbox slot="dropdown-content" selected="0">
                    <paper-item>5 Days</paper-item>
                    <paper-item>1 Day</paper-item>
                    <paper-item>30 Days</paper-item>
                  </paper-listbox>
                </paper-dropdown-menu>
</div>

     <div class="col s3 m3 l3">
            <paper-dropdown-menu label="Resource">
                  <paper-listbox slot="dropdown-content" selected="0">
                    <paper-item>#1</paper-item>
                    <paper-item>#2</paper-item>
                    <paper-item>#3</paper-item>
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
  <GChart

        type="AreaChart"
          v-bind:data="data1"

        />
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              
              <button class="waves-effect waves-light btn-small" @click="$emit('close')">
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
        data1: [
["Day","Usage"],
["1/11",19],
["5/11",1],
["10/11",8],
["15/11",14],
["20/11",50],
["25/11",19],
["30/11",36],
]
    }
    
    
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
  width: 800px;
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

