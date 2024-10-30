<template>
  <div>
    <!-- Affichage des compteurs -->
    <div class="compteurs-defense">
      <img v-for="(image, index) in visibleCompteurs" :key="index" :src="image" alt="Stacked Image"
           class="compteur-defense">

      <!-- Images cassées superposées lorsque le compteur est cassé -->
      <div v-for="brokenIndex in brokenCompteurs" :key="'broken-' + brokenIndex" class="compteur-casse">
        <img :src="brokenImagesLeft[brokenIndex]" alt="Compteur Gauche" class="compteur-half left-half" />
        <img :src="brokenImagesRight[brokenIndex]" alt="Compteur Droit" class="compteur-half right-half" />
      </div>
    </div>

    <!-- Bouton pour tester la cassure d'un compteur -->
    <button @click="testBreakCounter" class="test-break-btn">Tester la Cassure d'un Compteur</button>

    <!-- Message de victoire avec effet glitch si victoire -->
    <div v-if="victoire">
      <div class="overlay"></div>
      <div class="glitch-text-container">
        <p class="glitch">
          <span aria-hidden="true">Le système a résisté aux attaques</span>
          Le système a résisté aux attaques
          <span aria-hidden="true">Le système a résisté aux attaques</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import confetti from 'canvas-confetti';

export default {
  data() {
    return {
      images_compteur: [
        require('@/img/compteur/compteur_1.png'),
        require('@/img/compteur/compteur_2.png'),
        require('@/img/compteur/compteur_3.png'),
        require('@/img/compteur/compteur_4.png'),
        require('@/img/compteur/compteur_5.png')
      ],
      brokenImagesLeft: [
        require('@/img/compteur/compteur_1_gauche.png'),
        require('@/img/compteur/compteur_2_gauche.png'),
        require('@/img/compteur/compteur_3_gauche.png'),
        require('@/img/compteur/compteur_4_gauche.png'),
        require('@/img/compteur/compteur_5_gauche.png')
      ],
      brokenImagesRight: [
        require('@/img/compteur/compteur_1_droite.png'),
        require('@/img/compteur/compteur_2_droite.png'),
        require('@/img/compteur/compteur_3_droite.png'),
        require('@/img/compteur/compteur_4_droite.png'),
        require('@/img/compteur/compteur_5_droite.png')
      ],
      visibility: [true, true, true, true, true],
      victoire: false,
    };
  },

  computed: {
    visibleCompteurs() {
      return this.images_compteur.filter((_, index) => this.visibility[index]);
    },
    brokenCompteurs() {
      return this.visibility.map((visible, index) => !visible ? index : null).filter(index => index !== null);
    }
  },

  methods: {
    checkVictory() {
      if (this.visibility.every(v => !v)) {
        this.victoire = true;
        this.launchConfetti();
      }
    },

    testBreakCounter() {
      for (let i = this.visibility.length - 1; i >= 0; i--) {
        if (this.visibility[i]) {
          this.visibility[i] = false;
          this.checkVictory();
          break;
        }
      }
    },

    launchConfetti() {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
};
</script>

<style scoped>
.compteurs-defense {
  position: absolute;
  top: 50px;
  right: 50px;
}

.compteur-defense {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 0;
  right: 0;
}

.compteur-casse {
  position: absolute;
  right: 150px;
  top: 18px;
}

.compteur-half {
  position: absolute;

  width: 100%;
  height: 100%;
  object-fit: cover;
}

.left-half {
  left: -145px;
  width: 180px;
  height: 250px;

  animation: break-left 1s ease-in-out forwards;
}

.right-half {
  right: -145px;
  width: 185px;
  height: 255px;
  animation: break-right 1s ease-in-out forwards;
}

@keyframes break-left {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(-20%) rotate(-15deg) scale(1) translateY(20%);
    opacity: 0;
  }
}

@keyframes break-right {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateX(20%) rotate(15deg) scale(1) translateY(20%);
    opacity: 0;
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 999;
}

.glitch-text-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  text-align: center;
}

.glitch {
  font-size: 5rem;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #009eff, 0.025em 0.04em 0 #ff4d00;
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
    text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #009eff, 0.025em 0.04em 0 #ff4d00;
  }
  15% {
    text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #009eff, 0.025em 0.04em 0 #ff4d00;
  }
  16% {
    text-shadow: -0.05em -0.025em 0 #ff0000, 0.025em 0.035em 0 #009eff, -0.05em -0.05em 0 #ff4d00;
  }
  49% {
    text-shadow: -0.05em -0.025em 0 #ff0000, 0.025em 0.035em 0 #009eff, -0.05em -0.05em 0 #ff4d00;
  }
  50% {
    text-shadow: 0.05em 0.035em 0 #ff0000, 0.03em 0 0 #009eff, 0 -0.04em 0 #ff4d00;
  }
  99% {
    text-shadow: 0.05em 0.035em 0 #ff0000, 0.03em 0 0 #009eff, 0 -0.04em 0 #ff4d00;
  }
  100% {
    text-shadow: -0.05em 0 0 #ff0000, -0.025em -0.04em 0 #009eff, -0.04em -0.025em 0 #ff4d00;
  }
}

/* Style pour le bouton */
.test-break-btn {
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
  z-index: 1000;
}
</style>
