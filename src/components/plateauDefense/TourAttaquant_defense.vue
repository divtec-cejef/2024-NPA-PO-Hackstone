<template>
  <div class="compteurs-defense">
    <img v-for="(image, index) in images_compteur" :key="index" :src="image" alt="Stacked Image"
         :style="{ visibility: visibility[index] ? 'visible' : 'hidden' }"
         class="compteur-defense">
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      images_compteur: [
        require('@/img/compteur/compteur_1.png'),
        require('@/img/compteur/compteur_2.png'),
        require('@/img/compteur/compteur_3.png'),
        require('@/img/compteur/compteur_4.png'),
        require('@/img/compteur/compteur_5.png')
      ],
      visibility: [true, true, true, true, true]
    };
  },

  mounted() {
    this.socket = io('http://localhost:3001');

    this.socket.on('rfidData', (data) => {
      const { readerID } = data;

      // Vérifier si le readerID est 1
      if (readerID === '1)') {
        this.updateVisibility();
      }

    });
  },
  methods: {
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

<style scoped>
.compteurs-defense {
  position: absolute;
  top: 50px;
  right: 50px; /* Positionner les images en haut à droite */
}

.compteur-defense {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 0;
  right: 0;
}
</style>