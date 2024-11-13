<template>
  <div class="plateau-finale-defense"  :class="{ 'red-border': isRedBorder }">
    <!-- Compteurs de l'attaque -->
    <TourAttaquant_defense :socket="socket" />

    <!-- Case de l'attaque -->
    <CaseAttaquant_defense :readersDefense="readersDefense" :socket="socket"  @update-readers-defense="updateReadersDefense" />

    <img src="../../img/ligne.png" alt="Ligne" class="line" id="ligne_attaque">

    <!-- Case de la défense -->
    <CaseDefenseur_defense :readersDefense="readersDefense" :socket="socket"  @update-readers-defense="updateReadersDefense" />

    <!-- PV restant du défenseur -->
    <PVDefenseur_defense/>
  </div>
</template>

<script>
import CaseAttaquant_defense from "@/components/plateauDefense/case_attaque/CaseAttaquant_defense.vue";
import CaseDefenseur_defense from "@/components/plateauDefense/case_defense/CaseDefenseur_defense.vue";
import TourAttaquant_defense from "@/components/plateauDefense/TourAttaquant_defense.vue";
import PVDefenseur_defense from "@/components/plateauDefense/PVDefenseur_defense.vue";
import io from "socket.io-client";
import {ref, watch} from "vue";
export let redBorder = ref(false);

export default {
  components: {
    CaseAttaquant_defense,
    CaseDefenseur_defense,
    TourAttaquant_defense,
    PVDefenseur_defense
  },
  data() {
    return {
      readersDefense: [
        {id: 1, name: 'Reader 1', image: null},
        {id: 2, name: 'Reader 2', image: null},
        {id: 3, name: 'Reader 3', image: null},
        {id: 4, name: 'Reader 4', image: null},
        {id: 5, name: 'Reader 5', image: null},
        {id: 6, name: 'Reader 6', image: null},
        {id: 7, name: 'Reader 7', image: null, accessible: false},
      ],
      authorizedID: '04 FC 39 FA 60 5B 84',
      accessEnabled: false,
      showOverlay: false,
      overlayCard: {},
      reader: null,
      isRedBorder: false,
      socket: null
    };
  },
  mounted() {
    watch(redBorder, (newVal) => {
      this.isRedBorder = newVal

    });
    this.socket = io('http://localhost:3001');
    this.socket.on('rfidData', (data) => {
      const {readerID, card} = data;

      if (card.type === 'défense') {
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

        const reader = this.readersDefense.find(r => r.id === mappedReaderID);

        if (!reader) {
          console.log(`No reader found with mapped ID ${mappedReaderID}.`);
        } else if (reader.id === 2) {
          this.showOverlay = true;
        }
      } else {
        console.log(`Carte non valide: type ${card.type}. Seules les cartes de type défense sont autorisées.`);
      }
    });
  },
  methods: {
    updateReadersDefense(newReaders) {
      this.readersDefense = newReaders;
    }
  }
}
</script>

<style scoped>
.line {
  margin-top: 50px;
  margin-bottom: 50px;
  max-width: 100%;
  min-width: 100%;
  min-height: 50.45px;
  mix-blend-mode: lighten;
  opacity: 0.9;
}

.plateau-finale-defense {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  gap: 15px;
}

@keyframes red-border-flash {

  0% {
    border: 10px solid rgba(255, 0, 0, 0); /* Bordure invisible */
  }
  5% {
    border: 10px solid rgba(255, 0, 0, 0.5); /* Bordure rouge semi-transparente */
  }
  20% {
    border: 10px solid rgba(255, 0, 0, 1); /* Bordure rouge opaque */
  }
  50% {
    border: 10px solid rgba(255, 0, 0, 0.5); /* Bordure rouge semi-transparente */
  }
  100% {
    border: 10px solid rgba(255, 0, 0, 0); /* Bordure invisible */
  }
}

.red-border {
  border: 20px solid transparent;
  animation: red-border-flash 2s ease-out;
  box-sizing: border-box;
  z-index: 1;
}
</style>