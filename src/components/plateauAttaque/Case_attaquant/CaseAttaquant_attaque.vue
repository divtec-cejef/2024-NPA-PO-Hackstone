<template>
  <div class="bottomReaders_attaque">
    <Case_1_Attaquant_Attaque :id="readers[2].id" :image="readers[2].image"/>
    <Case_2_Attaquant_Attaque :id="readers[3].id" :image="readers[3].image"/>
    <Case_3_Attaquant_Attaque :id="readers[5].id" :image="readers[5].image"/>
  </div>
</template>

<script>
import Case_1_Attaquant_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_1_Defenseur_Attaque.vue";
import Case_2_Attaquant_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_2_Defenseur_Attaque.vue";
import Case_3_Attaquant_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_3_Defenseur_Attaque.vue";
import io from "socket.io-client";

export default {
  components: {
    Case_1_Attaquant_Attaque,
    Case_2_Attaquant_Attaque,
    Case_3_Attaquant_Attaque
  },
  data() {
    return {
      readers: [
        { id: 1, name: 'Reader 1', image: null},
        { id: 2, name: 'Reader 2', image: null},
        { id: 3, name: 'Reader 3', image: null},
        { id: 4, name: 'Reader 4', image: null},
        { id: 5, name: 'Reader 5', image: null},
        { id: 6, name: 'Reader 6', image: null},
        { id: 7, name: 'Reader 7', image: null},
      ],
      card: {},
      readerID: null
    };
  },

  mounted() {
    this.socket = io('http://localhost:3001');

    this.socket.on('connect', () => {
      console.log('Successfully connected to WebSocket on port 3001');
    });

    this.socket.on('rfidData', (data) => {
      let { readerID, card } = data;
      if (card.type === 'attaque') {

        // Nettoie readerID pour enlever les caractères non numériques
        readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres

        console.log("Cleaned readerID:", readerID); // Vérifie la valeur nettoyée

        this.card = card;
        this.card.image = card.image;
        this.readerID = readerID;

        // Convertir readerID en nombre
        const readerIndex = this.readers.findIndex(r => r.id === Number(readerID));
        console.log("Reader Index:", readerIndex); // Vérifie l'index trouvé

        if (readerIndex !== -1) {
          this.readers[readerIndex] = { ...this.readers[readerIndex], image: card.image };
        }
        console.log("Updated reader:", this.readers[readerIndex]);
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
