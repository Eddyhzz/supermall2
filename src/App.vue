<template>
  <div id="app">
    <keep-alive exclude="detail">
      <router-view></router-view>
    </keep-alive>
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
