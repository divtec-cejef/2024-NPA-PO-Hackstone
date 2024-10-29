<script>
// Importation du fichier JSON des CARTES
import {ref} from "vue";

const CARDS_DATA = require('../../../cards.json');
const DECK = { CARDS_DATA };
const CARTES = DECK.CARDS_DATA.cards;
let pvAnonymous = 2;
let pvSuperAntivirus;
let dejaPosee = false;
let carteEnJeu = [];
export let cartesEnDefense = [null, null, null, null];
export let pv = ref(5);

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
        //Retire la carte piochée du deck
        cartesDeck.splice(index, 1);
      }
      while (cartesEnMain.length < 5) {
        let index = this.getNombreAleatoire(0, cartesDeck.length - 1);
        cartesEnMain.push(cartesDeck[index]);
        cartesDeck.splice(index, 1);
      }
      let anon = cartesDeck.find(carte => carte.name === "Anonymous")
      if (anon !== undefined)
         cartesEnMain.push(anon)
      cartesEnMain.splice(cartesEnMain.length, 1);
    },

    /**
     * Pose une carte aléatoire présente dans la main sur la case saisie, si la case est vide
     * @param cartesEnMains cartes présentent dans la main
     * @param reader zone sur laquelle la carte va être affichée
     * @param readers Liste des zones de cartes
     */
    poserCarte(cartesEnMains, reader, readers) {
      //Vérifie si une carte n'est pas déjà posée
      if (reader.image === null) {
        let index = 0;
        let cartePosee;
        //Génère un nombre aléatoire
        index = this.getNombreAleatoire(0, cartesEnMains.length - 1);
        cartePosee = cartesEnMains[index];
        //Affiche la carte
        reader.image = cartePosee.image;
        reader.name = cartePosee.name
        //Active l'effet de l'Anonymous s'il est posé
        this.arriveeAnonymous(cartePosee, readers);
        //Retire la carte posée de la main de l'ordinateur et l'ajoute dans les cartes en jeu
        cartesEnMains.splice(index, 1);
        carteEnJeu.push(cartePosee);
      }
    },

    /**
     * Retire toutes les cartes en défense lors de l'arrivée de l'anonymous
     * @param card carte scannée
     * @param reader liste des zones de carte
     */
    arriveeAnonymous(card, reader) {
      //Lorsque l'Anonymous rentre sur le terrain, passe ses points de vie à deux
      pvAnonymous = 2;

      //Vérifie si la carte est bel et bien l'anonymous et qu'elle n'a pas déjà été posée
      if (card.name === "Anonymous" && !dejaPosee) {
        dejaPosee = true;

        let readerID = [2, 3, 5, 6];
        for (let i = 0; i < readerID.length; i++){
          //Vérifie si la carte à l'index actuel est un super-antivirus et son nombre de points de vie
          if ((cartesEnDefense[i] !== null && reader[readerID[i]].name !== "Super-antivirus")
               || reader[readerID[i]].name === "Super-antivirus" && pvSuperAntivirus === 1) {
            //Retire la carte du jeu
            cartesEnDefense.splice(i, 1, null);
            reader[readerID[i]].name = null;
            reader[readerID[i]].image = null;

          }else if (reader[readerID[i]].name === "Super-antivirus")
            pvSuperAntivirus = 1;
        }
      }
    },

    /**
     * L'ordinateur attaque les cartes ou les points de vie du joueur
     * @param readers zones contenant les cartes
     * @param card carte attaquante
     */
    attaquer(readers, card){
      let carteDefendue = false;
      for (let j = 0; j < cartesEnDefense.length; j++) {

        //Vérifie s'il y a bel et bien des cartes en défense et si oui,
        //vérifie si elles peuvent contrer la carte attaquante
        if (cartesEnDefense[j] !== null) {
          if (cartesEnDefense[j].counter.includes(card.name)) {
            //Retrouve la position exacte de la carte attaquante
            let carteAttaque = readers.find(carte => carte.name === card.name);
            //Retrouve la position exacte de la carte en défense
            let carteDefense = readers.find(carte => carte.name === cartesEnDefense[j].name);
            carteDefendue = true;

            //Vérifie si la carte attaquante est "Anonymous" et, si oui, son nombre de points de vie
            if ((card.name === "Anonymous" && pvAnonymous < 2)
                || card.name !== "Anonymous") {
              //Retire la carte du jeu
              carteAttaque.image = null;
              carteAttaque.name = null;
              carteEnJeu.splice(carteEnJeu.indexOf(card), 1);
            } else {
              //Retire un point de vie à l'Anonymous s'il survit à l'attaque
              pvAnonymous = 1;
            }

            //Vérifie si la carte attaquante est "Super-antivirus" et, si oui, son nombre de points de vie
            if ((carteDefense.name === "Super-antivirus" && pvSuperAntivirus < 2)
                || carteDefense.name !== "Super-antivirus") {
              //Retire la carte du jeu
              carteDefense.image = null;
              carteDefense.name = null;
              cartesEnDefense.splice(j, 1, null);
            } else {
              //Retire un point de vie au super-antivirus s'il survit à l'attaque
              pvSuperAntivirus = 1;
            }
            break;
          }
        }
      }
      if (!carteDefendue){
        //Retire des points de vie au défenseur si la carte attaquante n'était pas défendue
        this.perdrePvDefenseur();
      }
    },
    /**
     * Gère la perte de PV du défenseur
     */
    perdrePvDefenseur() {
      if (pv.value > 0) {
        pv.value--;
      }
    },
  }
};
</script>
