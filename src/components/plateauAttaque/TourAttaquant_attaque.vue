<template>
  <div class="container">
    <!-- Affichage des compteurs -->
    <div class="compteurs-attaque">
      <img v-for="(image, index) in visibleCompteurs" :key="index" :src="image" alt="Stacked Image"
           class="compteur-attaque">

      <!-- Images cassées superposées lorsque le compteur est cassé -->
      <div v-for="brokenIndex in brokenCompteurs" :key="'broken-' + brokenIndex" class="compteur-casse">
        <img :src="brokenImagesLeft[brokenIndex]" alt="Compteur Gauche" class="compteur-half left-half" />
        <img :src="brokenImagesRight[brokenIndex]" alt="Compteur Droit" class="compteur-half right-half" />
      </div>
    </div>

    <!-- Bouton pour retirer un compteur à la fois -->
    <button @click="updateVisibility" class="test-defeat-btn">Retirer un compteur</button>

    <!-- Filtre noir et blanc et message de défaite s'affiche si tous les tours sont épuisés -->
    <div v-if="hasLost">
      <!-- Filtre noir et blanc sur l'arrière-plan -->
      <div class="overlay"></div>

      <!-- Message de défaite -->
      <div class="resist-message">
        <h1>Le système a résisté à vos attaques</h1>
      </div>
    </div>
  </div>
</template>

<script>
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
      visibility: [true, true, true, true, true], // Tous les compteurs sont visibles au début
      hasLost: false // Variable qui indique si le joueur a perdu
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
      }
    }
  }
};
</script>

<style scoped>
.container {
  text-align: center;
  overflow: hidden;
  height: 100vh;
}

.compteurs-attaque {
  position: absolute;
  bottom: 50px;
  left: 50px;
}

.compteur-attaque {
  width: 300px;
  height: 300px;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: transform 1s ease-in-out, opacity 1s ease-in-out;
}

/* Styles pour le compteur cassé superposé */
.compteur-casse {
  position: absolute;
  width: 300px;
  height: 300px;
  top: -250px;
  left: -3px;
}

.compteur-half {
  position: absolute;
  width: 50%;
  height: 100%;
  object-fit: cover;
}

.left-half {
  left: 0;
  animation: break-left 1s ease-in-out forwards;
}

.right-half {
  right: 0;
  animation: break-right 1s ease-in-out forwards;
}

/* Animation pour "casser" le compteur */
@keyframes break-left {
  0% {
    transform: rotate(0deg) scale(1) translateX(10%) translateY(-18%);
    opacity: 1;
  }
  100% {
    transform: translateX(-0%) scale(1);
    opacity: 0;
  }
}

@keyframes break-right {
  0% {
    transform: rotate(0deg) scale(1) translateX(-10%) translateY(-18%);
    opacity: 1;
  }
  100% {
    transform: translateX(0%) scale(1);
    opacity: 0;
  }
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

/* Style pour le message de défaite "LE SYSTÈME A RÉSISTÉ À VOS ATTAQUES" */
.resist-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1); /* Centrer et effet de zoom initial */
  color: red; /* Couleur verte pour signifier la résistance */
  font-size: 40px; /* Taille du texte */
  font-family: Impact, serif;
  text-align: center;

  opacity: 1;
  animation: resist-animation 1s ease-out forwards; /* Animation de zoom, sans fade-out */
  z-index: 1000; /* S'assure que le message soit au-dessus du filtre */
}

/* Animation pour le message (sans disparition) */
@keyframes resist-animation {
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
}
</style>