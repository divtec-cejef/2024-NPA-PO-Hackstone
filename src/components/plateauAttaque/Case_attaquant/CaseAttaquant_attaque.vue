<template>
  <div class="bottomReaders_attaque">
    <Case_1_Attaquant_Attaque :id="readers[2].id" :image="readers[2].image" :readers="readers" />
    <Case_2_Attaquant_Attaque :id="readers[3].id" :image="readers[3].image" :readers="readers" />
    <Case_3_Attaquant_Attaque :id="readers[5].id" :image="readers[5].image" :readers="readers" />
  </div>
</template>

<script>
import io from "socket.io-client";
import Case_1_Attaquant_Attaque from "@/components/plateauAttaque/Case_attaquant/Case_1_Attaquant_Attaque.vue";
import Case_2_Attaquant_Attaque from "@/components/plateauAttaque/Case_attaquant/Case_2_Attaquant_Attaque.vue";
import Case_3_Attaquant_Attaque from "@/components/plateauAttaque/Case_attaquant/Case_3_Attaquant_Attaque.vue";
import fonctionnaliteesAttaque, {cartesAttaque} from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import {perdu, messageErreurAttaque} from "@/components/plateauAttaque/TourAttaquant_attaque.vue";

export let UID1;
export let UID2;
export let UID3;
export let uidPrecedent = [];

export default {
  components: {
    Case_1_Attaquant_Attaque,
    Case_2_Attaquant_Attaque,
    Case_3_Attaquant_Attaque
  },
  props: {
    readers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      card: {},
      localReaders: [...this.readers]
    }
  },
  mounted() {

    this.socket = io('http://localhost:3000');

    this.socket.on('rfidData', (data) => {
      let { readerID, card, uid } = data;
      // Nettoie readerID pour enlever les caractères non numériques
      readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres

      //Retrouve le reader sur lequel la carte a été scannée
      const reader = this.localReaders.findIndex(r => r.id === Number(readerID));
      //Vérifie si la carte est de type attaque et si la partie n'est pas terminée
      if (card.type === 'attaque' && !perdu) {


        if ((reader === 2 || reader === 3 || reader === 5)) {

          //Vérifie si la carte n'es pas déjà présente sur le plateau
          if (!uidPrecedent.includes(uid)) {
            //Ajoute la carte seulement s'il n'y en a pas sur cette case.
            if (this.localReaders[reader].image === null) {
              this.localReaders[reader] = {...this.localReaders[reader], image: card.image}
              this.localReaders[reader] = {...this.localReaders[reader], name: card.name}

              //Vérifie si la carte posée est l'anonymous afin de déclencher son effet si nécessaire
              fonctionnaliteesAttaque.methods.arriveeAnonymous(card, this.localReaders);

              //Ajoute la carte dans la liste des cartes en attaque si elle n'est pas déjà présente
              let exist = false;
              for (let i = 0; i < cartesAttaque.length; i++) {
                if (cartesAttaque[i].uid.includes(card.uid)) {
                  exist = true;
                  break;
                }
              }
              if (!exist)
                cartesAttaque.push(card);
              //Copie des readers
              let newReaders = [...this.localReaders];
              this.$emit('update-readers', newReaders);

              //Récupère l'uid de la carte scannée
              uidPrecedent.push(uid);
              if (reader === 2)
                UID1 = uid;
              else if (reader === 3)
                UID2 = uid;
              else if (reader === 5)
                UID3 = uid;

            } else if (this.localReaders[reader].image !== card.image)
              messageErreurAttaque.value = "Une carte est déjà présente sur cette zone"
          } else if (uidPrecedent.includes(uid) && this.localReaders[reader].image !== card.image) {
            messageErreurAttaque.value = "Cette carte à déjà été utilisée"
          }
        }
      } else if (reader !== 0 && reader !== 1) {
        messageErreurAttaque.value = "Type de carte invalide"
      }
    });
  }
};
</script>

<style scoped>
.bottomReaders_attaque {
  display: flex;
  justify-content: center;
  gap: 147px;
}
</style>
