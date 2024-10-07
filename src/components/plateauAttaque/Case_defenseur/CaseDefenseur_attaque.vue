<template>
  <div class="topReaders_defense">
    <Case_1_Defenseur_Attaque :id="readers[0].id" :image="readers[0].image"/>
    <Case_2_Defenseur_Attaque :id="readers[1].id" :image="readers[1].image"/>
    <Case_3_Defenseur_Attaque :id="readers[4].id" :image="readers[4].image"/>
    <Case_4_Defenseur_Attaque :id="readers[6].id" :image="readers[6].image"/>
  </div>
</template>

<script>
import Case_1_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_1_Defenseur_Attaque.vue";
import Case_2_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_2_Defenseur_Attaque.vue";
import Case_3_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_3_Defenseur_Attaque.vue";
import Case_4_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_4_Defenseur_Attaque.vue";
import io from "socket.io-client";
import fonctionnaliteesAttaque, {cartesAttaque, stockage} from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import {finDeTour} from "@/components/plateauAttaque/TourAttaquant_attaque.vue";

let carteEnMain = [];
let deckDefense = fonctionnaliteesAttaque.methods.genererDeckDefense();
export default {
  components: {
    Case_1_Defenseur_Attaque,
    Case_2_Defenseur_Attaque,
    Case_3_Defenseur_Attaque,
    Case_4_Defenseur_Attaque
  },
  props: {
    readers: {
      type: Array,
      required: true
    }
  },
  mounted()
  {
    this.socket = io('http://localhost:3000');

    this.socket.on('rfidData', (data) => {
      let {readerID} = data;
      // Nettoie readerID pour enlever les caractères non numériques
      readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres

      if (readerID === "1") {
        fonctionnaliteesAttaque.methods.DebutTour(deckDefense, carteEnMain);
        const delais = [2000, 3000, 4000, 5000];
        const readersIndex = [0, 1, 4, 6];

        delais.forEach((delai, index) => {
          setTimeout(() => {
            if (index === 3 && !stockage.value) {
              return; // Ne pas exécuter si la condition n'est pas remplie pour le dernier appel
            }
            fonctionnaliteesAttaque.methods.defendMalin(carteEnMain, this.readers[readersIndex[index]], index);
          }, delai);
        });

// Changement de la valeur de `finDeTour` après 6 secondes
        setTimeout(() => {
          finDeTour.value = !finDeTour.value;
        }, 6000);

        for (let i = 0; i < cartesAttaque.length; i++){
          cartesAttaque[i].poseeDepuis = 2;
        }

        fonctionnaliteesAttaque.methods.resetDejaAttaquer();
        let newReaders = [...this.readers]; // Copie des readers
        this.$emit('update-readers', newReaders);
      }
    });
  }
};
</script>

<style scoped>
.topReaders_defense {
  display: flex;
  justify-content: center;
  gap: 147px;
}
</style>