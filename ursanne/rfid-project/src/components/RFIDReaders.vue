<template>
  <div>
    <div class="readers">
      <div v-for="reader in readers" :key="reader.id" :id="'reader' + reader.id" class="reader">
        <img :src="reader.image" alt="Card Image" style="max-width: 100%; height: auto;">
      </div>
    </div>
    <div v-if="showOverlay" id="overlay">
      <div class="card-details">
        <h2>{{ overlayCard.name }}</h2>
        <img :src="overlayCard.image" alt="Card Image">
        <p>{{ overlayCard.description_vie }}</p>
        <p>{{ overlayCard.description_jeu }}</p>
        <button @click="closeOverlay">Close</button>
      </div>
    </div>
  </div>
</template>



<script>
import io from 'socket.io-client';
import '../assets/RFIDReaders.css'; // Import du fichier CSS

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
    };
  },
  mounted() {
    this.socket = io('http://localhost:3000');
    this.socket.on('rfidData', (data) => {
      const { readerID, card } = data;
      const reader = this.readers.find(r => r.id === parseInt(readerID));
      if (reader) {
        reader.name = card.name;
        reader.image = card.image;  // Mettez à jour l'image du lecteur avec celle de la carte
      }

      if (readerID === '7') {  // Ou toute autre condition que vous souhaitez pour afficher le popup
        this.overlayCard = card;
        this.showOverlay = true;
      }
    });
  },


  methods: {
    closeOverlay() {
      this.showOverlay = false;
    }
  }
};
</script>
