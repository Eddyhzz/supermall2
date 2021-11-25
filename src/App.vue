<template>
  <div id="app">
    <router-view></router-view>
    <MainTarBar></MainTarBar>
  </div>
</template>

<script>
import MainTarBar from "./components/content/maintarbar/MainTarBar";

export default {
  name: 'App',
  components: {
    MainTarBar
  }
}
</script>

<style>
@import "assets/css/base.css";
</style>
