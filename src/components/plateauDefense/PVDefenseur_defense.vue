<script setup>

</script>

<template>
  <div class="defense_pvDefenses">
    <img v-for="n in 5" :key="n" src="../../img/coeur.webp" alt="Heart" class="defense_pvDefense">
  </div>
</template>

<style scoped>
.defense_pvDefenses {
  display: flex;
  justify-content: center;
  gap: 5px;
  position: absolute;
  bottom: 50px;
  left: 50px;
}

.defense_pvDefense {
  width: 70px; /* Taille des cœurs */
  height: 70px;
}
</style>