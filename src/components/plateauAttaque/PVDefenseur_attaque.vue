<script setup>
import {ref, watch} from "vue";
import confetti from "canvas-confetti";
import { pv }  from '@/components/plateauAttaque/fonctionnaliteesAttaque.vue';  // Importez `pv` depuis votre fichier de logique du jeu
const hasWon = ref(false)

// Fonction pour déclencher les confettis
function launchConfetti() {
  confetti({
    particleCount: 1000,
    spread: 150,
    origin: { y: 0.6 }
  });
}

// Observer les PV de l'attaquant, si 0, afficher un message indiquant la victoire et déclencher les confettis
watch(pv, (newVal) => {
  if (newVal <= 0) {
    hasWon.value = true
    launchConfetti()
  }
})

</script>

<template>
  <div class="attaque_pvDefenses">
    <!-- Afficher un cœur pour chaque PV restant -->
    <img v-for="n in pv" :key="n" src="../../img/coeur.webp" alt="Heart" class="attaque_pvDefense">
  </div>
  <!-- Filtre joyeux et message de victoire affichés si pv atteint 0 -->
  <div v-if="pv === 0">
    <div class="overlay"></div>
    <div class="victory-message">
      <h1>🏆 Vous avez gagné ! 🏆</h1>
    </div>
  </div>
</template>

<style scoped>
.attaque_pvDefenses {
  display: flex;
  justify-content: center;
  gap: 5px;
  position: absolute;
  top: 50px;
  right: 50px;
}

.attaque_pvDefense {
  width: 70px;
  height: 70px;
}
/* Style du filtre joyeux */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6); /* Filtre lumineux */
  z-index: 999; /* S'assure que le filtre soit en dessous du message */
}

/* Style du message de victoire */
.victory-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: green;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 1000; /* S'assure que le message soit au-dessus du filtre */
  font-size: 2.5em;
  font-weight: bold;
  animation: pop-in 0.5s ease-in-out; /* Animation du message */
}

/* Animation d'apparition du message de victoire */
@keyframes pop-in {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
  }

  50% {
    transform: translate(-50%, -50%) scale(2);
  }

  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>