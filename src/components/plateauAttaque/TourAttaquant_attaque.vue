<template>
  <div>
    <!-- Affichage des compteurs -->
    <div class="compteurs-attaque">
      <img v-for="(image, index) in images_compteur" :key="index" :src="image" alt="Stacked Image"
           :style="{ visibility: visibility[index] ? 'visible' : 'hidden' }"
           class="compteur-attaque">
    </div>
    <div v-if="messageVisible && !hasLost" class="message">
      <img v-if="tourAdverse" class="imageFinDeTour" src="../../img/FinDeTour%202.png" alt="Fin de tour"/>
      <img v-else class="imageFinDeTour" src="../../img/AVousDeJouer%202.png" alt="Fin de tour"/>
    </div>

    <div v-if="errorVisible" class="test-Image">
      <img src="../../img/FinDeTour 2 1.png" alt="" class="image"/>
      <div class="overlay-image">{{ texte }}</div>
    </div>

    <!-- Filtre noir et blanc et message de défaite s'affiche si tous les tours sont épuisés -->
    <div v-if="hasLost">
      <!-- Filtre noir et blanc sur l'arrière-plan -->
      <div class="overlay"></div>

      <!-- Message de défaite -->
      <div class="resist-message">
        <h1>Le système a résisté à vos attaques</h1>
        <button class="close-Page" onclick="window.close()"><b>MENU</b></button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import {ref, watch} from "vue";
export let perdu = false;
export let finDeTour = ref(false);
export let messageErreurAttaque = ref("");
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
      hasLost: false, // Variable qui indique si le joueur a perdu
      messageVisible : false,
      tourAdverse : false,
      texte: '',
      errorVisible: false
    };
  },

  mounted() {
    this.socket = io('http://localhost:3000');

    this.socket.on('rfidData', (data) => {
      const { readerID } = data;

      // Vérifier si le readerID est 1
      if (readerID === '1)') {
        this.updateVisibility();
        this.showMessage();
      }
    });

    //Obsèrve si le joueur termine son tour, si c'est le cas, affiche un message temporaire
    watch(finDeTour, (newVal) => {
      if (newVal === true) {
        this.showMessage();
      }else if (newVal === false)
        this.showMessage();
    });

    watch(messageErreurAttaque, (newVal, oldValue) => {
      if (oldValue !== newVal && newVal !== ""){
        this.showUserError(messageErreurAttaque.value);
      }

      setTimeout(() => {
        messageErreurAttaque.value ="";
      }, 2500)
    })
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
    },

    showMessage() {
      console.log("Je le fait la")
      console.log("tour adverse", this.tourAdverse);
      // Affiche le message
      this.tourAdverse = !this.tourAdverse;
      this.messageVisible = true;

      // Cache le message après 2 secondes
      setTimeout(() => {
        this.messageVisible = false;
      }, 2000); // 2000 millisecondes = 2 secondes
    },

    /**
     * Affiche un message temporaire
     * @param message texte à afficher
     */
    showUserError(message){
      this.texte = message;
      this.errorVisible = true;
      setTimeout(() => {
        this.errorVisible = false;
      },2500)
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
  display: flex;
  flex-direction: column;
  align-items: center;
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
.message {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 43.5%;
  left: 0;
  text-align: center;
}
.imageFinDeTour {
  height: 175px;
}

.overlay-image {
  /* Taille, couleur et espacement du texte */
  font-size: 50px;
  font-weight: normal;
  color: rgb(255, 255, 255);
  letter-spacing: 0.05em;
  line-height: 1;
  text-align: center;
  text-shadow:
    /* Ombre noire plus nette */
      2px 4px 1px rgba(255, 0, 0, 1),
        /* Ombre rouge plus vive */
      4px 6px 1px rgba(0, 38, 255, 1);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 530px;
}
.test-Image {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 43.5%;
  left: 0;
  text-align: center;
  z-index: 1;
}
.image {
  height: 175px;
}
.close-Page {
  border: 3px solid red;
  background-color: red;
  box-shadow: 0 0 50px red;
  transition: transform 0.1s linear;
  width: 270px;
  height: 70px;
  font-size: 40px;
  font-family: 'Orbitron', sans-serif;
  color: white;
  align-items: center;
  border-radius: 100px;
  justify-content: center;
}
button:hover {
  transform: scale(1.1); /* Agrandit le bouton de 10% */
}
</style>