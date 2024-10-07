<template>
  <div class="bottomReader1_attaque">
    <!-- L'image de la carte (affichée tout le temps) -->
    <img  v-if="image" :src="getImagePath(image)" alt="Attaque Card" class="attaque-card1" >
    <p v-else>{{ id }}</p>
  </div>
</template>

<script>
import io from "socket.io-client";
import {gsap} from "gsap";
import fonctionnaliteesAttaque from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import {UID1, uidPrecedent}  from "@/components/plateauAttaque/Case_attaquant/CaseAttaquant_attaque.vue";
import {perdu} from "@/components/plateauAttaque/TourAttaquant_attaque.vue";

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
    },
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
      this.socket = io('http://localhost:3000');
      this.socket.on('rfidData', (data) => {
        let {readerID, card, uid} = data;

        if (readerID === '5)' && this.readers[2].name === card.name && UID1 === uid && !perdu) {
          let emplacement;
          let didierCruche = fonctionnaliteesAttaque.methods.trouverCarteDefense(this.readers, card);

          if (didierCruche === undefined) {
            emplacement = 0;
          } else {
            switch (didierCruche.id) {
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
                emplacement = 0;
            }
          }
          uidPrecedent.splice(uidPrecedent.indexOf(uid), 1);
          if (fonctionnaliteesAttaque.methods.peutAttaquer(card)) {
            this.attaquerCarteCase1(1, emplacement);
            setTimeout(() => {
              fonctionnaliteesAttaque.methods.attaquerNouveau(card, this.readers[2], this.readers);
            }, 2000);
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
      const deplacementY = -420;
      console.log(this.$el);
      const attackingCard = this.$el.querySelector('.attaque-card'+card_number); // Sélectionne l'élément par classe
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
    }
  },


};
</script>

<style scoped>
.bottomReader1_attaque {
  width: 300px;
  height: 420px;
  position: relative; /* Pour placer le bouton par-dessus l'image */
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100%;
  background-color: rgba(255, 255, 255, 0.5);
}
.attaque-card1 {
  height: 100%;
}
</style>
