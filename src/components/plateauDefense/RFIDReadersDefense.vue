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
      <div v-for="reader_defense in bottomReaders" :key="reader_defense.id" :id="'reader_defense' + reader_defense.id" :class="['reader', { accessible: reader_defense.id === 7 && reader_defense.accessible }]">
        <img v-if="reader_defense.image" :src="getImagePath(reader_defense.image)" alt="Card Image" style="max-width: 100%; height: auto;">
        <p v-else></p>
      </div>
    </div>
  </div>
  <div class="hearts">
    <img v-for="n in 5" :key="n" src="../../img_carte/coeur.webp" alt="Heart" class="heart">
  </div>
  <div class="stacked-images">
    <img v-for="(image, index) in images_compteur" :key="index" :src="image" alt="Stacked Image"
         :style="{ visibility: visibility[index] ? 'visible' : 'hidden' }"
         class="stacked-image">
  </div>
</template>

<script>
import io from 'socket.io-client';
// Assurez-vous que le chemin est correct et que vous utilisez bien cette variable
import '@/assets/plateauDefense/RFIDReadersDefense.css';

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
        { id: 7, name: 'Reader 7', image: null, accessible: false }, // Ajoutez une propriété accessible
      ],
      authorizedID: '04 FC 39 FA 60 5B 84', // L'ID autorisé
      accessEnabled: false, // Nouveau état pour l'accès activé
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
      return this.readers.slice(0, 3);
    },
    bottomReaders() {
      return this.readers.slice(3);
    }
  },
  mounted() {
    this.socket = io('http://localhost:3000');
    this.socket.on('rfidData', (data) => {
      const { readerID, card } = data;
      console.log(`Received readerID: ${readerID}`);
      console.log(`Received card ID: ${card.uid}`); // Suppose que le card ID est dans data

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
          mappedReaderID = 4; // Capteur 3 -> Reader 4
          break;
        case 4:
          mappedReaderID = 5; // Capteur 4 -> Reader 5
          break;
        case 5:
          mappedReaderID = 3; // Capteur 5 -> Reader 3
          break;
        case 6:
          mappedReaderID = 6; // Capteur 6 -> Reader 6
          break;
        case 7:
          mappedReaderID = 7; // Capteur 7 -> Reader 7
          break;
      }

      const reader = this.readers.find(r => r.id === mappedReaderID);

      if (!reader) {
        console.log(`No reader found with mapped ID ${mappedReaderID}.`);
      } else if (card.uid === this.authorizedID) {
        // La carte avec l'ID autorisé a été scannée
        this.accessEnabled = true; // Activer l'accès pour tous les lecteurs

        // Déverrouiller le lecteur 7
        const reader7 = this.readers.find(r => r.id === 7);
        if (reader7) {
          reader7.accessible = true;
          console.log(`Authorized card scanned. Reader 7 is now accessible.`);
          console.log("Access enabled:", this.accessEnabled);
        }
        //console.log(`Authorized card scanned. Reader 7 is now accessible.`);
      } else if (reader.id === 4 || reader.id === 5 || reader.id === 6 || (this.accessEnabled && reader.id === 7)) { // Autoriser les autres lecteurs si l'accès est activé
        // Pour ne pas mettre à jour le lecteur 7 si l'accès est déjà activé
        console.log("Access enabled:", this.accessEnabled);
        reader.name = card.name;
        reader.image = card.image;
        console.log(`Reader ${mappedReaderID} updated with image: ${reader.image}`);
        console.log(reader.id);
      } else if (reader.id === 1) {
        this.updateVisibility();
      } else if (reader.id === 2) {
        this.showOverlay = true;
      } else if (reader.id === 3) {
        console.log("Haha je t'attaque");
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
