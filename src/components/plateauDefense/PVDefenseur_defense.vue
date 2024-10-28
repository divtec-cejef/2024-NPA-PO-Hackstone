<script setup>
import {ref, watch} from 'vue'
import {pv} from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import {defaite} from "@/components/plateauDefense/TourAttaquant_defense.vue";
// Variables représentant les PV du joueur (ici 5 PV pour commencer)
// État des boucliers (intact ou cassé)
const boucliers = ref([false, false, false, false, false]); // false signifie que le bouclier est intact
let hasLost = ref(false);
// Observer les PV, si 0, afficher un message indiquant la défaite
watch(pv, (newVal) => {
  if (newVal <= 0) {
    perdrePV();
    hasLost.value = true;
    defaite.value = true;
  }else
    perdrePV();
});

// Fonction pour simuler la perte de PV (par exemple après une attaque)
function perdrePV() {
  if (pv.value >= 0) {
    // Mettre à jour l'état du bouclier correspondant
    boucliers.value[(pv.value)] = true; // Casser le bouclier correspondant
  }
}
</script>

<template>
  <div>
    <!-- Affichage des boucliers -->
    <div class="defense_pvDefenses">
      <div v-for="(isBroken, index) in boucliers" :key="index" class="bouclier-container">
        <div v-if="!isBroken" class="bouclier">
          <img src="../../img/PV_defenseur.png" alt="Heart" class="defense_pvDefense"/>
        </div>

        <div v-else class="bouclier-casse">
          <div class="bouclier-half left-half">
            <img src="../../img/shield-left.png" alt="Bouclier Gauche"/>
          </div>
          <div class="bouclier-half right-half">
            <img src="../../img/shield-right.png" alt="Bouclier Droit"/>
          </div>
        </div>
      </div>
    </div>

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

.bouclier-container {
  position: relative;
  width: 100px; /* Largeur globale du bouclier */
  height: 120px; /* Hauteur globale du bouclier */
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
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
}

.right-half {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
}

.left-half img,
.right-half img {
  width: 100%; /* Remplir complètement chaque conteneur */
  height: 100%; /* Ajuster la taille selon vos images */
  object-fit: contain;
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
