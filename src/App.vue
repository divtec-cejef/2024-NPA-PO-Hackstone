<template>
  <div id="app">
    <RFIDReaders />
  </div>
</template>

<script>
import RFIDReaders from './components/RFIDReaders.vue';

export default {
  name: 'App',
  components: {
    RFIDReaders
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
