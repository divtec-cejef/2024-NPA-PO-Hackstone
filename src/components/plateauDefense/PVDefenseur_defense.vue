<template>
  <div class="container">
    <!-- Affichage des boucliers de défense -->
    <div class="defense_pvDefenses">
      <div v-for="(isBroken, index) in boucliers" :key="index" class="bouclier-container">
        <!-- Bouclier intact -->
        <div v-if="!isBroken" class="bouclier">
          <img src="../../img/PV_defenseur.png" alt="Bouclier Défense" />
        </div>

        <!-- Bouclier cassé avec images séparées pour la gauche et la droite -->
        <div v-else class="bouclier-casse">
          <div class="bouclier-half left-half">
            <img src="../../img/shield-left.png" alt="Bouclier Gauche" />
          </div>
          <div class="bouclier-half right-half">
            <img src="../../img/shield-right.png" alt="Bouclier Droit" />
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton pour tester la perte de PV de la défense -->
    <button @click="perdrePVDefense" class="test-defeat-btn">Perdre un PV Défense</button>

    <!-- Message de défaite si la défense a perdu -->
    <div v-if="defenseHasLost" class="defeat-overlay">
      <div class="overlay"></div>
      <div class="defeat-message">
        <h1>Le système a succombé aux attaques</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Points de vie de la défense et état des boucliers
const pvDefense = ref(5)
const boucliers = ref([false, false, false, false, false])
const defenseHasLost = ref(false)

// Observer les PV pour déclencher la défaite si PV = 0
watch(pvDefense, (newVal) => {
  if (newVal <= 0) {
    defenseHasLost.value = true
  }
})

// Fonction pour simuler la perte de PV de la défense
function perdrePVDefense() {
  if (pvDefense.value > 0) {
    boucliers.value[pvDefense.value - 1] = true
    pvDefense.value -= 1
  }
}
</script>

<style scoped>
.container {
  text-align: center;
}

.defense_pvDefenses {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  left: 50px;
}
.bouclier-container {
  position: relative;
  width: 150px; /* Largeur globale du bouclier */
  height: 150px; /* Hauteur globale du bouclier */
  margin: 5px;
}

.bouclier img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ajuster l'image au conteneur */
}

/* Styles pour le bouclier cassé avec images séparées */
.bouclier-casse {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.bouclier-half {
  height: 100%;
  position: relative;
}
.left-half {
  width: 50%; /* Ajuster cette valeur en fonction de la largeur réelle de l'image gauche */
  height: 100%;
  display: flex;
  justify-content: flex-end;
}

.right-half {
  width: 50%; /* Ajuster cette valeur en fonction de la largeur réelle de l'image droite */
  height: 100%;
  display: flex;
  justify-content: flex-start;
}

.right-half {
  width: 50%; /* Ajuster cette valeur en fonction de la largeur réelle de l'image droite */
  height: 100%;
  display: flex;
  justify-content: flex-start;
}

.right-half img {
  width: 100%; /* Remplir complètement chaque conteneur */
  height: 150px;
  object-fit: contain;
}

/* Animation pour la cassure */
@keyframes break-left {
  0% {
    transform: translateX(-30%) rotate(0deg);
  }
  100% {
    transform: translateX(-60%) rotate(-15deg);
    opacity: 0;
  }
}

@keyframes break-right {
  0% {
    transform: translateX(30%) rotate(0deg);
  }
  100% {
    transform: translateX(60%) rotate(15deg);
    opacity: 0;
  }
}

/* Overlay sombre */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: grayscale(100%);
  z-index: 999;
}

/* Message de défaite */
.defeat-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: red;
  font-size: 40px;
  font-family: Impact, serif;
  text-align: center;
  opacity: 1;
  animation: defeat-animation 1s ease-out forwards;
  z-index: 1000;
}

@keyframes defeat-animation {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

/* Style pour le bouton */
.test-defeat-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
</style>
