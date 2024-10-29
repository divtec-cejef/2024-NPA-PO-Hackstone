<script>
// Importation du fichier JSON des CARTES
//let cardsData = [];
import {ref} from "vue";

let pvAnonymous = 2;
let pvSuperAntivirus
let dejaPosee = false;
let carteEnJeu = [];

export let pv = ref(5)
const cardsData = require('../../../cards.json');
export let cartesEnDefense = [null, null, null, null];
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
      // let anon = cartesDeck.find(carte => carte.name === "Anonymous")
      // if (anon !== undefined)
      //   cartesEnMain.push(anon)
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
     * @param readers Liste des cases
     */
    poserCarte(cartesEnMains, reader, readers) {
      if (reader.image === null) {
        let index = 0;
        let cartePosee;
        index = this.getNombreAleatoire(0, cartesEnMains.length - 1);
        cartePosee = cartesEnMains[index];
        reader.image = cartePosee.image;
        reader.name = cartePosee.name
        this.arriveeAnonymous(cartePosee, readers);
        cartesEnMains.splice(index, 1);
        carteEnJeu.push(cartePosee);
      }
    },
    /**
     * Retire une carte d'une case
     * @param reader case sur laquelle l'image va être retirée
     */
    retirerCarte(reader){
      reader.image = null;
    },
    /**
     * Retire toutes les cartes en défense lors de l'arrivée de l'anonymous
     * @param card carte scannée
     * @param reader liste des cases
     */
    arriveeAnonymous(card, reader) {
      pvAnonymous = 2;
      console.log("defense", cartesEnDefense)
      //Vérifie si la carte est bel et bien l'anonymous et qu'elle n'a pas déjà été posée
      if (card.name === "Anonymous" && !dejaPosee) {
        dejaPosee = true;
        let readerID = [2, 3, 5, 6];
        for (let i = 0; i < readerID.length; i++){
          if (cartesEnDefense[i] !== null && reader[readerID[i]].name !== "Super-antivirus") {
            cartesEnDefense.splice(i, 1, null);
            reader[readerID[i]].name = null;
            reader[readerID[i]].image = null;
          }else if (reader[readerID[i]].name === "Super-antivirus" && pvSuperAntivirus === 1) {
            reader[readerID[i]].name = null;
            reader[readerID[i]].image = null;
            cartesEnDefense.splice(i, 1, null);
          }else if (reader[readerID[i]].name === "Super-antivirus")
            pvSuperAntivirus = 1;
        }
      }
    },

    attaquer(readers, card){
      console.log("J?ATTAQUE")
      let carteDefendue = false;
      for (let j = 0; j < cartesEnDefense.length; j++) {

        if (cartesEnDefense[j] !== null) {
          if (cartesEnDefense[j].counter.includes(card.name)) {
            let carteAttaque = readers.find(carte => carte.name === card.name);
            let carteDefense = readers.find(carte => carte.name === cartesEnDefense[j].name);
            carteDefendue = true;

            if ((card.name === "Anonymous" && pvAnonymous < 2)
                || card.name !== "Anonymous") {
              carteAttaque.image = null;
              carteAttaque.name = null;
              carteEnJeu.splice(carteEnJeu.indexOf(card), 1);
            } else
              pvAnonymous = 1;

            if ((carteDefense.name === "Super-antivirus" && pvSuperAntivirus < 2)
                || carteDefense.name !== "Super-antivirus") {
              carteDefense.image = null;
              carteDefense.name = null;
              cartesEnDefense.splice(j, 1, null);
            } else
              pvSuperAntivirus = 1;
            break;
          }
        }
      }
      if (!carteDefendue){
        this.perdrePvAttaquant();
      }
    },
    /**
     * Gère la perte de PV du défenseur
     */
    perdrePvAttaquant() {
      if (pv.value > 0) {
        pv.value--;
        console.log("pv", pv.value);
      }
    },
  }
};
</script>
