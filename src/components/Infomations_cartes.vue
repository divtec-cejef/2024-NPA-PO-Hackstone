<template>
  <h1>Information sur la carte : </h1>

</template>

<script>
import io from "socket.io-client";

export default {
  mounted() {
    this.socket = io('http://localhost:3003');
    this.socket.on('rfidData', (data) => {
      console.log('Données RFID reçues:', data);
      const { readerID, card } = data;
      if (card) {
        console.log("Lecteur scanné : ", readerID)
        console.log('Données de la carte:', card);
      } else {
        console.log('Carte inconnue');
      }
    });
  }
}
</script>

<style scoped>
h1 {
  font-size: 72px;
  color: red;
}
</style>