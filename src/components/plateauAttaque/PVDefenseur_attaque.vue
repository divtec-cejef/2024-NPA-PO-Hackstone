<script setup>
import { ref, watch} from 'vue'
import confetti from 'canvas-confetti'

// Variable représentant les PV de l'attaquant (ici 5 PV pour commencer)
const pvAttaquant = ref(5)

// Variable pour afficher ou masquer le message de victoire
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
watch(pvAttaquant, (newVal) => {
  if (newVal <= 0) {
    hasWon.value = true
    launchConfetti()
  }
})

// Fonction pour simuler la perte de PV de l'attaquant (par exemple après une attaque)
function perdrePVAttaquant() {
  if (pvAttaquant.value > 0) {
    pvAttaquant.value -= 1
  }
}
</script>

<template>
  <div>
    <!-- Affichage des cœurs pour l'attaquant -->
    <div class="attaque_pvDefenses">
      <img v-for="n in pvAttaquant" :key="n" src="../../img/PV_defenseur.png" alt="Heart" class="attaque_pvDefense">
    </div>

    <!-- Bouton pour tester la perte de PV de l'attaquant -->
    <button @click="perdrePVAttaquant">Perdre un PV Attaquant</button>

    <!-- Filtre joyeux et message de victoire affichés si l'attaquant a gagné -->
    <div v-if="hasWon">
      <!-- Filtre coloré sur tout l'arrière-plan -->
      <div class="overlay"></div>

      <!-- Message de victoire affiché au centre avec des couleurs joyeuses -->
      <div class="victory-message">
        <h1>🏆 Vous avez gagné ! 🏆</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.attaque_pvDefenses {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50px; /* Positionner les cœurs en haut */
  right: 50px; /* Positionner les cœurs à droite */
}

.attaque_pvDefense {
  width: 100px; /* Taille des cœurs */
  height: 120px;
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
  animation: pop-in 0.8s ease-in-out; /* Animation du message */
}

/* Animation d'apparition du message de victoire */
@keyframes pop-in {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.5);
  }

  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
