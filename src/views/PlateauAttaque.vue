<template>
  <div id="app1">
    <PlateauFinaleAttaquant/>
  </div>
</template>

<script>
import PlateauFinaleAttaquant from '@/components/plateauAttaque/PlateauFinaleAttaquant.vue';

export default {
  name: 'App',
  components: {
    PlateauFinaleAttaquant,
  }
};
</script>

<style>
body {
  display: block;
  margin: 0;
}

#app1 {
  background: url("../img/composant_plateau/fond_ecran/fondEcranAttaque.jpeg")  center center / cover no-repeat fixed;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}
</style>