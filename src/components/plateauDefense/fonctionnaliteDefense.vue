<script>
// Importation du fichier JSON des cartes
let cardsData = [];

cardsData = require('../../../cards.json');
const deck = {
  cardsData
};

const cartes = deck.cardsData.cards;
export default {
  data() {
    return {
      // Initialisation des decks et de la main
      //cartes: cardsData,
      cartesAttaque: [],
      cartesDefense: [],
      cartesEnMains: [],
      buttonHidden: false
    };
  },
  created() {
    // Générer les decks au chargement du composant
    this.cartesAttaque = this.genererDeckAttaque();
    this.cartesDefense = this.genererDeckDefense();

  },
  methods: {

    /**
     * Génère le deck du défenseur à partir d'un fichier json
     * @returns cartesDefense cartes présentent dans le deck
     */
    genererDeckDefense() {
      let cartesDefense = [];
      for (let i = 0; i < cartes.length; i++) {
        if (cartes[i].type === 'défense') {
          for (let j = 0; j < cartes[i].uid.length; j++)
            cartesDefense.push(cartes[i]);
        }
      }
      return cartesDefense;
    },

    /**
     * Génération d'un nombre entier aléatoire
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
     * Effectue toutes les actions nécessaires lors du premier tour de la partie
     * @param cartesDeck cartes présentent dans le deck
     * @param cartesEnMains cartes présentent dans la main de l'ordinateur
     */
    premierTour(cartesDeck, cartesEnMains) {
      cartesDeck = this.genererDeckDefense();
      this.piocher(cartesDeck, cartesEnMains);
      console.log(cartesDeck);
    },

    /**
     * Effectue toutes les actions nécessaires au début de n'importe quel tour (excepté le premier)
     * @param cartesDeck cartes présentent dans le deck
     * @param cartesEnMains cartes présentent dans la main de l'ordinateur
     */
    DebutTour(cartesDeck, cartesEnMains){
      this.piocher(cartesDeck, cartesEnMains);
    }
  }
};
</script>
