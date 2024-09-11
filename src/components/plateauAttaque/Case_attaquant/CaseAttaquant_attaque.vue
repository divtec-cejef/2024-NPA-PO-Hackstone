<template>
  <div class="bottomReaders_attaque">
    <!-- Case de l'attaque -->
    <div v-for="bottomReader_attaque in bottomReaders_attaque"
         :key="bottomReader_attaque.id"
         :id="'bottomReader_attaque' + bottomReader_attaque.id"
         class="bottomReader_attaque">
      <img v-if="bottomReader_attaque.image" :src="getImagePath(bottomReader_attaque.image)" alt="Card Image" style="max-width: 100%; height: auto;">
      <p v-else></p>
    </div>
  </div>
</template>

<script>
import mappedReaderID from "@/components/plateauAttaque/RFIDReadersAttaque.vue";

export default {
  props: {
    readers: {
      type: Array,
      required: true
    },
    socket: {
      type: Object,
      required: true
    }
  },
  computed: {
    bottomReaders_attaque() {
      const bottom = this.readers.slice(4, 7);
      console.log("Bottom Readers:", bottom);  // Pour vérifier les valeurs
      return bottom;
    },
  },

  mounted() {
    // Ecouter les données RFID via socket
    this.socket.on('rfidData', (data) => {
      const { readerID, card } = data;
      console.log(`Received readerID: ${readerID} with card: ${card.name}`);

      const reader = this.readers.find(r => r.id === mappedReaderID);

      if (reader.id === 5 || reader.id === 6 || reader.id === 7) {
        reader.name = card.name;
        reader.image = card.image;
        console.log(`Reader ${mappedReaderID} updated with image: ${reader.image}`);
      } else {
        console.log(`No reader found with mapped ID ${mappedReaderID}.`);
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
    }
  }
};
</script>

<style scoped>
.bottomReaders_attaque {
  display: flex;
  justify-content: center;
  gap: 147px;
}

.bottomReader_attaque {
  width: 270px;
  height: 380px;
  border-width: 4px;
  border-style: solid;
  border-color: white;
  border-image: initial;

  font-size: 24px;
  justify-content: center;
  display: flex;
  align-items: center;
}
</style>