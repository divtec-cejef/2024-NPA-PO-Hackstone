<template>
  <div class="topReaders_attaque">
    <Case_1_Attaquant_defense ref="Case_1_Attaquant_defense" :id="readersDefense[0].id" :image="readersDefense[0].image" :readers="readersDefense"/>

    <Case_2_Attaquant_defense ref="Case_2_Attaquant_defense" :id="readersDefense[1].id" :image="readersDefense[1].image" :readers="readersDefense"/>

    <Case_3_Attaquant_defense ref="Case_3_Attaquant_defense" :id="readersDefense[4].id" :image="readersDefense[4].image" :readers="readersDefense"/>
  </div>
</template>

<script>
import Case_1_Attaquant_defense from "@/components/plateauDefense/case_attaque/Case_1_Attaquant_defense.vue";
import Case_2_Attaquant_defense from "@/components/plateauDefense/case_attaque/Case_2_Attaquant_defense.vue";
import Case_3_Attaquant_defense, {finTour} from "@/components/plateauDefense/case_attaque/Case_3_Attaquant_defense.vue";
import io from "socket.io-client";
import fonctionnaliteDefense from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import {watch} from "vue";
import {finDeTourDefense} from "@/components/plateauDefense/TourAttaquant_defense.vue";

let carteEnMain = [];
export let deckAttaque = fonctionnaliteDefense.methods.genererDeckAttaque();
let premierTour = true;
export default {
  components: {
    Case_1_Attaquant_defense,
    Case_2_Attaquant_defense,
    Case_3_Attaquant_defense
  },
  props: {
    readersDefense: {
      type: Array,
      required: true
    }
  },
  mounted() {
    if (premierTour) {
      setTimeout(() => {
        fonctionnaliteDefense.methods.piocher(deckAttaque, carteEnMain);
      },1000);
      setTimeout(() => {
        fonctionnaliteDefense.methods.poserCarte(carteEnMain, this.readersDefense[0], this.readersDefense);
      }, 1500);
      setTimeout(() => {
        fonctionnaliteDefense.methods.poserCarte(carteEnMain, this.readersDefense[1], this.readersDefense);
      }, 2000);
      setTimeout(() => {
        fonctionnaliteDefense.methods.poserCarte(carteEnMain, this.readersDefense[4], this.readersDefense);
      }, 2500);
    }
    this.socket = io('http://localhost:3001');

    this.socket.on('rfidData', (data) => {
      let {readerID} = data;
      // Nettoie readerID pour enlever les caractères non numériques
      readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres
      premierTour = false;
      if (readerID === "1") {

        watch(finTour, (newVal) => {
          setTimeout(() => {
            if (newVal === true) {
              //Pioche des cartes
              fonctionnaliteDefense.methods.piocher(deckAttaque, carteEnMain);
              setTimeout(() => {
                fonctionnaliteDefense.methods.poserCarte(carteEnMain, this.readersDefense[0], this.readersDefense);
              }, 500);
              setTimeout(() => {
                fonctionnaliteDefense.methods.poserCarte(carteEnMain, this.readersDefense[1], this.readersDefense);
              }, 1000);
              setTimeout(() => {
                fonctionnaliteDefense.methods.poserCarte(carteEnMain, this.readersDefense[4], this.readersDefense);
                finDeTourDefense.value = !finDeTourDefense.value;
              }, 1500);
              finTour.value = false;
            }
          },2000)
        });
      }
    });
  },

}
</script>

<style scoped>
.topReaders_attaque {
  display: flex;
  justify-content: center;
  gap: 147px;
}
</style>