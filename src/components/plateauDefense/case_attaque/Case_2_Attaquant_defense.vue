<template>
  <div class="topReader2_attaque">
    <img v-if="image" :src="getImagePath(image)" alt="Attack Card"
         :class="{'attack-card2': !hasEntered}"
         class="attack-card"
         ref="attackingCard2">

  </div>
</template>


<script>
import 'animate.css'
import io from "socket.io-client";
import fonctionnaliteDefense from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import {gsap} from "gsap";
import {aFiniAttaque} from "@/components/plateauDefense/case_attaque/Case_1_Attaquant_defense.vue";
import {defaite} from "@/components/plateauDefense/TourAttaquant_defense.vue";
import {ref, watch} from "vue";

export let aFiniAttaque2 = ref(false);
let emplacement;
let carteAttaquante
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
      gauche: -680,
      milieu: -230,
      droite: 230,
      stockage: 680,
      hasEntered: false
    }
  },
  mounted() {
    this.socket = io('http://localhost:3001');
    this.socket.on('rfidData', (data) => {

      let {readerID} = data;
      if (readerID === '1)') {
        //Lance l'attaque suivante lorsque la première a terminé la sienne
        watch(aFiniAttaque, (newVal) => {
          setTimeout(() => {
            this.hasEntered = true;
            //Vérifie si la première attaque a bien été effectué et si la partie n'est pas terminée
            if (newVal === true && !defaite.value) {
              //Retrouve la carte attaquante
              carteAttaquante = deckAttaque.find(carte => carte.name === this.readers[1].name);

              //Lance deux attaques si la carte attaquante est l'Anonymous
              if (carteAttaquante.name === "Anonymous") {
                this.attaquerAnimation(false);
                setTimeout(() => {
                  this.attaquerAnimation(true)
                }, 3000)

              } else {
                this.attaquerAnimation(true);
              }
            }
          }, 1000);
          aFiniAttaque.value = false;
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
      const deplacementY = 420;
      const attackingCard = this.$refs.attackingCard2;
      console.log("Attacking card :", attackingCard);

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
            y: deplacementY,
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
     * @param deuxiemeAttaque si true, termine l'attaque, si false ne la termine pas
     */
    attaquerAnimation(deuxiemeAttaque) {
      //Retrouve l'emplacement de la carte en défense
      emplacement = this.findEmplacement();

      //Lance l'animation
      this.attaquerCarteAnimation(emplacement);

      //Attend que l'animation soit terminée avant de lancer la fonction d'attaque
      setTimeout(() => {
        fonctionnaliteDefense.methods.attaquer(this.readers, carteAttaquante);
        if (deuxiemeAttaque) {
          aFiniAttaque2.value = false;
        }
      }, 2500)
      setTimeout(() => {
        if (this.readers[1].image === null)
          this.hasEntered = true;
      },2501)
    },

    /**
     * Trouve l'emplacement de la carte en défense
     * @returns {number} coordonnée X de la carte en défense
     */
    findEmplacement() {
      //Retrouve le reader qui contient la carte qui va défendre
      let carteDefense = this.readers.find(carte => carteAttaquante.counter.includes(carte.name));
      //Retrouves les coordonnées auxquelles la carte doit se déplacer
      if (carteDefense === undefined) {
        emplacement = 0;
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
            emplacement = 0;
        }
      }
      return emplacement
    }
  }
};
</script>


<style scoped>
.topReader2_attaque {
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
.attack-card2 {
  animation: slideInDown; /* referring directly to the animation's @keyframe declaration */
  animation-duration: 1s; /* don't forget to set a duration! */
}
.attack-card {
  height: 420px;
  position: fixed;
}
</style>