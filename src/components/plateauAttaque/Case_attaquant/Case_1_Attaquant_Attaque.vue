<template>
  <div class="bottomReader1_attaque">
    <!-- L'image de la carte (affichée tout le temps) -->
    <img
        v-if="image"
        :src="getImagePath(image)"
        alt="Attaque Card"
        :class="{'attack-card1': !hasEntered}"
        :id="canAttack ? 'flame_case1' : ''"
        :style="shakeStyle"
        class="attaque-card1"
    />
  </div>
</template>

<script>
import "animate.css";
import io from "socket.io-client";
import { gsap } from "gsap";
import { ref, watch } from "vue";
import fonctionnaliteesAttaque from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import { UID1 } from "@/components/plateauAttaque/Case_attaquant/CaseAttaquant_attaque.vue";
import { hasLostAttack } from "@/components/plateauAttaque/TourAttaquant_attaque.vue";
import caseAttaquant_attaque from "@/components/plateauAttaque/Case_attaquant/CaseAttaquant_attaque.vue";

export let peutAttaquer = ref(false);
let deplacementY = -420;

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    readers: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      ref: "attackingCard",
      gauche: -230,
      milieu: 230,
      droite: 680,
      stockage: 1140,
      pv: 455,
      hasEntered: false,
      canAttack: false,
      shakeStyle: {},
    };
  },
  mounted() {
    this.socket = io("http://localhost:3000");
    this.socket.on("rfidData", (data) => {
      let { readerID, card, uid } = data;

      watch(peutAttaquer, (newVal) => {
        this.canAttack = newVal;
      });

      if (readerID === "5)" && !this.canAttack && UID1 === uid) {
        this.triggerShakeAnimation();
      }

      if (
          readerID === "5)" &&
          this.readers[2].name === card.name &&
          UID1 === uid &&
          !hasLostAttack
      ) {
        this.hasEntered = true;
        let emplacement;
        let carteEnDefense =
            fonctionnaliteesAttaque.methods.trouverCarteDefense(
                this.readers,
                card
            );

        if (carteEnDefense === undefined) {
          emplacement = this.pv;
        } else {
          switch (carteEnDefense.id) {
            case 1:
              emplacement = this.gauche;
              break;
            case 2:
              emplacement = this.milieu;
              break;
            case 5:
              emplacement = this.droite;
              break;
            case 7:
              emplacement = this.stockage;
              break;
            default:
              emplacement = this.pv;
          }
        }

        if (fonctionnaliteesAttaque.methods.peutAttaquer(card)) {
          this.hasEntered = true;
          this.attaquerCarteCase1(1, emplacement);
          caseAttaquant_attaque.methods.showRedBorder(deplacementY);
          setTimeout(() => {
            fonctionnaliteesAttaque.methods.attaquerNouveau(
                card,
                this.readers[2],
                this.readers
            );
          }, 2000);
          setTimeout(() => {
            if (this.readers[2].image === null) this.hasEntered = false;
          }, 2001);
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
    },
    attaquerCarteCase1(card_number, deplacementX) {
      deplacementY = -420;
      if (deplacementX === this.pv) deplacementY = -800;

      const attackingCard = this.$el.querySelector(
          ".attaque-card" + card_number
      );

      if (!attackingCard) {
        console.error("La carte attaquante n'est pas disponible.");
        return;
      }

      const tl = gsap.timeline();
      tl.to(attackingCard, {
        duration: 0.3,
        scale: 1.1,
        ease: "power2.inOut",
      })
          .to(attackingCard, {
            duration: 0.3,
            y: deplacementY,
            x: deplacementX,
            scale: 1,
            ease: "power2.inOut",
            delay: 0.6,
          })
          .to(attackingCard, {
            duration: 0.3,
            y: 0,
            x: 0,
            ease: "power2.inOut",
          });
    },
    triggerShakeAnimation() {
      this.shakeStyle = {}; // Réinitialise le style
      this.$nextTick(() => {
        this.shakeStyle = {
          animation: "shakeX 1s",
        };
        setTimeout(() => {
          this.shakeStyle = {}; // Supprime l'animation après
        }, 1000); // Durée de l'animation
      });
    },
  },
};
</script>


<style scoped>
.bottomReader1_attaque {
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
.attack-card1 {
  animation: slideInUp;
  animation-duration: 1s;
  position: fixed;
  height: 420px;
}
.attaque-card1 {
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

@keyframes shakeX {
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
