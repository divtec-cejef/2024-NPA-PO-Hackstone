<script setup>
import { ref, watch } from 'vue'

// Variable représentant les PV du joueur (ici 5 PV pour commencer)
const pv = ref(5)

// Variable pour afficher ou masquer le message de défaite
const hasLost = ref(false)

// Observer les PV, si 0, afficher un message indiquant la défaite
watch(pv, (newVal) => {
  if (newVal <= 0) {
    hasLost.value = true
  }
})

// Fonction pour simuler la perte de PV (par exemple après une attaque)
function perdrePV() {
  if (pv.value > 0) {
    pv.value -= 1
  }
}
</script>

<template>
  <div>
    <!-- Affichage des cœurs -->
    <div class="defense_pvDefenses">
      <img v-for="n in pv" :key="n" src="../../img/PV_defenseur.png" alt="Heart" class="defense_pvDefense">
    </div>

    <!-- Bouton pour tester la perte de PV -->
    <button @click="perdrePV">Perdre un PV</button>

    <!-- Filtre gris et message de défaite affichés si le joueur a perdu -->
    <div v-if="hasLost">
      <!-- Filtre gris sur tout l'arrière-plan -->
      <div class="overlay"></div>

      <!-- Message de défaite affiché au centre -->
      <div class="defeat-message">
        <h1>Vous avez perdu !</h1>
      </div>
    </div>
  </div>
</template>

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

/* Style du filtre gris */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Filtre sombre/gris */
  backdrop-filter: grayscale(100%); /* Applique le filtre en niveaux de gris */
  z-index: 999; /* S'assure que le filtre soit en dessous du message */
}

/* Style du message de défaite */
.defeat-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  z-index: 1000; /* S'assure que le message soit au-dessus du filtre */
  font-size: 2em;
}
</style>
