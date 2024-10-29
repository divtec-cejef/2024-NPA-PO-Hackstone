<template>
  <div class="bottomReaders_defense">
    <Case_1_Defenseur_defense :id="readersDefense[2].id" :image="readersDefense[2].image"/>
    <Case_2_Defenseur_defense :id="readersDefense[3].id" :image="readersDefense[3].image"/>
    <Case_3_Defenseur_defense :id="readersDefense[5].id" :image="readersDefense[5].image"/>
    <Case_4_Defenseur_defense :id="readersDefense[6].id" :image="readersDefense[6].image" :card="card"/>
  </div>
</template>

<script>
import Case_1_Defenseur_defense from "@/components/plateauDefense/case_defense/Case_1_Defenseur_defense.vue";
import Case_2_Defenseur_defense from "@/components/plateauDefense/case_defense/Case_2_Defenseur_defense.vue";
import Case_3_Defenseur_defense from "@/components/plateauDefense/case_defense/Case_3_Defenseur_defense.vue";
import Case_4_Defenseur_defense, {ouvert} from "@/components/plateauDefense/case_defense/Case_4_Defenseur_defense.vue";
import {cartesEnDefense} from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import io from "socket.io-client";
let uidList = [];
export default {
  components: {
    Case_1_Defenseur_defense,
    Case_2_Defenseur_defense,
    Case_3_Defenseur_defense,
    Case_4_Defenseur_defense
  },
  props: {
    readersDefense: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      card: {},
      readerID: null,
      localReadersDefense: [...this.readersDefense]
    };
  },

  mounted() {
    this.socket = io('http://localhost:3001');
    this.socket.on('rfidData', (data) => {
      let { readerID, card, uid } = data;
      if (card.type === 'défense' && card.name !== 'Stockage') {

        console.log("UID", uid)
        // Nettoie readerID pour enlever les caractères non numériques
        readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres
        this.card = card;
        this.card.image = card.image;
        this.readerID = readerID;

        // Convertir readerID en nombre
        const readerIndex = this.localReadersDefense.findIndex(r => r.id === Number(readerID));
        //console.log("Reader Index:", readerIndex); // Vérifie l'index trouvé

        if (readerIndex === 2 || readerIndex === 3 || readerIndex === 5 ||
            (readerIndex === 6 && ouvert.value === true)) {
          if ((uidList.includes(uid) && this.readersDefense[readerIndex].image !== null) ||
              (!uidList.includes(uid) && this.readersDefense[readerIndex].image === null)) {
            uidList.push(uid);
            if (card.name === "Redondance de données") {
              if (cartesEnDefense.length > 0) {
                let index = 0;
                while (cartesEnDefense[index] === null) {
                  index++;
                }
                card = cartesEnDefense[index];
            }
            else
              alert("Vous n'avez pas de cartes a redondé")
          }
          this.localReadersDefense[readerIndex] = {...this.localReadersDefense[readerIndex], image: card.image};
          this.localReadersDefense[readerIndex] = {...this.localReadersDefense[readerIndex], name: card.name};
          if (readerIndex === 2)
            cartesEnDefense.splice(0, 1, card);
          else if (readerIndex === 3)
            cartesEnDefense.splice(1, 1, card);
          else if (readerIndex === 5)
            cartesEnDefense.splice(2, 1, card);
          else if (readerIndex === 6)
            cartesEnDefense.splice(3, 1, card);
          //Copie des readers

          console.log("Cartes en defense", cartesEnDefense)
          let newReaders = [...this.localReadersDefense];
          this.$emit('update-readers-defense', newReaders);
        }else
          alert("Vous ne pouvez pas poser cette carte la ")
      }
    } else {
      console.log(`Carte non valide: type ${card.type}. Seules les cartes de type défense sont autorisées.`);
    }
  });
}
};
</script>

<style scoped>
.bottomReaders_defense {
  display: flex;
  justify-content: center;
  gap: 147px;
}
</style>
