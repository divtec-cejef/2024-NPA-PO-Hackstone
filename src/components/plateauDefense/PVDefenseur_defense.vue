<template>
  <div class="defense_pvDefenses">
    <img v-for="n in 5" :key="n" src="../../img/PV_defenseur.png" alt="Heart" class="defense_pvDefense">
  </div>

  <!-- Message de défaite lorsqu'il n'y a plus de PV -->
  <div v-if="pvRestant === 0" class="defaite-message">
    Vous avez perdu !
  </div>
</template>

<script setup>
import { ref } from 'vue';

const pvRestant = ref(5); // Initialise à 5 PV

// Fonction pour réduire les PV lors d'une attaque
function perdrePV() {
  if (pvRestant.value > 0) {
    pvRestant.value--;
  }
}
</script>


<style scoped>
.defense_pvDefenses {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 50px;
  left: 50px;
}

.defense_pvDefense {
  width: 100px; /* Taille des cœurs */
  height: 120px;
}

.defaite-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  color: red;
  font-weight: bold;
}

</style>