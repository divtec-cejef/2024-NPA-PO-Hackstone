<template>
  <div class="container">
    <h1>Information sur la carte : {{ cardName }}</h1>
    <div class="container-2">
      <div class="affichage_carte">
        <img v-if="image_info" :src="getImagePath(image_info)" alt="{{cardType}} card" class="carte_posee">
        <p v-else></p>
      </div>
      <div class="container-3">
        <div class="description_jeu">
          <p><b> Description jeu : </b></p>
          <P>{{ descriptionJeu }}</P>
          <P><b>Type en jeu : {{ cardType }}</b></P>
        </div>

        <div class="description_vie">
          <p><b>Description vie :</b></p>
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
      cardName: '',
      cardType: '',
      image_info: '',
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

      if (readerID !== '1' && readerID !== '7' && readerID !== '5' && card.type === 'attaque') {
        this.cardName = card.name
        this.cardType = card.type
        this.image_info = card.image_info
        this.descriptionJeu = card.description_jeu
        this.descriptionVie = card.description_vie
      } else if (readerID !== '5' && readerID !== '1' && card.type === 'défense') {
        this.cardName = card.name
        this.cardType = card.type
        this.image_info = card.image_info
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
  text-align: justify;
  background-color: rgba(0, 0, 0, .3);
}

.container-2 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.container-3 {
  display: flex;
  flex-direction: column;
}

h1 {
  font-size: 72px;
  color: white;
  text-align: center;
}

.affichage_carte {
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 80px;
  border-radius: 10px;
}

img {
  border-radius: 5px;
  height: 645px;
  box-shadow: rgba(0, 0, 0, 0.5) 0 3px 8px;
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
}
.description_jeu {
  margin: 0 0 15px 0;
}
.description_vie {
  margin: 15px 0 0 0;
}

p {
  margin: 10px 20px 10px 0;
  font-size: 30px;
  color: white;
}

</style>