<template>
  <div class="compteurs-defense">
    <img v-for="(image, index) in images_compteur" :key="index" :src="image" alt="Stacked Image"
         :style="{ visibility: visibility[index] ? 'visible' : 'hidden' }"
         class="compteur-defense">
  </div>
  <div v-if="victoire" class="victoire-message">Victoire !</div>
</template>

<script>
import io from 'socket.io-client';

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
      victoire: false,
    };
  },

  mounted() {
    this.socket = io('http://localhost:3001');

    this.socket.on('rfidData', (data) => {
      const { readerID } = data;
      this.updateVisibility();
      // Vérifier si le readerID est 1
      if (readerID === '1)') {
        this.updateVisibility();
      }

    });
  },
  methods: {
    checkVictory() {
      if (this.visibility.every(v => v === false)) {
        this.victoire = true; // Afficher le message de victoire
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
  }
};
</script>

<style scoped>
.compteurs-defense {
  position: absolute;
  top: 50px;
  right: 50px; /* Positionner les images en haut à droite */
}

.compteur-defense {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 0;
  right: 0;
}

.victoire-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Pour centrer exactement */
  font-size: 50px;
  color: green;
  font-weight: bold;
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

.last-counter-animation {
  animation: shrinkAndFadeOut 1s forwards; /* L'animation dure 1 seconde */
}

</style>