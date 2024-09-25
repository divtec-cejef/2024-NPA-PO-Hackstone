<script setup>

</script>

<template>
  <div class="attaque_pvDefenses">
    <img v-for="n in 5" :key="n" src="../../img/coeur.webp" alt="Heart" class="attaque_pvDefense">
  </div>
</template>

<style scoped>
.attaque_pvDefenses {
  display: flex;
  justify-content: center;
  gap: 5px;
  position: absolute;
  top: 50px; /* Positionner les cœurs en haut */
  right: 50px; /* Positionner les cœurs en haut */
}

.attaque_pvDefense {
  width: 70px; /* Taille des cœurs */
  height: 70px;
}
</style>