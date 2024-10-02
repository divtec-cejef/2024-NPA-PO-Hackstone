<template>
  <div class="bottomReader2_attaque">
    <img v-if="image" :src="getImagePath(image)" alt="Defense Card" class="attaque-card-2">
    <!-- L'image de la carte (affichée tout le temps) -->
    <img :src="getImagePath(image)" alt="Defense Card" class="attaque-card" ref="attackingCard2">

    <!-- Le bouton par-dessus l'image -->
    <button @click="attaquerCarte('stockage')" class="test-attaque-btn2">Attaque une carte</button>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: false
    }
  },
  methods: {
    getImagePath(image) {
      if (image) {
        try {
          return require(`@/${image}`);
        } catch (e) {
          console.error("Image non trouvée :", image);
        }
      }
      // Retourne une image par défaut si aucune image n'est fournie
      return require('@/img/img_carte/img_attaque/anonymous.png'); // Assure-toi d'avoir une image par défaut dans tes assets
    },

    attaquerCarte(cote) {
      const attackingCard2 = this.$refs.attackingCard2;
      let deplacementX = 0;

      // Vérifie si l'image existe avant de tenter l'animation
      if (!attackingCard2) {
        console.error("La carte attaquante n'est pas disponible.");
        return;
      }

      if (cote === "milieu") {
        deplacementX = -370;
      } else if (cote === "droite") {
        deplacementX = 370;
      } else if (cote === "gauche") {
        deplacementX = -1140;
      } else if (cote === "stockage") {
        deplacementX = 1140;
      }

      // Animation de déplacement avec GSAP
      const tl = gsap.timeline();
      // Étape 1: Zoom léger
      tl.to(attackingCard2, {
        duration: 0.3,
        scale: 1.2, // Zoom à 120%
        ease: "power1.inOut"
      })
          // Étape 2: Déplacer vers le haut et revenir à la taille normale
          .to(attackingCard2, {
            duration: 0.5,
            y: -700, // Déplacement vers le haut
            x: deplacementX,
            scale: 1, // Retour à la taille initiale
            ease: "power1.inOut"
          })
          // Étape 3: Retourner à la position initiale
          .to(attackingCard2, {
            duration: 0.5,
            y: 0,
            x: 0,
            ease: "power1.inOut"
          });
    }
  }
};
</script>

<style>
.bottomReader2_attaque {
  width: 300px;
  height: 420px;
  position: relative; /* Pour placer le bouton par-dessus l'image */
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100%;
  background-color: rgba(255, 255, 255, 0.5);
}

.attaque-card-2 {
  height: auto;
  transition: transform 0.3s ease; /* Transition fluide pour les animations */
}

.test-attaque-btn2 {
  position: absolute; /* Le bouton est placé au-dessus de l'image */
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7); /* Bouton semi-transparent */
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1; /* S'assurer que le bouton est au-dessus de l'image */
}

.test-attaque-btn2:hover {
  background-color: rgba(0, 0, 0, 0.9); /* Légère différence sur hover */
}
</style>