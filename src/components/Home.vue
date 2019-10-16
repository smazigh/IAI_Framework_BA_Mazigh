<template>
  <div class="homet">
    <router-link class="btn" to="/Daily">Start</router-link>
    <router-link class="btn" to="/Month">Month</router-link>
    <v-select label="time period" :options="['Hello', 'Darkness']"></v-select>
  </div>
</template>

<style>
.homet {
  margin-top: 100px;
}
</style>

