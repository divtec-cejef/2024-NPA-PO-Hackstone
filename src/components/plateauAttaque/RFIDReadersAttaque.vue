<template>
  <div class="container">
    <div class="readers">
      <div v-for="reader_attaque in topReaders" :key="reader_attaque.id" :id="'reader_attaque' + reader_attaque.id" class="reader">
        <img v-if="reader_attaque.image" :src="getImagePath(reader_attaque.image)" alt="Card Image" style="max-width: 100%; height: auto;">
        <p v-else></p>
      </div>
    </div>
    <img src="../../img_carte/ligne.png" alt="Ligne" class="line">
    <div class="readers">
      <div v-for="reader in bottomReaders" :key="reader.id" :id="'reader' + reader.id" class="reader">
        <img v-if="reader.image" :src="getImagePath(reader.image)" alt="Card Image" style="max-width: 100%; height: auto;">
        <p v-else></p>
      </div>
    </div>
  </div>
  <div class="coeurs-attaque">
    <img v-for="n in 5" :key="n" src="../../img_carte/coeur.webp" alt="Heart" class="coeur-attaque">
  </div>
  <div class="compteurs-attaque">
    <img v-for="(image, index) in images_compteur" :key="index" :src="image" alt="Stacked Image"
         :style="{ visibility: visibility[index] ? 'visible' : 'hidden' }"
         class="compteur-attaque">
  </div>
</template>

<script>
import io from 'socket.io-client';
import '@/assets/plateauAttaque/RFIDReadersAttaque.css';
import fonctionnaliteAttaque from "./fonctionnaliteAttaque.vue";


let deck = [];
let cartesEnMain = [];
deck = fonctionnaliteAttaque.methods.genererDeckDefense();
export default {
  data() {
    return {
      readers: [
        { id: 1, name: 'Reader 1', image: null },
        { id: 2, name: 'Reader 2', image: null },
        { id: 3, name: 'Reader 3', image: null },
        { id: 4, name: 'Reader 4', image: null },
        { id: 5, name: 'Reader 5', image: null },
        { id: 6, name: 'Reader 6', image: null },
        { id: 7, name: 'Reader 7', image: null },
      ],
      showOverlay: false,
      overlayCard: {},
      socket: null,
      images_compteur: [
        require('@/img_carte/compteur/compteur_1.png'),
        require('@/img_carte/compteur/compteur_2.png'),
        require('@/img_carte/compteur/compteur_3.png'),
        require('@/img_carte/compteur/compteur_4.png'),
        require('@/img_carte/compteur/compteur_5.png')
      ],
      visibility: [true, true, true, true, true]
    };
  },
  computed: {
    topReaders() {
      const top = this.readers.slice(0, 4);
      console.log("Top Readers:", top);  // Pour vérifier les valeurs
      return top;
    },
    bottomReaders() {
      const bottom = this.readers.slice(4, 7);
      console.log("Bottom Readers:", bottom);  // Pour vérifier les valeurs
      return bottom;
    }
  },
  mounted() {
    this.socket = io('http://localhost:3000');
    this.socket.on('rfidData', (data) => {
      const { readerID, card } = data;
      console.log(`Received readerID: ${readerID}`);

      // Mapping des capteurs RFID aux readers
      let mappedReaderID = null;
      switch (parseInt(readerID)) {
        case 1:
          mappedReaderID = 1; // Capteur 1 -> Reader 1
          break;
        case 2:
          mappedReaderID = 2; // Capteur 2 -> Reader 2
          break;
        case 3:
          mappedReaderID = 5; // Capteur 3 -> Reader 4
          break;
        case 4:
          mappedReaderID = 6; // Capteur 4 -> Reader 6
          break;
        case 5:
          mappedReaderID = 3; // Capteur 5 -> Reader 3
          break;
        case 6:
          mappedReaderID = 7; // Capteur 6 -> Reader 7
          break;
        case 7:
          mappedReaderID = 4; // Capteur 7 -> Reader 4
          break;
      }

      const reader = this.readers.find(r => r.id === mappedReaderID);

      if (!reader) {
        console.log(`No reader found with mapped ID ${mappedReaderID}.`);
      } else if (reader.id === 5 || reader.id === 6 || reader.id === 7) {
        reader.name = card.name;
        reader.image = card.image;
        console.log(`Reader ${mappedReaderID} updated with image: ${reader.image}`);
      } else if (reader.id === 1) {


        //if (premierTour)
        fonctionnaliteAttaque.methods.DebutTour(deck, cartesEnMain);
        let case2 = this.readers.find(test => test.id === 2);
        let case3 = this.readers.find(test => test.id === 3);

        if (reader.image === null)
          fonctionnaliteAttaque.methods.poserCarte(cartesEnMain, reader)

        if (case2.image === null)
          fonctionnaliteAttaque.methods.poserCarte(cartesEnMain, case2)

        if (case3.image === null)
          fonctionnaliteAttaque.methods.poserCarte(cartesEnMain, case3)

        console.log("Cartes en main : ");
        console.log(cartesEnMain);
        console.log("Cartes restantes dans le deck : ")
        console.log(deck);

        this.updateVisibility();
      } else if (reader.id === 2) {
        this.showOverlay = true;
      } else if (reader.id === 3) {
        console.log("Haha je t'attaque")
      }

    });
  },
  methods: {
    getImagePath(image) {
      try {
        return require(`@/${image}`);
      } catch (e) {
        console.error("Image not found:", image);
        return ''; // Return a default or empty string if image not found
      }
    },
    closeOverlay() {
      this.showOverlay = false;
    },
    updateVisibility() {
      for (let i = this.visibility.length - 1; i >= 0; i--) {
        if (this.visibility[i]) {
          this.visibility[i] = false;
          break;
        }
      }
    },
    handleButtonClick(){
      let deckAttaque = [];
      deckAttaque = fonctionnaliteAttaque.methods.genererDeckAttaque();
      console.log(deckAttaque);

    }
  }
};

</script>
