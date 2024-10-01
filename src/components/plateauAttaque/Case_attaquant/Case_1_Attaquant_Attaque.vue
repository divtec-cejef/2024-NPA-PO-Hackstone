<template>
  <div class="bottomReader1_attaque">
    <img v-if="image" :src="getImagePath(image)" alt="Defense Card" class="defense-card" ref="attackingCard">
    <p v-else></p>

    <button @click="attaquerUneCarte()" class="test-attaque-btn">attaque une carte</button>
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
      try {
        return require(`@/${image}`);
      } catch (e) {
        console.error("Image not found:", image);
        return ''; // Return a default or empty string if image not found
      }
    },
    attaquerUneCarte() {
      // Animation de déplacement avec GSAP
      const tl = gsap.timeline();
      tl.to(this.$refs.attackingCard, {
        duration: 0.5,
        x: 200, // Déplace la carte de 200px vers la droite
        y: -100, // Déplace la carte vers le haut
        ease: "power1.inOut",
        onComplete: () => {
          this.triggerImpact(); // Animation d'impact
        }
      }).to(this.$refs.attackingCard, {
        duration: 0.5,
        x: 0,
        y: 0, // Retourne la carte à sa position initiale
        ease: "power1.inOut"
      });
    },
    triggerImpact() {
      // Simuler l'impact (par exemple un effet de tremblement sur la carte cible)
      gsap.to(this.$refs.attackingCard, {
        duration: 0.1,
        scale: 1.1,
        repeat: 1,
        yoyo: true
      });
    }
  }
};
</script>

<style>
.bottomReader1_attaque {
  width: 300px;
  height: 420px;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100%;
  background-color: rgba(255, 255, 255, 0.5);
}

.defense-card {
  width: 100%;
  height: auto;
}
</style>