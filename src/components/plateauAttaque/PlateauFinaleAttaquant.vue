<template>
  <div class="plateau-finale-attaque">
    <!-- PV du défenseur -->
    <PVDefenseur_attaque />

    <!-- Case de la défense -->
    <CaseDefenseur_attaque :readers="readers" :socket="socket"  @update-readers="updateReaders" />

    <img src="../../img/ligne.png" alt="Ligne" class="line" id="ligne_attaque">

    <!-- Compteurs de l'attaque -->
    <TourAttaquant_attaque :socket="socket" />

    <!-- Case de l'attaque -->
    <CaseAttaquant_attaque :readers="readers" :socket="socket" @update-readers="updateReaders"/>
  </div>
</template>

<script>
import CaseAttaquant_attaque from "@/components/plateauAttaque/Case_attaquant/CaseAttaquant_attaque.vue";
import CaseDefenseur_attaque from "@/components/plateauAttaque/Case_defenseur/CaseDefenseur_attaque.vue";
import TourAttaquant_attaque from "@/components/plateauAttaque/TourAttaquant_attaque.vue";
import PVDefenseur_attaque from "@/components/plateauAttaque/PVDefenseur_attaque.vue";
import io from "socket.io-client";
export default {
  components: {
    CaseAttaquant_attaque,
    CaseDefenseur_attaque,
    TourAttaquant_attaque,
    PVDefenseur_attaque
  },
  data() {
    return {
      readers: [
        {id: 1, name: 'Reader 1', image: null},
        {id: 2, name: 'Reader 2', image: null},
        {id: 3, name: 'Reader 3', image: null},
        {id: 4, name: 'Reader 4', image: null},
        {id: 5, name: 'Reader 5', image: null},
        {id: 6, name: 'Reader 6', image: null},
        {id: 7, name: 'Reader 7', image: null},
      ],
      socket: null,
    };
  },
  mounted() {
    this.socket = io('http://localhost:3000');
    this.socket.on('rfidData', (data) => {
      const { readerID, card } = data;

      if (card.type === 'attaque') {
        let mappedReaderID = null;
        switch (parseInt(readerID)) {
          case 1:
            mappedReaderID = 0; // Capteur 1 -> Reader 1
            break;
          case 2:
            mappedReaderID = 1; // Capteur 2 -> Reader 2
            break;
          case 3:
            mappedReaderID = 4; // Capteur 3 -> Reader 5
            break;
          case 4:
            mappedReaderID = 5; // Capteur 4 -> Reader 6
            break;
          case 5:
            mappedReaderID = 3; // Capteur 5 -> Reader 3
            break;
          case 6:
            mappedReaderID = 6; // Capteur 6 -> Reader 7
            break;
          case 7:
            mappedReaderID = 2; // Capteur 7 -> Reader 4
            break;
        }

        //Retrouve le reader scanné
        const reader = this.readers.find(r => r.id === mappedReaderID);

        if (!reader) {
          console.log(`No reader found with mapped ID ${mappedReaderID}.`);
        }
      } else {
        console.log(`Carte non valide: type ${card.type}. Seules les cartes de type attaque sont autorisées.`);
      }
    });
  },
  methods: {
    updateReaders(newReaders){
      this.readers = newReaders;
    }
  }
}
</script>

<style scoped>
.line {
  margin-top: 50px;
  margin-bottom: 50px;
  max-width: 100%;
  height: auto;
  mix-blend-mode: lighten;
  opacity: 0.9;
}

#ligne_attaque.line {
  rotate: 180deg;
}

.plateau-finale-attaque {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  gap: 15px;
}
</style>
