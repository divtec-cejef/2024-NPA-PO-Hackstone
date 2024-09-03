<template>
  <div id="app1">
    <RFIDReadersAttaque/>
  </div>
</template>

<script>
import RFIDReadersAttaque from '@/components/plateauAttaque/RFIDReadersAttaque.vue';

export default {
  name: 'App',
  components: {
    RFIDReadersAttaque
  }
};
</script>

<style>
#app1 {
  background: url("../img_carte/plateau_attaquant.webp")  center center / cover no-repeat fixed;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>