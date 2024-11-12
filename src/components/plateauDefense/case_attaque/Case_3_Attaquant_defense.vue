<template>
  <div class="topReader3_attaque">
    <img v-if="image" :src="getImagePath(image)" alt="Attack Card"
         :class="{'attack-card3_def': !hasEntered}"
         class="attack-card_def"
         :id ="canAttack3 ? 'flame_case3' : ''"
         ref="attackingCard3_def">

  </div>
</template>


<script>
import 'animate.css'
import io from "socket.io-client";
import fonctionnaliteDefense from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import {gsap} from "gsap";
import {ref, watch} from "vue";
import {aFiniAttaque2} from "@/components/plateauDefense/case_attaque/Case_2_Attaquant_defense.vue";
import {defaite} from "@/components/plateauDefense/TourAttaquant_defense.vue";

export let peutAttaquerCase3 = ref (false);
export let finTour = ref(false)
let delaisAnonymous = 1;
let emplacement;
let carteAttaquante;
let deckAttaque = fonctionnaliteDefense.methods.genererDeckAttaque();

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
      gauche: -1140,
      milieu: -680,
      droite: -230,
      stockage: 230,
      pv: -455,
      hasEntered: false,
      canAttack3: false
    }
  },
  mounted() {
    this.socket = io('http://localhost:3001');
    this.socket.on('rfidData', (data) => {

      watch(peutAttaquerCase3, (newVal) => {
        this.canAttack3 = newVal
      });

      let {readerID} = data;
      if (readerID === '1)') {
        //Lance l'attaque suivante lorsque la première a terminé la sienne
        watch(aFiniAttaque2, (newVal) => {
          setTimeout(() => {
            this.hasEntered = true;
            //Vérifie si la première attaque a bien été effectué et si la partie n'est pas terminée
            if (newVal === true && !defaite.value) {
              //Retrouve la carte attaquante
              carteAttaquante = deckAttaque.find(carte => carte.name === this.readers[4].name);

              //Lance deux attaques si la carte attaquante est l'Anonymous
              if (carteAttaquante.name === "Anonymous") {
                delaisAnonymous = 3000;
                this.attaquerAnimation(false);

                setTimeout(() => {
                  this.attaquerAnimation(true)
                },4000)

              }else
                this.attaquerAnimation(true);
              setTimeout(() => {
                finTour.value = true;
              },delaisAnonymous)

            }
          },1000);
          aFiniAttaque2.value = false;
        });
      }
    });
  },
  methods: {
    getImagePath(image) {
      if (image) {
        try {
          return require(`@/${image}`);
        } catch (e) {
          console.error("Image non trouvée :", image);
        }
      }
      return require('@/img/img_carte/img_attaque/anonymous.png');
    },

    /**
     * Lance l'animation d'attaque
     * @param deplacementX emplacement de la carte en défense
     */
    attaquerCarteAnimation(deplacementX) {
      let DEPLACEMENT_Y = 420;
      if(deplacementX === this.pv)
        DEPLACEMENT_Y= 800
      const attackingCard = this.$refs.attackingCard3_def;

      if (!attackingCard) {
        console.error("La carte attaquante n'est pas disponible.");
        return;
      }

      const tl = gsap.timeline();
      tl.to(attackingCard, {
        duration: 0.3,
        scale: 1.1,
        ease: "power2.inOut"
      })
          .to(attackingCard, {
            duration: 0.3,
            y: DEPLACEMENT_Y,
            x: deplacementX,
            scale: 1,
            ease: "power2.inOut",
            delay: 0.6
          })
          .to(attackingCard, {
            duration: 0.3,
            y: 0,
            x: 0,
            ease: "power2.inOut",
          });
    },

    /**
     * Regroupe l'animation ainsi que la fonction d'attaque avec les bons timings
     */
    attaquerAnimation(derniereAttaque){
      //Retrouve l'emplacement de la carte en défense
      emplacement = this.findEmplacement();
      this.attaquerCarteAnimation(emplacement);
      if (this.readers[4].name !== null) {
        setTimeout(() => {
          fonctionnaliteDefense.methods.attaquer(this.readers, carteAttaquante);
        }, 2000)
      }
      if (derniereAttaque || this.readers[4].name === null && derniereAttaque) {
        setTimeout(() => {
          peutAttaquerCase3.value = false;
          if (this.readers[4].name === null)
            this.hasEntered = false;

        }, 2001)
      }
    },

    /**
     * Trouve l'emplacement de la carte en défense
     * @returns {number} coordonnée X de la carte en défense
     */
    findEmplacement() {
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
    }
  }
};
</script>


<style scoped>
.topReader3_attaque {
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

}
.attack-card3_def {
  animation: slideInDown; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1s; /* don't forget to set a duration! */
}
.attack-card_def {
  height: 420px;
  position: fixed;
}


img#flame_case3 {
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