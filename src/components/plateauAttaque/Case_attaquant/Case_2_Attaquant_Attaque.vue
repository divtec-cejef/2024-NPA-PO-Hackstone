<template>
  <div class="bottomReader2_attaque">
    <img :src="getImagePath(image)" alt="Attaque Card" class="attaque-card2" ref="attackingCard2">
    <button @click="attaquerCarte(2, stockage)" class="test-attaque-btn2">Attaque une carte</button>
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
      gauche: -680,
      milieu: -230,
      droite: 230,
      stockage: 680
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

.attaque-card2 {
  height: 100%;
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