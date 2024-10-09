<template>
  <div class="topReader3_attaque">
    <img v-if="image" :src="getImagePath(image)" alt="Attack Card" class="attack-card3" ref="attackingCard3">
    <p v-else >{{id}}</p>
  </div>
</template>


<script>
import io from "socket.io-client";
import fonctionnaliteDefense from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import {gsap} from "gsap";
import {ref, watch} from "vue";
import {aFiniAttaque2} from "@/components/plateauDefense/case_attaque/Case_2_Attaquant_defense.vue";
import {delais} from "@/components/plateauDefense/case_attaque/Case_1_Attaquant_defense.vue";
let delaisAnonymous = 1;
export let finTour = ref(false)
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
      stockage: 230
    }
  },
  mounted() {

    this.socket = io('http://localhost:3001');

    this.socket.on('rfidData', (data) => {
      let {readerID} = data;
      //Vérifie si la carte scannée est la bonne et si la partie n'est pas terminée
      if (readerID === '1)') {
        watch(aFiniAttaque2, (newVal) => {
          setTimeout(() => {
            if (newVal === true) {
              carteAttaquante = deckAttaque.find(carte => carte.name === this.readers[4].name);
              console.log("la carte la", carteAttaquante)
              //Animation d'attaque
              if (carteAttaquante.name === "Anonymous") {
                delaisAnonymous = 2500;
                this.attaquerAnimation();

                setTimeout(() => {
                  this.attaquerAnimation()
                },2500)

              }else
                this.attaquerAnimation();
              setTimeout(() => {
                finTour.value = true;
              },delaisAnonymous)
            }
          },delais);
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
    attaquerCarteCase2(deplacementX) {
      const deplacementY = 420;
      const attackingCard = this.$refs.attackingCard3;
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
    attaquerAnimation(){
      emplacement = this.findEmplacement();
      this.attaquerCarteCase2(emplacement);
      setTimeout(() => {
        fonctionnaliteDefense.methods.attaquer(this.readers, carteAttaquante);
      }, 2500)
    },
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
}
.attack-card3 {
  height: 100%;
}
</style>