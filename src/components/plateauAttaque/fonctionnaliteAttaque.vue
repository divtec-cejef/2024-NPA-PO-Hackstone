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
    // Génère le deck de l'attaquant
    genererDeckAttaque() {
      let cartesAttaque = [];

      for (let i = 0; i < cartes.length; i++) {
        if (cartes[i].type === 'attaque') {
          for (let j = 0; j < cartes[i].uid.length; j++)
          cartesAttaque.push(cartes[i]);
        }
      }
      console.log(cartesAttaque);
      return cartesAttaque;
    },

    // Génère un nombre aléatoire entre min et max
    getNombreAleatoire(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Pioche des cartes dans le deck
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
    },

    // Action du bouton pour piocher des cartes
    piocherCartes() {
      this.piocher(this.cartesAttaque, this.cartesEnMains);
      this.piocher(this.cartesAttaque, this.cartesEnMains);
      this.buttonHidden = true; // Cache le bouton après avoir pioché
    }
  }
};
</script>
