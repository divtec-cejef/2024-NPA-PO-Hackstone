<template>
  <div class="bottomReader2_attaque">
    <img  v-if="image" :src="getImagePath(image)"
          alt="Attaque Card"
          :class ="{'attack-card': !hasEntered}"
          :id ="canAttack4 ? 'flame_case2' : ''"
          :style="shakeStyle2"
          class="attaque-card2">
  </div>
</template>

<script>
import "animate.css"
import io from "socket.io-client";
import {watch, ref} from "vue";
import {gsap} from "gsap";
import fonctionnaliteesAttaque from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import {UID2}  from "@/components/plateauAttaque/Case_attaquant/CaseAttaquant_attaque.vue";
import {hasLostAttack} from "@/components/plateauAttaque/TourAttaquant_attaque.vue";
import caseAttaquant_attaque from "@/components/plateauAttaque/Case_attaquant/CaseAttaquant_attaque.vue";
let deplacementY = -420

export let peutAttaquerCase2 = ref(false);

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
      ref: "attackingCard2",
      gauche: -680,
      milieu: -230,
      droite: 230,
      stockage: 680,
      pv: 0,
      hasEntered: false,
      canAttack4: false,
      shakeStyle2: {},
    }
  },
  mounted() {
    //Affiche une lueur rouge autour de la carte lorsqu'elle peut attaquer
    watch(peutAttaquerCase2, (newVal) => {
      if (newVal)
        this.canAttack4 = newVal
      else
        this.canAttack4 = newVal
    });

    this.socket = io('http://localhost:3000');
    this.socket.on('rfidData', (data) => {
      let {readerID, card, uid} = data;

      if (readerID === '5)' && !this.canAttack4 && UID2 === uid)
        this.triggerShakeAnimation2()

      //Vérifie si la carte scannée est la bonne et si la partie n'est pas terminée
      if (readerID === '5)' && this.readers[3].name === card.name && UID2 === uid && !hasLostAttack) {
        this.hasEntered = true;

        let emplacement;
        //Retrouve le reader qui contient la carte qui va défendre
        let carteEnDefense = fonctionnaliteesAttaque.methods.trouverCarteDefense(this.readers, card);

        //Retrouves les coordonnées auxquelles la carte doit se déplacer
        if (carteEnDefense === undefined) {
          emplacement = this.pv;
        } else {
          switch (carteEnDefense.id) {
            case 1 :
              emplacement = this.gauche;
              break;
            case 2 :
              emplacement = this.milieu;
              break;
            case 5 :
              emplacement = this.droite;
              break;
            case 7 :
              emplacement = this.stockage;
              break;
            default:
              emplacement = this.pv;
          }
        }
        //Vérifie si la carte remplie les conditions pour attaquer
        if (fonctionnaliteesAttaque.methods.peutAttaquer(card)) {
          this.attaquerCarteCase2(2, emplacement);
          caseAttaquant_attaque.methods.showRedBorder(deplacementY)
          setTimeout(() => {
            fonctionnaliteesAttaque.methods.attaquerNouveau(card, this.readers[3], this.readers);
          }, 2000);
          setTimeout(() => {
            //Réactive l'animation d'entrer si la carte a été détruite
            if (this.readers[3].image === null)
              this.hasEntered = false
          },2001)
        }
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
    attaquerCarteCase2(card_number, deplacementX) {
      deplacementY = -420;
      if (deplacementX === this.pv)
        deplacementY = -800;
      const attackingCard = this.$el.querySelector('.attaque-card'+card_number); // Sélectionne l'élément par classe

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
    triggerShakeAnimation2() {
      this.shakeStyle2 = {}; // Réinitialise le style
      this.$nextTick(() => {
        this.shakeStyle2 = {
          animation: "shakeX2 1s",
        };
        setTimeout(() => {
          this.shakeStyle2 = {}; // Supprime l'animation après
        }, 1000); // Durée de l'animation
      });
    },
  }
};
</script>

<style>
.bottomReader2_attaque {
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
  margin-top: 200px;
}

.attack-card {
  animation: slideInUp;
  animation-duration: 1s;
  position: fixed;
  height: 420px;
}
.attaque-card2 {
  height: 420px;
  position: fixed;
}



img#flame_case2 {
  height: 420px;
  position: relative;
  display: block;
  border: 2px transparent;
  animation:  flame 2s infinite ease-in-out;
}


@keyframes flame {
  0% {
    box-shadow:
        0 0 20px rgba(255, 0, 0, 0.8),
        0 0 30px rgba(255, 0, 0, 0.6),
        0 0 40px rgba(255, 69, 0, 0.5),
        0 0 50px rgba(255, 0, 0, 0.4);
  }
  25% {
    box-shadow:
        0 0 25px rgba(255, 0, 0, 0.9),
        0 0 35px rgba(255, 69, 0, 0.7),
        0 0 45px rgba(255, 0, 0, 0.6),
        0 0 55px rgba(255, 69, 0, 0.5);
  }
  50% {
    box-shadow:
        0 0 30px rgba(255, 0, 0, 1),
        0 0 40px rgba(255, 69, 0, 0.8),
        0 0 50px rgba(255, 0, 0, 0.7),
        0 0 60px rgba(255, 69, 0, 0.6);
  }
  75% {
    box-shadow:
        0 0 25px rgba(255, 0, 0, 0.9),
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

@keyframes shakeX2 {
  from,
  to {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}
</style>