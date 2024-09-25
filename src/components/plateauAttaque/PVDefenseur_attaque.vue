<script setup>

</script>

<template>
  <div class="attaque_pvDefenses">
    <img v-for="n in 5" :key="n" src="../../img/PV_defenseur.png" alt="Heart" class="attaque_pvDefense">
  </div>
</template>

<style scoped>
.attaque_pvDefenses {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50px; /* Positionner les cœurs en haut */
  right: 50px; /* Positionner les cœurs en haut */
}

.attaque_pvDefense {
  width: 100px; /* Taille des cœurs */
  height: 120px;
}
</style>