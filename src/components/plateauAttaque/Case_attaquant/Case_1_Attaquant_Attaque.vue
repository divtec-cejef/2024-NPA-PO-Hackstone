<template>
  <div class="bottomReader1_attaque">
    <!-- L'image de la carte (affichée tout le temps) -->
    <img :src="getImagePath(image)" alt="Attaque Card" class="attaque-card" ref="attackingCard">
    <button @click="attaquerCarte('attackingCard', milieu)" class="test-attaque-btn">Attaque une carte</button>
  </div>
</template>

<script>
import mixinsAnimation from "@/mixins/mixinsAnimation";

export default {
  mixins: [mixinsAnimation],
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
  data() {
    return {
      gauche: -230,
      milieu: 230,
      droite: 680,
      stockage: 1140
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
      return require('@/img/img_carte/img_attaque/anonymous.png');
    }
  }
};
</script>

<style scoped>
.bottomReader1_attaque {
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

.test-attaque-btn {
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

.attaque-card {
  height: 100%;
}

.test-attaque-btn:hover {
  background-color: rgba(0, 0, 0, 0.9); /* Légère différence sur hover */
}
</style>
