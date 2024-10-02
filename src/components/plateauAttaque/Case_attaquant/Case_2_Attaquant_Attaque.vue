<template>
  <div class="bottomReader2_attaque">
    <img  v-if="image" :src="getImagePath(image)" alt="Attaque Card" class="attaque-card2" ref="attackingCard2">
    <p v-else>{{ id }}</p>
  </div>
</template>

<script>

import io from "socket.io-client";
import fonctionnaliteesAttaque, {cartesAttaque}from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import {gsap} from "gsap";

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
      stockage: 680
    }
  },
  mounted() {
    this.socket = io('http://localhost:3000');

    this.socket.on('rfidData', (data) => {
      let {readerID, card} = data;
      const occurrences = cartesAttaque.filter(c => c.name === card.name).length;
      if (readerID === '5)' && this.readers[3].name === card.name && occurrences === 1) {
        console.log("Readers", this.readers);
        let emplacement;
        let didierCruche = fonctionnaliteesAttaque.methods.trouverCarteDefense(this.readers, card);
        console.log("Didier", didierCruche.id);
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
        console.log("SALUT");
        console.log("Emplacement", emplacement)
        this.attaquerCarteCase2(2, emplacement);
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
            delay: 2
          });
    }
  }
};
</script>

<style>
.bottomReader2_attaque {
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

.attaque-card2 {
  height: 100%;
}
</style>