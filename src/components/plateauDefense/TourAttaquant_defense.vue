<template>
  <div>
    <!-- Affichage des compteurs -->
    <div class="compteurs-defense">
      <img v-for="(image, index) in images_compteur" :key="index" :src="image" alt="Stacked Image"
           :style="{ visibility: visibility[index] ? 'visible' : 'hidden' }"
           class="compteur-defense">
    </div>
    <div v-if="messageVisibleDefense && !victoire" class="message">
      <img v-if="tourAdverseDefense" class="imageFinDeTour" src="../../img/FinDeTour%202.png" alt="Fin de tour"/>
      <img v-else class="imageFinDeTour" src="../../img/AVousDeJouer%202.png" alt="Fin de tour"/>
    </div>
    <!-- Message de victoire s'affiche au centre si victoire -->
    <div v-if="victoire">
      <div class="overlay"></div>
      <div class="victoire-message">🎉 Victoire ! 🎉</div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import confetti from 'canvas-confetti';
import {ref, watch} from "vue";
export let defaite = ref(false);
export let finDeTourDefense = ref(false)
export default {
  data() {
    return {
      socket: null,
      images_compteur: [
        require('@/img/compteur/compteur_1.png'),
        require('@/img/compteur/compteur_2.png'),
        require('@/img/compteur/compteur_3.png'),
        require('@/img/compteur/compteur_4.png'),
        require('@/img/compteur/compteur_5.png')
      ],
      visibility: [true, true, true, true, true],
      victoire: false, // Variable qui déclenche la victoire
      messageVisibleDefense : false,
      tourAdverseDefense : true
    };
  },

  mounted() {
    this.socket = io('http://localhost:3001');

    this.socket.on('rfidData', (data) => {
      const {readerID} = data;
      // Vérifier si le readerID est 1
      if (readerID === '1)') {
        this.showMessageDefense();
      }
    });
    watch(finDeTourDefense, (newVal) => {
     console.log("AALKALKS", finDeTourDefense)
      if (newVal === true && defaite.value === false) {
        this.showMessageDefense();
        this.updateVisibility();
      }else if (newVal === false && defaite.value === false) {
        this.showMessageDefense();
        this.updateVisibility();
      }

    });
  },

  methods: {
    checkVictory() {
      if (this.visibility.every(v => v === false)) {
        this.victoire = true; // Afficher le message de victoire
        this.launchConfetti(); // Lancer les confettis
      }
    },

    updateVisibility() {
      for (let i = this.visibility.length - 1; i >= 0; i--) {
        if (this.visibility[i]) {
          // Appliquer l'animation uniquement pour le dernier compteur
          if (i === 0) {
            const counterElement = document.querySelectorAll('.compteur-defense')[i];
            counterElement.classList.add('last-counter-animation');

            // Attendre la fin de l'animation avant de le cacher
            setTimeout(() => {
              this.visibility[i] = false;
              this.checkVictory(); // Vérifier la victoire après l'animation
            }, 1000); // Correspond à la durée de l'animation
          } else {
            this.visibility[i] = false;
          }
          break;
        }
      }
    },

    launchConfetti() {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: {y: 0.6}
      });
    },
    showMessageDefense() {
      console.log("JE le fais la")
      console.log("Tour adverse", this.tourAdverseDefense);
      // Affiche le message
      this.tourAdverseDefense = !this.tourAdverseDefense;
      this.messageVisibleDefense = true;

      // Cache le message après 2 secondes
      setTimeout(() => {
        this.messageVisibleDefense = false;
      }, 2000); // 2000 millisecondes = 2 secondes
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

/* Style pour l'overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6); /* Filtre lumineux */
  z-index: 999;
}

/* Style pour le message de victoire */
.victoire-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #28a745;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 3em;
  font-weight: bold;
  z-index: 1000;
  animation: pop-in 1s ease-out; /* Animation du message */
}

/* Animation d'apparition du message de victoire */
@keyframes pop-in {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes shrinkAndFadeOut {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}
.message {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 43.5%;
  left: 0;
  text-align: center;
  z-index: 1;
}
.imageFinDeTour {
  height: 175px;
}

</style>
