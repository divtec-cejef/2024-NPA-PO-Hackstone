<template>
  <div class="container">
    <h1>Information sur la carte : {{ cardName }}</h1>
    <div class="container-2">
      <div class="affichage_carte">
        <img v-if="image" :src="getImagePath(image)" alt="Defense Card" class="defense-card">
        <p v-else></p>
      </div>
      <div class="container-3">
        <div class="description_jeu">
          <p><b> Déscription jeu : </b></p>
          <P>{{ descriptionJeu }}</P>
        </div>

        <div class="description_vie">
          <p><b>Déscription vie :</b></p>
          <p>{{ descriptionVie }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      cardName: '', // Ajout de la propriété réactive pour stocker le nom de la carte
      image: '',    // Si tu souhaites également gérer l'image de la carte
      descriptionJeu: '',
      descriptionVie: ''
    };
  },

  mounted() {
    this.socket = io('http://localhost:3003');
    this.socket.on('rfidData', (data) => {
      console.log('Données RFID reçues:', data);
      let { readerID, card } = data;

      // Nettoie readerID pour enlever les caractères non numériques
      readerID = readerID.replace(/\D/g, ''); // Garde seulement les chiffres

      if (readerID === '2') {
        this.cardName = card.name
        this.image = card.image
        this.descriptionJeu = card.description_jeu
        this.descriptionVie = card.description_vie
      }
    });
  },
  methods: {
    getImagePath(image) {
      try {
        return require(`@/${image}`);
      } catch (e) {
        console.error("Image not found:", image);
        return ''; // Retourne un chemin vide si l'image n'est pas trouvée
      }
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container-2 {
  display: flex;
  flex-direction: row;
}

.container-3 {
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 72px;
  color: black;
  text-align: center;
}

.affichage_carte {
  width: 400px;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 130px;
}

img {
  border-radius: 5px;
  height: 98%;
}

.description_jeu, .description_vie {
  width: 800px;
  height: 300px;
  border: 4px solid white;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.24) 0 3px 8px;
  padding-left: 20px;
  margin: 15px
}

p {
  margin: 10px;
  font-size: 38px;
}

</style>