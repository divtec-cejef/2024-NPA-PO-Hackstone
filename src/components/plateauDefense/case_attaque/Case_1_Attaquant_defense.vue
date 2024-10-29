<template>
  <div class="topReader1_attaque">
    <img v-if="image" :src="getImagePath(image)" alt="Attack Card" class="attack-card1" ref="attackingCard1">
  </div>
</template>

<script>
import io from "socket.io-client";
import fonctionnaliteDefense from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import {gsap} from "gsap";
import {ref} from "vue";

let deckAttaque = fonctionnaliteDefense.methods.genererDeckAttaque();
let emplacement;
let carteAttaquante;
export let aFiniAttaque = ref(false);

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
    }
  },
  mounted() {
    this.socket = io('http://localhost:3001');
    this.socket.on('rfidData', (data) => {
      let {readerID} = data;
      if (readerID === '1)') {

        setTimeout(() => {
          //Retrouve la carte qui attaque
          carteAttaquante = deckAttaque.find(carte => carte.name === this.readers[0].name);

          //Si la carte qui attaque est l'anonymous, attaque deux fois, sinon, attaque une seule fois
          if (carteAttaquante.name === "Anonymous") {
            this.attaquerAnimation(false);

            //Attend que la première attaque soit terminée avant de lancer la deuxième
            setTimeout(() => {
              this.attaquerAnimation(true);
            }, 2500)
          } else
            this.attaquerAnimation(true);

        },1000);
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
      const DEPLACEMENT_Y = 420;
      const ATTACKING_CARD = this.$refs.attackingCard1;

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
            delay: 0.6
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
      this.attaquerCarteAnimation(emplacement);

      //Attend que l'animation soit terminée avant de lancer la fonction d'attaque
      setTimeout(() => {
        fonctionnaliteDefense.methods.attaquer(this.readers, carteAttaquante);
        if (deuxiemeAttaque)
          aFiniAttaque.value = true;
      }, 2500)
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

}
.attack-card1 {
  height: 100%;
}
</style>