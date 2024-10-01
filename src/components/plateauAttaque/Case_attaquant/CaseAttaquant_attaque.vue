<template>
  <div class="bottomReaders_attaque">
    <Case_1_Attaquant_Attaque :id="readers[2].id" :image="readers[2].image"/>
    <Case_2_Attaquant_Attaque :id="readers[3].id" :image="readers[3].image"/>
    <Case_3_Attaquant_Attaque :id="readers[5].id" :image="readers[5].image"/>
  </div>
</template>

<script>
import Case_1_Attaquant_Attaque from "@/components/plateauAttaque/Case_attaquant/Case_1_Attaquant_Attaque.vue";
import Case_2_Attaquant_Attaque from "@/components/plateauAttaque/Case_attaquant/Case_1_Attaquant_Attaque.vue";
import Case_3_Attaquant_Attaque from "@/components/plateauAttaque/Case_attaquant/Case_1_Attaquant_Attaque.vue";
import io from "socket.io-client";
import fonctionnaliteesAttaque from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
import {cartesAttaque} from "@/components/plateauAttaque/fonctionnaliteesAttaque.vue";
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
      let { readerID, card } = data;
      if (card.type === 'attaque') {

        // Nettoie readerID pour enlever les caractères non numériques
        readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres

        const reader = this.localReaders.findIndex(r => r.id === Number(readerID));

        if (reader === 2 || reader === 3 || reader === 5) {
          console.log("image ", reader);
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
          }
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
