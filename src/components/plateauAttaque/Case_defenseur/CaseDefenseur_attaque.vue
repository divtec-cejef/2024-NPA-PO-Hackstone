<template>
  <div class="topReaders_defense">
    <Case_1_Defenseur_Attaque :id="readers[0].id" :image="readers[0].image"/>
    <Case_2_Defenseur_Attaque :id="readers[1].id" :image="readers[1].image"/>
    <Case_3_Defenseur_Attaque :id="readers[4].id" :image="readers[4].image"/>
    <Case_4_Defenseur_Attaque :id="readers[6].id" :image="readers[6].image"/>
  </div>
</template>

<script>
import io from "socket.io-client";
import Case_1_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_1_Defenseur_Attaque.vue";
import Case_2_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_2_Defenseur_Attaque.vue";
import Case_3_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_3_Defenseur_Attaque.vue";
import Case_4_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_4_Defenseur_Attaque.vue";
import fonctionnaliteesAttaque, {attackingCards, stockage} from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import {isTurnEnding} from "@/components/plateauAttaque/TourAttaquant_attaque.vue";
import {peutAttaquer} from "@/components/plateauAttaque/Case_attaquant/Case_1_Attaquant_Attaque.vue";
import {peutAttaquerCase2} from "@/components/plateauAttaque/Case_attaquant/Case_2_Attaquant_Attaque.vue";
import {peutAttaquerCase3} from "@/components/plateauAttaque/Case_attaquant/Case_3_Attaquant_Attaque.vue";

let carteEnMain = [];
//Génère le deck du défenseur
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
        //Pioche des cartes
        fonctionnaliteesAttaque.methods.DebutTour(deckDefense, carteEnMain);

        //Pose trois cartes sur le terrain du défenseur
        const delais = [2000, 3000, 4000];
        const readersIndex = [0, 1, 4];
        delais.forEach((delai, index) => {
          setTimeout(() => {
            fonctionnaliteesAttaque.methods.defendMalin(carteEnMain, this.readers[readersIndex[index]], index);
          }, delai);

          //Pose une carte sur la quatrième case si elle est débloquée
          setTimeout(() => {
            if (stockage.value === true) {
              fonctionnaliteesAttaque.methods.defendMalin(carteEnMain, this.readers[6], 3);
            }
          }, 5000);
        });

        // Changement de la valeur de `isTurnEnding` après 6 secondes
        setTimeout(() => {
          isTurnEnding.value = !isTurnEnding.value;
            peutAttaquer.value = (this.readers[2].image !== null);
            peutAttaquerCase2.value = (this.readers[3].image !== null)
            peutAttaquerCase3.value = (this.readers[5].image !== null)
        }, 6001);

        //Change le champ poseeDepuis des cartes en attaque à 2
        //afin qu'elles puissent attaquer lors du tour de l'attaquant
        for (let i = 0; i < attackingCards.length; i++){
          attackingCards[i].poseeDepuis = 2;
        }

        //Vide la liste des cartes ayant déjà attaqué
        //Afin qu'elles puissent le refaire au prochain tour

        fonctionnaliteesAttaque.methods.resetDejaAttaquer();

        // Copie des readers
        let newReaders = [...this.readers];
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
  position: absolute;
  margin-bottom: 630px;

}
</style>