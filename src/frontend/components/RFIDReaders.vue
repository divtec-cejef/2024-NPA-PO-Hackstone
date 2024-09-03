<template>
  <div class="container">

    <div class="readers ">
      <div v-for="reader in topReaders" :key="reader.id" :id="'reader' + reader.id" class="reader">
        <img :src="reader.image" alt="Card Image" style="max-width: 100%; height: auto;">
      </div>
    </div>
    <button>Piocher</button>
    <img src="../img_carte/ligne.png" alt="Ligne" class="line">
    <div class="readers">
      <div v-for="reader in bottomReaders" :key="reader.id" :id="'reader' + reader.id" class="reader">
        <img :src="reader.image" alt="Card Image" style="max-width: 100%; height: auto;">
      </div>
    </div>
  </div>
  <div class="hearts">
    <img v-for="n in 5" :key="n" src="../img_carte/coeur.webp" alt="Heart" class="heart">
  </div>
  <div class="stacked-images">
    <img v-for="(image, index) in images_compteur" :key="index" :src="image" alt="Stacked Image"
         :style="{ visibility: visibility[index] ? 'visible' : 'hidden' }"
         class="stacked-image">
  </div>

</template>

<script>
import io from 'socket.io-client';
import '@/assets/RFIDReaders.css';

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
      images_compteur: [  // Utilisez require pour les chemins relatifs
        require('@/img_carte/compteur/compteur_1.png'),
        require('@/img_carte/compteur/compteur_2.png'),
        require('@/img_carte/compteur/compteur_3.png'),
        require('@/img_carte/compteur/compteur_4.png'),
        require('@/img_carte/compteur/compteur_5.png')
      ],
      visibility: [true, true, true, true, true]  // Initialement toutes les images sont visibles
    };
  },
  computed: {
    topReaders() {
      return this.readers.slice(0, 3); // Les 3 premiers lecteurs
    },
    bottomReaders() {
      return this.readers.slice(3); // Les 4 derniers lecteurs
    }
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

        if (card.uid === '04 5F 38 FA 60 5B 84') {
          this.updateVisibility();
        }
      }
    });
  },

  methods: {
    closeOverlay() {
      this.showOverlay = false;
    }
  },
  updateVisibility() {
    // Cache les images du compteur une par une
    for (let i = this.visibility.length - 1; i >= 0; i--) {
      if (this.visibility[i]) {
        this.visibility[i] = false;
        break;
      }
    }
  }
};
</script>

