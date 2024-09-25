<template>
  <div id="app2">
    <PlateauFinaleDefenseur/>
  </div>
</template>

<script>
import PlateauFinaleDefenseur from "@/components/plateauDefense/PlateauFinaleDefenseur.vue";

export default {
  name: 'App',
  components: {
    PlateauFinaleDefenseur
  }
};
</script>

<style>
body {
  display: block;
  margin: 0;
}

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