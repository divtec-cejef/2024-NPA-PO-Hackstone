<template>
  <div class="topReaders_attaque">
    <Case_1_Attaquant_defense ref="Case_1_Attaquant_defense" :id="readersDefense[0].id" :image="readersDefense[0].image" :readers="readersDefense"/>

    <Case_2_Attaquant_defense ref="Case_2_Attaquant_defense" :id="readersDefense[1].id" :image="readersDefense[1].image" :readers="readersDefense"/>

    <Case_3_Attaquant_defense ref="Case_3_Attaquant_defense" :id="readersDefense[4].id" :image="readersDefense[4].image" :readers="readersDefense"/>
  </div>
</template>

<script>
import io from "socket.io-client";
import Case_1_Attaquant_defense from "@/components/plateauDefense/case_attaque/Case_1_Attaquant_defense.vue";
import Case_2_Attaquant_defense from "@/components/plateauDefense/case_attaque/Case_2_Attaquant_defense.vue";
import Case_3_Attaquant_defense, {finTour} from "@/components/plateauDefense/case_attaque/Case_3_Attaquant_defense.vue";
import fonctionnaliteDefense from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import {finDeTourDefense} from "@/components/plateauDefense/TourAttaquant_defense.vue";
import {redBorder} from "@/components/plateauDefense/PlateauFinaleDefenseur.vue";
import {watch} from "vue";

export let deckAttaque = fonctionnaliteDefense.methods.genererDeckAttaque();
let carteEnMain = [];
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
    //Si c'est le premier tour de la partie, l'ordinateur pioche et pose directement des cartes
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
        finDeTourDefense.value = !finDeTourDefense.value
      }, 2500);
    }
    this.socket = io('http://localhost:3001');
    this.socket.on('rfidData', (data) => {

      let {readerID} = data;
      // Nettoie readerID pour enlever les caractères non numériques
      readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres
      premierTour = false;
      if (readerID === "1") {

        //Attend que le tour du joueur soit terminé avant de piocher et poser des cartes
        watch(finTour, (newVal) => {
          if (newVal === true) {
            setTimeout(() => {

              //Pioche des cartes
              fonctionnaliteDefense.methods.piocher(deckAttaque, carteEnMain);
              const delais = [750, 1250, 1750];
              const readersIndex = [0, 1, 4];
              delais.forEach((delai, index) => {
                setTimeout(() => {
                  //Pose une carte toutes les 0,5 seconde
                  fonctionnaliteDefense.methods.poserCarte(carteEnMain, this.readersDefense[readersIndex[index]], this.readersDefense)
                }, delai)
              });
              setTimeout(() => {
                //Termine son tour
                finDeTourDefense.value = !finDeTourDefense.value;
              },2000)
            },2500)
          }
          finTour.value = false
        });
      }
    });
  },
  methods: {
    showRedBorder(emplacement){
      if (emplacement !== 420){

        setTimeout(() => {
          redBorder.value = true
        },1000)

        setTimeout(() => {
          redBorder.value = false
        },2000)
      }
    }
  }
}
</script>

<style scoped>
.topReaders_attaque {
  display: flex;
  justify-content: center;
  gap: 147px;
  position: absolute;
  margin-bottom: 430px;
}
</style>