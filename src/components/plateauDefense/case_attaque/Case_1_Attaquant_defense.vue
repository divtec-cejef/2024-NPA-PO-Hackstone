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
      //Vérifie si la carte scannée est la bonne et si la partie n'est pas terminée

      if (readerID === '1)') {
        setTimeout(() => {
          carteAttaquante = deckAttaque.find(carte => carte.name === this.readers[0].name);
          console.log("la carte la 1", carteAttaquante)
          //Animation d'attaque
          if (carteAttaquante.name === "Anonymous") {
            this.attaquerAnimation(false);
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
    attaquerCarteCase2(deplacementX) {
      const deplacementY = 420;
      const attackingCard = this.$refs.attackingCard1;
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
    attaquerAnimation(deuxiemeAttaque) {
      emplacement = this.findEmplacement();
      this.attaquerCarteCase2(emplacement);
      setTimeout(() => {
        fonctionnaliteDefense.methods.attaquer(this.readers, carteAttaquante);
        if (deuxiemeAttaque)
        aFiniAttaque.value = true;
      }, 2500)
    },
    findEmplacement() {
      console.log("Readers", this.readers);
      //Retrouve le reader qui contient la carte qui va défendre
      let carteDefense = this.readers.find(carte => carteAttaquante.counter.includes(carte.name));
      //Retrouves les coordonnées auxquelles la carte doit se déplacer
      if (carteDefense === undefined) {
        emplacement = 0;
      } else {
        console.log("id de la carte", carteDefense.id);
        console.log("carte", carteDefense);
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