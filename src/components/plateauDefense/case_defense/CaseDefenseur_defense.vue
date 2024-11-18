<template>
  <div class="bottomReaders_defense">
    <Case_1_Defenseur_defense :id="readersDefense[2].id" :image="readersDefense[2].image"/>
    <Case_2_Defenseur_defense :id="readersDefense[3].id" :image="readersDefense[3].image"/>
    <Case_3_Defenseur_defense :id="readersDefense[5].id" :image="readersDefense[5].image"/>
    <Case_4_Defenseur_defense :id="readersDefense[6].id" :image="readersDefense[6].image" :card="card"/>
  </div>
</template>

<script>
import io from "socket.io-client";
import Case_1_Defenseur_defense from "@/components/plateauDefense/case_defense/Case_1_Defenseur_defense.vue";
import Case_2_Defenseur_defense from "@/components/plateauDefense/case_defense/Case_2_Defenseur_defense.vue";
import Case_3_Defenseur_defense from "@/components/plateauDefense/case_defense/Case_3_Defenseur_defense.vue";
import Case_4_Defenseur_defense, {ouvert} from "@/components/plateauDefense/case_defense/Case_4_Defenseur_defense.vue";
import {cartesEnDefense} from "@/components/plateauDefense/fonctionnaliteDefense.vue";
import {messageErreur} from "@/components/plateauDefense/fonctionnaliteDefense.vue";

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
      //Récupère l'ID du lecteur, la carte et l'UID de la carte
      let { readerID, card, uid } = data;

      // Nettoie readerID pour enlever les caractères non numériques
      readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres

      // Convertir readerID en nombre
      const readerIndex = this.localReadersDefense.findIndex(r => r.id === Number(readerID));

      //Vérifie si la carte est de type défense
      if (card.type === 'défense' && card.name !== 'Stockage') {

        this.card = card;
        this.card.image = card.image;
        this.readerID = readerID;

        //Vérifie si la carte est scannée sur une case valide
        if (readerIndex === 2 || readerIndex === 3 || readerIndex === 5 ||
            (readerIndex === 6 && ouvert.value === true)) {

          //Vérifie si la carte posée n'est pas déjà présente sur une autre case et
          //si la carte n'as pas déjà été détruite
          if ((uidList.includes(uid) && this.readersDefense[readerIndex].image === card.image) ||
              (!uidList.includes(uid) && this.readersDefense[readerIndex].image === null)) {

            //Si la carte posée est une Redondance de données,
            //elle devient la copie exacte de la carte la plus à gauche sur le plateau.
            if (card.name === "Redondance de données") {
              if (cartesEnDefense.length > 0) {
                let index = 0;
                while (cartesEnDefense[index] === null) {
                  console.log("Index", index)
                  index++;
                }
                if (index <= 3) {
                  card = cartesEnDefense[index];
                } else {

                  //Si aucune carte n'est présente sur le plateau,
                  // affiche un message d'erreur et ne lance pas les opérations suivantes.
                  messageErreur.value = "Tu n'as aucune carte à copier "
                  return;
                }
              }
            }
            //Ajoute l'uid de la carte scannée dans une liste
            uidList.push(uid);

            //Affiche la carte à l'écran
            this.localReadersDefense[readerIndex] = {...this.localReadersDefense[readerIndex], image: card.image};
            this.localReadersDefense[readerIndex] = {...this.localReadersDefense[readerIndex], name: card.name};

            //Ajoute la carte dans une liste selon sa position sur le plateau.
            switch (readerIndex){
              case 2:
                cartesEnDefense.splice(0, 1, card);
                break;
              case 3:
                cartesEnDefense.splice(1, 1, card);
                break;
              case 5:
                cartesEnDefense.splice(2, 1, card);
                break;
              case 6:
                cartesEnDefense.splice(3, 1, card);
                break;
            }

            //Copie des readers
            let newReaders = [...this.localReadersDefense];
            this.$emit('update-readers-defense', newReaders);


          } else if (uidList.includes(uid) && this.readersDefense[readerIndex].image === null){
            //Affiche un message d'erreur si la carte a déjà été jouée auparavant
            messageErreur.value = "Cette carte à déjà été posée"

          }else if ((!uidList.includes(uid) && this.readersDefense[readerIndex].image !== null)
              || this.readersDefense[readerIndex].image !== card.image) {
            //Affiche un message d'erreur si l'on essaie de poser la carte par-dessus une autre
            messageErreur.value = "Une autre carte est déjà posée sur cette case"
          }
        }else if (readerIndex === 6 && !ouvert.value)
          messageErreur.value = "Case verrouillée, utilise la carte Stockage"
      } else if (readerIndex !== 0 && readerIndex !== 1 && card.name !== "Stockage") {
        messageErreur.value = 'Type de carte invalide'
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
  position: absolute;
  margin-top: 630px;
}
</style>
