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

    <div v-if="messageVisibleDefense && !victoire" class="message">
      <img v-if="tourAdverseDefense" class="imageFinDeTour" src="../../img/FinDeTour%202.png" alt="Fin de tour"/>
      <img v-else class="imageFinDeTour" src="../../img/AVousDeJouer%202.png" alt="Fin de tour"/>
    </div>
    <div v-if="errorVisible" class="test-Image">
      <img src="../../img/FinDeTour 2 1.png" alt="" class="image"/>
      <div class="overlay-image"><b>{{ texte }}</b></div>
    </div>

    <!-- Message de victoire avec effet glitch si victoire -->
    <div v-if="victoire">
      <div class="overlay"></div>
      <div class="glitch-text-container">
        <p class="glitch">
          <span aria-hidden="true">Le système a résisté aux attaques</span>
          Le système a résisté aux attaques
          <span aria-hidden="true">Le système a résisté aux attaques</span>
        </p>
        <button class="close-Page" onclick="window.close()"><b>MENU</b></button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
import {ref, watch} from "vue";
import {poseeDepuis1} from "@/components/plateauDefense/case_attaque/Case_1_Attaquant_defense.vue";
import {poseeDepuis2} from "@/components/plateauDefense/case_attaque/Case_2_Attaquant_defense.vue";
import {poseeDepuis3} from "@/components/plateauDefense/case_attaque/Case_3_Attaquant_defense.vue";
import {messageErreur} from "@/components/plateauDefense/fonctionnaliteDefense.vue";

export let defaite = ref(false);
export let finDeTourDefense = ref(false)
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
      messageVisibleDefense: false,
      tourAdverseDefense: true,
      texte: '',
      errorVisible: false

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
    //Vérifie si le tour précédent est terminé
    watch(finDeTourDefense, (newVal) => {

      if (newVal === true && defaite.value === false) {
        this.showMessageDefense();
        this.updateVisibility();

      } else if (newVal === false && defaite.value === false) {
        this.showMessageDefense();
        this.updateVisibility();
      }

      //Dès que la variable messageErreur est modifié, affiche un message temporaire contenant son texte.
      watch(messageErreur, (newVal, oldValue) => {
        if (oldValue !== newVal && newVal !== ""){
          this.showUserError(messageErreur.value);
        }

        setTimeout(() => {
          messageErreur.value ="";
        }, 2500)
      })
    });
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
      }
    },

    updateVisibility() {
      for (let i = this.visibility.length - 1; i >= 0; i--) {
        if (this.visibility[i]) {
          this.visibility[i] = false;
          this.checkVictory();
          break;
        }
      }
    },

    /**
     * Affiche un message temporaire lors de la fin du tour du défenseur et lors du début de son tour
     */
    showMessageDefense() {
      // Affiche le message
      setTimeout(() => {
        this.tourAdverseDefense = !this.tourAdverseDefense;
        this.messageVisibleDefense = true;
        if (this.tourAdverseDefense) {
          poseeDepuis1.value = true;
          poseeDepuis2.value = true;
          poseeDepuis3.value = true;
        }
      }, 500)
      // Cache le message après 2 secondes
      setTimeout(() => {
        this.messageVisibleDefense = false;
      }, 2500);
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
  display: flex;
  flex-direction: column;
  align-items: center;
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
}.overlay-image {
   /* Taille, couleur et espacement du texte */
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
</style>