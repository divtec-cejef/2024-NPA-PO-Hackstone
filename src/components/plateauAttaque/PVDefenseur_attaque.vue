<template>
  <div class="container">
    <!-- Affichage des cœurs pour l'attaquant -->
    <div class="attaque_pvDefenses">
      <div v-for="(isBroken, index) in boucliers" :key="index" class="bouclier-container">
        <!-- Bouclier intact -->
        <div v-if="!isBroken" class="bouclier">
          <img src="../../img/PV_defenseur.png" alt="Heart" />
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

    <!-- Overlay et message de victoire affichés si l'attaquant a gagné -->
    <div v-if="hasWon" class="victory-overlay">
      <!-- Overlay qui assombrit l'arrière-plan -->
      <div class="overlay"></div>

      <!-- Message de victoire avec effet glitch, centré au milieu -->
      <div class="glitch-text-container">
        <p class="glitch">
          <span aria-hidden="true">Infiltration réussie</span>
          Infiltration réussie
          <span aria-hidden="true">Infiltration réussie</span>
        </p>
        <button class="close-Page" onclick="window.close()"><b>MENU</b></button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { pv }  from '@/components/plateauAttaque/fonctionnaliteesAttaque.vue';
import { ref, watch } from 'vue'
import {redBorder} from "@/components/plateauAttaque/PlateauFinaleAttaquant.vue";

// Variable représentant les PV de l'attaquant (ici 5 PV pour commencer)
const boucliers = ref([false, false, false, false, false]) // Etat des boucliers (intact ou cassé)

// Variable pour afficher ou masquer le message de victoire
const hasWon = ref(false)

// Fonction pour déclencher les confettis


// Observer les PV de l'attaquant, si 0, affiche un message indiquant la victoire et déclenche les confettis
watch(pv, (newVal) => {
  if (newVal <= 0) {
    perdrePVAttaquant();
    setTimeout(() => {
      hasWon.value = true
    }, 1000);
  }else
    perdrePVAttaquant();
})

// Fonction pour simuler la perte de PV de l'attaquant (par exemple après une attaque)
function perdrePVAttaquant() {
  redBorder.value = true;
  setTimeout(() => {
    redBorder.value = false
  },2000)
  if (pv.value >= 0) {
    boucliers.value[(pv.value - 4) *-1] = true // Casser le bouclier correspondant
  }
}

</script>

<style>
body {
  background: black;
  color: white;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  text-align: center;
}

.bouclier-container {
  position: relative;
  width: 150px; /* Largeur globale du bouclier */
  height: 200px; /* Hauteur globale du bouclier */
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

.right-half img {
  width: 100%; /* Remplir complètement chaque conteneur */
  height: 150px;
  object-fit: contain;
}

.left-half img {
  width: 100%; /* Remplir complètement chaque conteneur */
  height: 140px;
  object-fit: contain;
}

.left-half {
  animation: break-left 0.1s ease-out forwards;
}

.right-half {
  animation: break-right 0.1s ease-out forwards;
}

/* Animation de cassure de la moitié gauche */
@keyframes break-left {
  0% {
    transform: translateX(15%) translateY(2%);
  }
  100% {
    transform: translateX(10%) rotate(-5deg) translateY(2%);
    filter: grayscale(100%);
  }
}

/* Animation de cassure de la moitié droite */
@keyframes break-right {
  0% {
    transform: translateX(-15%);
  }
  100% {
    transform: translateX(-10%) rotate(5deg); /* Se sépare vers la droite */
    filter: grayscale(100%);
  }
}

/* Overlay pour assombrir l'arrière-plan */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); /* Couleur sombre avec transparence */
  z-index: 999;
}

/* Conteneur pour centrer le texte */
.glitch-text-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.glitch {
  font-size: 5rem;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #009eff,
  0.025em 0.04em 0 #ff4d00;
  animation: glitch 725ms infinite;
}

.glitch span {
  position: absolute;
  top: 0;
  left: 0;
}

.glitch span:first-child {
  animation: glitch 500ms infinite;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  transform: translate(-0.04em, -0.03em);
  opacity: 0.75;
}

.glitch span:last-child {
  animation: glitch 375ms infinite;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  transform: translate(0.04em, 0.03em);
  opacity: 0.75;
}

@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #009eff,
    0.025em 0.04em 0 #ff4d00;
  }
  15% {
    text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #009eff,
    0.025em 0.04em 0 #ff4d00;
  }
  16% {
    text-shadow: -0.05em -0.025em 0 #ff0000, 0.025em 0.035em 0 #009eff,
    -0.05em -0.05em 0 #ff4d00;
  }
  49% {
    text-shadow: -0.05em -0.025em 0 #ff0000, 0.025em 0.035em 0 #009eff,
    -0.05em -0.05em 0 #ff4d00;
  }
  50% {
    text-shadow: 0.05em 0.035em 0 #ff0000, 0.03em 0 0 #009eff,
    0 -0.04em 0 #ff4d00;
  }
  99% {
    text-shadow: 0.05em 0.035em 0 #ff0000, 0.03em 0 0 #009eff,
    0 -0.04em 0 #ff4d00;
  }
  100% {
    text-shadow: -0.05em 0 0 #ff0000, -0.025em -0.04em 0 #009eff,
    -0.04em -0.025em 0 #ff4d00;
  }
}
.attaque_pvDefenses {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 20px;
  right: 50px;
}
.close-Page {
  border: 3px solid red;
  background-color: red;
  box-shadow: 0 0 50px red;
  transition: transform 0.1s linear;
  width: 270px;
  height: 70px;
  font-size: 40px;
  font-family: 'Orbitron', sans-serif;
  color: white;
  align-items: center;
  border-radius: 100px;
}
button:hover {
  transform: scale(1.1); /* Agrandit le bouton de 10% */
}
</style>