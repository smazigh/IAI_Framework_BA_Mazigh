<template class="container" >

  <div class=" homet" :style="{ backgroundImage: `url(${backgroundUrl})` , backgroundSize: 'contain'}" >
    <div class="container">
     
      

<div class="row sep"></div>

    
    <div class="row decal">
      <div class="col s12 m6">
         <div class="card transpaent large">
        <div class="card-content transpaent valign-wrapper">
        <img class="container valign-wrapper" src="../assets/KITLogo_RGB-1.png" style="width:10em; height:5em; top=50%" alt="">
        </div>
        <div class="card-content transpaent">
          <h4 class="center">Institute for Automation and applied Informatics (IAI)</h4>
        </div>
        <div class="card-action transpaent">
           <h5>{{ new Date() | moment("dddd, MMMM Do YYYY") }}</h5>
        </div>
         </div>
      </div>
    <div class="col s12 m6 ">
      <div class="card blue-grey darken-1 large">
        <div class="card-content white-text">
          <span class="card-title">Welcome New User !</span>
          <h4>A Modular Generic and Fully Customized Front-end for Scheduling Energy Resources in Smart Grids</h4>
          
        </div>
        <div class="card-action">
           <div class="row">
            <router-link class="btn left" v-bind:class="{disabled:!isLoaded()}" to="/Daily">Start</router-link>
            <button id="loadBtn" class="btn right" v-on:click="move" v-bind:class="{disabled:isLoaded()}" >Load Data</button> 
           </div>
        </div>
      </div>
      </div>
      
    </div>
    <div class="row">
      <div class="w3-light-grey">
      <div id="myBar"  class="w3-container w3-blue w3-center" v-show="displayBar" style="width:1%">%</div>
          </div>
    </div>
    <div class="row sep"></div>
  </div>

    
    

   <!-- <v-select label="time period" :options="['Hello', 'Darkness']"></v-select> -->
  </div>
</template>
<script>
import backgroundUrl from '../assets/background.jpg'
import logoKIT from '../assets/KITLogo_RGB-1.png';


export default {
  components: {
  
  
  },
  data() {
    return {
      backgroundUrl,
      logoKIT,
      loaded : false,
      displayBar : false

    }
  }, 
  methods :{
   move: function () {
     this.displayBar = true;
  var elem = document.getElementById("myBar");   
  var width = 0;
  var id = setInterval(frame, 50);
  function frame() {
    if (width >= 100) {
      elem.innerHTML = "Data loaded !";
      clearInterval(id);

    } else {
      width++; 
      elem.style.width = width + '%'; 
      elem.innerHTML = width * 1  + '%';
    }
  }

  this.loadingStatus = true;
  
},

isLoaded : function () {
return this.loaded;
}

  },
  computed: {
    loadingStatus: {
      get: function() {
        return this.loaded;
      },
      set: function(value) {
        this.loaded = value;
      }
    }
  }
}

</script>
<style>
.homet {
   background-position: center center;
   background-repeat: no-repeat;
   background-attachment: fixed;
   background-size: cover;
   background-color: #464646;
   height: 100%;
   max-height: 100%;
   margin-top: 0;


}

.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 50px;
  height: 50px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 1s linear infinite;
  position:relative;
  top: 50%;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.sep {
  height: 7cm;
}
</style>

