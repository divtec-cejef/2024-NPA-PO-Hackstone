<script>
// Importation du fichier JSON des CARTES
//let cardsData = [];

const cardsData = require('../../../cards.json');
const DECK = {
  cardsData
};
const CARTES = DECK.cardsData.cards;
export default {
  methods: {

    /**
     * Génère le deck du défenseur à partir d'un fichier json
     * @returns cartesAttaque cartes présentent dans le deck
     */
    genererDeckAttaque() {
      let cartesAttaque = [];
      for (let i = 0; i < CARTES.length; i++) {
        if (CARTES[i].type === 'attaque') {
          //Retrouve le nombre de fois qu'une carte est présente dans le deck grâce à son nombre d'ID
          for (let j = 0; j < CARTES[i].uid.length; j++)
            cartesAttaque.push(CARTES[i]);
        }
      }
      return cartesAttaque;
    },

    /**
     * Génération d'un nombre entier  aléatoire
     * @param min fourchette minimale
     * @param max fourchette maximale
     * @returns {*} nombre entier aléatoire
     */
    getNombreAleatoire(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Pioche 5 cartes au hasard, si l'ordinateur possède déjà 5 cartes dans sa main, en pioche une seule,
     * ensuite retire les cartes piochées du deck
     * @param cartesDeck cartes présentent dans le deck
     * @param cartesEnMain cartes présentent dans la main de l'ordinateur
     */
    piocher(cartesDeck, cartesEnMain) {
      if (cartesEnMain.length >= 5) {
        let index = this.getNombreAleatoire(0, cartesDeck.length - 1);
        cartesEnMain.push(cartesDeck[index]);
        cartesDeck.splice(index, 1);
      }
      while (cartesEnMain.length < 5) {
        let index = this.getNombreAleatoire(0, cartesDeck.length - 1);
        cartesEnMain.push(cartesDeck[index]);
        cartesDeck.splice(index, 1);
      }
      cartesEnMain.splice(cartesEnMain.length, 1);

    },

    /**
     * Effectue toutes les actions nécessaires au début de n'importe quel tour (excepté le premier)
     * @param cartesDeck cartes présentent dans le deck
     * @param cartesEnMains cartes présentent dans la main de l'ordinateur
     */
    DebutTour(cartesDeck, cartesEnMains) {
      this.piocher(cartesDeck, cartesEnMains);
    },

    /**
     * Pose une carte aléatoire présente dans la main sur la case saisie, si la case est vide
     * @param cartesEnMains cartes présentent dans la main
     * @param reader case sur laquelle la carte va être affichée
     */
    poserCarte(cartesEnMains, reader) {
      if (reader.image === null) {
        let index = 0;
        let cartePosee;
        index = this.getNombreAleatoire(0, cartesEnMains.length - 1);
        cartePosee = cartesEnMains[index];
        reader.image = cartePosee.image;
        cartesEnMains.splice(index, 1);
        console.log(cartePosee);
      }
    },
    /**
     * Retire une carte d'une case
     * @param reader case sur laquelle l'image va être retirée
     */
    retirerCarte(reader){
      reader.image = null;
    }
  }
};
</script>
