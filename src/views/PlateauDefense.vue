<template>
  <div id="app2">
    <RFIDReadersDefense/>
  </div>
</template>

<script>
import RFIDReadersDefense from '@/components/plateauDefense/RFIDReadersDefense.vue';

export default {
  name: 'App',
  components: {
    RFIDReadersDefense
  }
};
</script>

<style>
#app2 {
  background: url("../img/plateau_defenseur.png")  center center / cover no-repeat fixed;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>