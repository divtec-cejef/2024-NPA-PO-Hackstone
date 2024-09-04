<template>
  <div class="container">
    <div class="readers">
      <div v-for="reader in topReaders" :key="reader.id" :id="'reader' + reader.id" class="reader">
        <img v-if="reader.image" :src="getImagePath(reader.image)" alt="Card Image" style="max-width: 100%; height: auto;">
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
    console.log('Trying to connect to WebSocket on port 3001');
    this.socket = io('http://localhost:3001');
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server on port 3001');
    });

    this.socket.on('rfidData', (data) => {
      const { readerID, card } = data;
      console.log(`Received readerID: ${readerID}`);
      const reader = this.readers.find(r => r.id === parseInt(readerID));
      if (reader) {
        reader.name = card.name;
        reader.image = card.image;
        console.log(`Reader ${readerID} updated with image: ${reader.image}`);
      } else {
        console.log(`No reader found with ID ${readerID}.`);
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
    }
  }
};
</script>
