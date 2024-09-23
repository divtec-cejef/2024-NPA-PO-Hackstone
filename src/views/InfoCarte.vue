<template>
  <div id="app3">
    <Informations_cartes/>
  </div>
</template>

<script>
import Informations_cartes from '@/components/Infomations_cartes.vue';

export default {
  name: 'App',
  components: {
    Informations_cartes,
  }
};
</script>

<style>
body {
  display: block;
  margin: 0;
}

#app3 {
  background: url("../img/coeur.webp")  center center / cover no-repeat fixed;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>