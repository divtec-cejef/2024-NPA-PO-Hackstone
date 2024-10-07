<template>
  <div>
    <!-- Affichage des compteurs -->
    <div class="compteurs-attaque">
      <img v-for="(image, index) in images_compteur" :key="index" :src="image" alt="Stacked Image"
           :style="{ visibility: visibility[index] ? 'visible' : 'hidden' }"
           class="compteur-attaque">
    </div>

    <!-- Bouton pour retirer un compteur à la fois -->

    <!-- Filtre noir et blanc et message de défaite s'affiche si tous les tours sont épuisés -->
    <div v-if="hasLost">
      <!-- Filtre noir et blanc sur l'arrière-plan -->
      <div class="overlay"></div>

      <!-- Message de défaite à la manière de GTA V, qui reste visible -->
      <div class="wasted-message">
        <h1>VOUS AVEZ PERDU !</h1>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
export let perdu = false;

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
      visibility: [true, true, true, true, true], // Tous les compteurs sont visibles au début
      hasLost: false // Variable qui indique si le joueur a perdu
    };
  },

  mounted() {
    this.socket = io('http://localhost:3000');

    this.socket.on('rfidData', (data) => {
      const { readerID } = data;

      // Vérifier si le readerID est 1
      if (readerID === '1)') {
        this.updateVisibility();
      }
    });
  },
  methods: {
    updateVisibility() {
      // Boucle pour masquer les compteurs un par un
      for (let i = this.visibility.length - 1; i >= 0; i--) {
        if (this.visibility[i]) {
          this.visibility[i] = false;
          break;
        }
      }

      // Vérifier si tous les compteurs sont masqués, le joueur a perdu
      if (this.visibility.every(v => !v)) {
        this.hasLost = true;
        perdu = true
      }
    }
  }
};
</script>

<style scoped>
.compteurs-attaque {
  position: absolute;
  bottom: 50px;
  left: 50px; /* Positionner les images en haut à droite */
}

.compteur-attaque {
  width: 300px;
  height: 300px;
  position: absolute;
  bottom: 0;
  left: 0;
}

/* Style pour le filtre noir et blanc avec effet flou */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Filtre sombre */
  backdrop-filter: grayscale(100%) blur(5px); /* Applique un effet noir et blanc et flou */
  z-index: 999; /* S'assure que le filtre soit en dessous du message */
}

/* Style pour le message de défaite "VOUS AVEZ PERDU" qui reste visible */
.wasted-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1); /* Centrer et effet de zoom initial */
  color: red; /* Couleur rouge classique de GTA */
  text-transform: uppercase; /* Tout en majuscules */
  font-size: 40px; /* Taille du texte */
  font-family: Impact,serif;
  text-align: center;



  opacity: 1;
  animation: wasted-animation 1s ease-out forwards; /* Animation de zoom, sans fade-out */
  z-index: 1000; /* S'assure que le message soit au-dessus du filtre */
}

/* Animation pour le message (sans disparition) */
@keyframes wasted-animation {
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
  z-index: 1000;
}
</style>