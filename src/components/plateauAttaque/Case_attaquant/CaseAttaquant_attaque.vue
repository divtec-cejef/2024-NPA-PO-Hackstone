<template>
  <div class="bottomReaders_attaque">
    <Case_1_Attaquant_Attaque :id="readers[2].id" :image="readers[2].image" :readers="readers" />
    <Case_2_Attaquant_Attaque :id="readers[3].id" :image="readers[3].image" :readers="readers" />
    <Case_3_Attaquant_Attaque :id="readers[5].id" :image="readers[5].image" :readers="readers" />
  </div>
</template>

<script>
import Case_1_Attaquant_Attaque from "@/components/plateauAttaque/Case_attaquant/Case_1_Attaquant_Attaque.vue";
import Case_2_Attaquant_Attaque from "@/components/plateauAttaque/Case_attaquant/Case_2_Attaquant_Attaque.vue";
import Case_3_Attaquant_Attaque from "@/components/plateauAttaque/Case_attaquant/Case_3_Attaquant_Attaque.vue";
import io from "socket.io-client";
import fonctionnaliteesAttaque from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import {cartesAttaque} from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import {perdu} from "@/components/plateauAttaque/TourAttaquant_attaque.vue";
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
      console.log("has lost ",perdu)
      if (card.type === 'attaque' && !perdu) {
        // Nettoie readerID pour enlever les caractères non numériques
        readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres

        const reader = this.localReaders.findIndex(r => r.id === Number(readerID));

        if ((reader === 2 || reader === 3 || reader === 5)) {

          if (this.localReaders[reader].image === null) {
            this.localReaders[reader] = {...this.localReaders[reader], image: card.image}
            this.localReaders[reader] = {...this.localReaders[reader], name: card.name}

            fonctionnaliteesAttaque.methods.arriveeAnonymous(card, this.localReaders);

            if (cartesAttaque.length === 0) {
              cartesAttaque.push(card)
            } else {
              let exist = false;
              for (let i = 0; i < cartesAttaque.length; i++) {
                if (cartesAttaque[i].uid.includes(card.uid)) {
                  exist = true;
                  break;
                }
              }
              if (!exist)
                cartesAttaque.push(card);
            }
            let newReaders = [...this.localReaders]; // Copie des readers
            this.$emit('update-readers', newReaders);
            console.log("Cartes en attaque", cartesAttaque);

            if (!uidPrecedent.includes(uid)) {
              uidPrecedent.push(uid)
              if (reader === 2)
                UID1 = uid;
              else if (reader === 3)
                UID2 = uid;
              else if (reader === 5)
                UID3 = uid;
            } else if (uidPrecedent.includes(uid)) {
              alert("Vous ne pouvez pas mettre deux fois la meme carte")
            }
          } else if (this.localReaders[reader].image !== card.image)
            alert("Il y a deja une carte la ")
        }
      } else {
        console.log(`Carte non valide: type ${card.type}. Seules les cartes de type attaque sont autorisées.`);
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
