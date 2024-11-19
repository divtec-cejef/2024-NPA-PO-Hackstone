<template>
  <div class="topReader1_attaque">
    <img v-if="image" :src="getImagePath(image)" alt="Attack Card"
         :class="{'attack-card1_def': !hasEntered}"
         :id ="canAttack ? 'flame_case1' : ''"
         class="attack-card_def"
         ref="attackingCard1_def">
  </div>
</template>

<script>
import io from "socket.io-client";
import fonctionnaliteDefense from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import {gsap} from "gsap";
import {ref, watch} from "vue";
import 'animate.css'
import caseAttaquant_defense from "@/components/plateauDefense/case_attaque/CaseAttaquant_defense.vue";
let deckAttaque = fonctionnaliteDefense.methods.genererDeckAttaque();
let emplacement;
let delaisAnonymous = 2500;
let carteAttaquante;
let DEPLACEMENT_Y = 420;

export let aFiniAttaque = ref(false);
export let peutAttaquer = ref(false);

export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    readers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      ref: "attackingCard",
      gauche: -230,
      milieu: 230,
      droite: 680,
      stockage: 1140,
      pv: 455,
      hasEntered : false,
      canAttack : false
    }
  },
  mounted() {

    this.socket = io('http://localhost:3001');
    this.socket.on('rfidData', (data) => {
      let {readerID} = data;
      //Affiche une lueur rouge autour de la carte lorsqu'elle peut attaquer
      watch(peutAttaquer, (newVal) => {
        console.log("allo", newVal)
        if (newVal)
          this.canAttack = newVal
        else
          this.canAttack = newVal
      });
      if (readerID === '1)') {
        setTimeout(() => {
          this.hasEntered = true;
          //Retrouve la carte qui attaque
          carteAttaquante = deckAttaque.find(carte => carte.name === this.readers[0].name);

          //Si la carte qui attaque est l'anonymous, attaque deux fois, sinon, attaque une seule fois
          if (carteAttaquante.name === "Anonymous") {
            this.attaquerAnimation(false);
            caseAttaquant_defense.methods.showRedBorder(DEPLACEMENT_Y);

            //Attend que la première attaque soit terminée avant de lancer la deuxième
            setTimeout(() => {
              this.attaquerAnimation(true);
              caseAttaquant_defense.methods.showRedBorder(DEPLACEMENT_Y);

            }, 2500)
          } else {
            this.attaquerAnimation(true);
            caseAttaquant_defense.methods.showRedBorder(DEPLACEMENT_Y);
          }
        },2000);
      }
    });

  },
  methods: {
    /**
     * Retrouve le chemin d'une image
     * @param image image a retrouvée
     * @returns {*} le chemin de l'image
     */
    getImagePath(image) {
      try {
        return require(`@/${image}`);
      } catch (e) {
        console.error("Image not found:", image);
        return '';
      }
    },

    /**
     * Lance l'animation d'attaque
     * @param deplacementX emplacement de la carte en défense
     */
    attaquerCarteAnimation(deplacementX) {
      DEPLACEMENT_Y = 420;
      if(deplacementX === this.pv)
        DEPLACEMENT_Y = 800
      const ATTACKING_CARD = this.$refs.attackingCard1_def;

      if (!ATTACKING_CARD) {
        console.error("La carte attaquante n'est pas disponible.");
        return;
      }

      const tl = gsap.timeline();
      tl.to(ATTACKING_CARD, {
        duration: 0.3,
        scale: 1.1,
        ease: "power2.inOut"
      })
          .to(ATTACKING_CARD, {
            duration: 0.3,
            y: DEPLACEMENT_Y,
            x: deplacementX,
            scale: 1,
            ease: "power2.inOut",
            delay: 0.6,
          })

          .to(ATTACKING_CARD, {
            duration: 0.3,
            y: 0,
            x: 0,
            ease: "power2.inOut",
          });
    },

    /**
     * Regroupe l'animation ainsi que la fonction d'attaque avec les bons timings
     * @param deuxiemeAttaque si true, termine l'attaque, si false ne la termine pas
     */
    attaquerAnimation(deuxiemeAttaque) {
      //Retrouve l'emplacement de la carte en défense
      emplacement = this.findEmplacement();
      //Lance l'animation
      if (this.readers[0].name !== null) {
        this.attaquerCarteAnimation(emplacement);
        setTimeout(() => {
          fonctionnaliteDefense.methods.attaquer(this.readers, carteAttaquante);
        }, 2500)
      }

      //Attend que l'animation soit terminée avant de lancer la fonction d'attaque
      if (deuxiemeAttaque || this.readers[0].name === null && deuxiemeAttaque) {
        if (this.readers[0].name === null)
          delaisAnonymous = 100;
        setTimeout(() => {
          aFiniAttaque.value = true;
          peutAttaquer.value = false
          if (this.readers[0].image === null)
            this.hasEntered = false;
        }, delaisAnonymous)
      }
    },

    /**
     * Trouve l'emplacement de la carte en défense
     * @returns {number} coordonnée X de la carte en défense
     */
    findEmplacement() {
      console.log(carteAttaquante)
      let carteDefense = undefined;
      //Retrouve le reader qui contient la carte qui va défendre
      let readersID = [2, 3, 5, 6]
      for (let i = 0; i < this.readers.length; i++) {
        let carteEnCours = this.readers[readersID[i]];
        if (carteEnCours !== undefined) {
          if (carteAttaquante.counter.includes(carteEnCours.name)) {
            carteDefense = carteEnCours;
            break;
          }
        }
      }
      //Retrouves les coordonnées auxquelles la carte doit se déplacer
      if (carteDefense === undefined) {
        emplacement = this.pv;
      } else {
        switch (carteDefense.id) {
          case 3 :
            emplacement = this.gauche;
            break;
          case 4 :
            emplacement = this.milieu;
            break;
          case 6 :
            emplacement = this.droite;
            break;
          case 7 :
            emplacement = this.stockage;
            break;
          default:
            emplacement = this.pv;
        }
      }
      return emplacement
    },
  }
};
</script>


<style scoped>
.topReader1_attaque {
  width: 300px;
  height: 420px;
  background-size: 100%;
  border-width: 4px;
  border-style: solid;
  border-color: white;
  border-image: initial;
  font-size: 24px;
  justify-content: center;
  display: flex;
  align-items: center;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.5);
  margin-bottom: 200px;
}
.attack-card1_def {
  animation: slideInDown;
  animation-duration: 1s;
}
.attack-card_def {
  height: 420px;
  position: fixed;
}

img#flame_case1 {
  height: 420px;
  position: relative;
  display: block;
  border: 2px transparent;
  animation:  flame 2s infinite ease-in-out;
}

@keyframes flame {
  0% {
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8),
    0 0 30px rgba(255, 0, 0, 0.6),
    0 0 40px rgba(255, 69, 0, 0.5),
    0 0 50px rgba(255, 0, 0, 0.4);
  }
  25% {
    box-shadow: 0 0 25px rgba(255, 0, 0, 0.9),
    0 0 35px rgba(255, 69, 0, 0.7),
    0 0 45px rgba(255, 0, 0, 0.6),
    0 0 55px rgba(255, 69, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 0, 0, 1),
    0 0 40px rgba(255, 69, 0, 0.8),
    0 0 50px rgba(255, 0, 0, 0.7),
    0 0 60px rgba(255, 69, 0, 0.6);
  }
  75% {
    box-shadow: 0 0 25px rgba(255, 0, 0, 0.9),
    0 0 35px rgba(255, 69, 0, 0.7),
    0 0 45px rgba(255, 0, 0, 0.6),
    0 0 55px rgba(255, 69, 0, 0.5);
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8),
    0 0 30px rgba(255, 0, 0, 0.6),
    0 0 40px rgba(255, 69, 0, 0.5),
    0 0 50px rgba(255, 0, 0, 0.4);
  }
}
</style>