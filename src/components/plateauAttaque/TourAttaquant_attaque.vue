<template>
  <div>
    <!-- Affichage des compteurs -->
    <div class="compteurs-attaque">
      <img v-for="(image, index) in images_compteur" :key="index" :src="image" alt="Stacked Image"
           :style="{ visibility: visibility[index] ? 'visible' : 'hidden' }"
           class="compteur-attaque">
    </div>

    <div v-if="errorVisible" class="test-Image">
      <img src="../../img/UserMessage.png" alt="" class="image"/>
      <div class="overlay-image">{{ userMessage }}</div>
    </div>

    <!-- Filtre noir et blanc et message de défaite s'affiche si tous les tours sont épuisés -->
    <div v-if="hasLost">
      <!-- Filtre noir et blanc sur l'arrière-plan -->
      <div class="overlay"></div>

      <!-- Message de défaite -->
      <div class="glitch-text-container">
        <p class="glitch">
          <span aria-hidden="true">Le système a résisté à vos attaques</span>
          Le système a résisté à vos attaques
          <span aria-hidden="true">Le système a résisté à vos attaques</span>
        </p>
        <button class="close-Page" onclick="window.close()"><b>MENU</b></button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import {ref, watch} from "vue";
export let hasLostAttack = false;
export let isTurnEnding = ref(false);
export let userMessageAttack = ref("");
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
      hasLost: false, // Variable qui indique si le joueur a hasLostAttack
      messageVisible : false,
      userMessage: '',
      errorVisible: false
    };
  },

  mounted() {
    userMessageAttack.value = "A toi de jouer, pioche 6 cartes";
    setTimeout(() => {
      this.showUserMessageAttack(userMessageAttack.value);
    }, 1000);

    this.socket = io('http://localhost:3000');
    this.socket.on('rfidData', (data) => {
      const { readerID } = data;

      if (readerID === '7)')
        userMessageAttack.value = "Cette case n'est pas disponible en attaque";

      // Vérifier si le readerID est 1
      if (readerID === '1)') {
        this.updateVisibility();
        userMessageAttack.value = "FIN DE TOUR";
      }
    });

    //Obsèrve si le joueur termine son tour, si c'est le cas, affiche un message temporaire
    watch(isTurnEnding, () => {
        userMessageAttack.value = "A toi de jouer, pioche des cartes jusqu'à en avoir 5";
    });

    watch(userMessageAttack, (newVal, oldValue) => {
      if (oldValue !== newVal && newVal !== ""){
        this.showUserMessageAttack(userMessageAttack.value);
      }

      setTimeout(() => {
        userMessageAttack.value ="";
      }, 3000)
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

      // Vérifier si tous les compteurs sont masqués, le joueur a hasLostAttack
      if (this.visibility.every(v => !v)) {
        this.hasLost = true;
        hasLostAttack = true
      }
    },

    /**
     * Affiche un message temporaire
     * @param message userMessage à afficher
     */
    showUserMessageAttack(message){
      this.userMessage = message;
      this.errorVisible = true;
      setTimeout(() => {
        this.errorVisible = false;
      },3000)
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

/* Conteneur pour centrer le userMessage */
.glitch-text-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.glitch {
  font-size: 5rem;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #009eff,
  0.025em 0.04em 0 #ff4d00;
  animation: glitch 725ms infinite;
}


/* Conteneur pour centrer le userMessage */
.glitch-text-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.glitch {
  font-size: 5rem;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #009eff,
  0.025em 0.04em 0 #ff4d00;
  animation: glitch 725ms infinite;
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

.overlay-image {
  /* Taille, couleur et espacement du userMessage */
  font-size: 50px;
  font-weight: bold;
  color: rgb(255, 255, 255);
  letter-spacing: 0.05em;
  line-height: 1;
  text-align: center;
  text-shadow: 0.05em 0 0 #ff0000, -0.03em -0.04em 0 #009eff,
  0.025em 0.04em 0 #ff4d00;
  animation: glitch 725ms infinite;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
}
.test-Image {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 43.5%;
  left: 0;
  text-align: center;
  z-index: 1;
  font-weight: bold;
}
.image {
  height: 175px;
  width: 850px;
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