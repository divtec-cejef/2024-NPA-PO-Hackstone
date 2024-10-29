<script>
import {ref} from "vue";
// Importation de `ref` pour créer des variables réactives
export let pv = ref(5);
export let stockage = ref(false);
export let dejaAttaquer = [];
export let cartesAttaque = [];

// Importation du fichier JSON des CARTES
let cardsData = require('../../../cards.json');
let carteEnJeu = [];
let pvAnonymous = 2;
let pvSuperAntivirus = 2;
let nbrAttaqueAnonymous = 0;
let dejaPosee = false;

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
    genererDeckDefense() {
      let cartesAttaque = [];
      for (let i = 0; i < CARTES.length; i++) {
        if (CARTES[i].type === 'défense') {
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
      let stockagePresent = cartesEnMain.some(a => a.name === "Stockage");

      if (stockagePresent) {
        console.log("Cadenas");
        stockage.value = true;
        let indexStockage = cartesEnMain.find(index => index.name === "Stockage");
        cartesEnMain.splice(cartesEnMain.indexOf(indexStockage), 1)
      }
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
     * Permet à l'ordinateur de remplir son terrain grâce aux cartes qu'il a dans sa main
     * @param cartesEnMains carte dans la main de l'ordinateur
     * @param reader lecteurs sur lesquels les cartes sont posées
     */
    poserCarte(cartesEnMains, reader) {
      //Pose une carte seulement s'il n'y en a pas une de déjà posé
      if (reader.image === null) {
        let index = 0;
        let cartePosee;

        //Empêche la redondance de données d'être la première carte posée sur le terrain
        // afin qu'elle puisse copier une carte déjà présente
        do {
          index = this.getNombreAleatoire(0, cartesEnMains.length - 1);
          cartePosee = cartesEnMains[index];
        } while (cartePosee.name === "Redondance de données" && carteEnJeu.length === 0);

        //La carte redondance de données devient une copie de la carte sur la case de gauche.
        if (cartePosee.name === "Redondance de données") {
          console.log("Redondance de données");
          cartePosee = carteEnJeu[0];
        }
        //Change le nom et l'image des cases à l'écran par ceux de la carte scannée
        reader.image = cartePosee.image;
        reader.name = cartePosee.name;
        cartesEnMains.splice(index, 1);

        carteEnJeu.push(cartePosee);
      }
    },

    /**
     * Retire toutes les cartes en défense lors de l'arrivée de l'anonymous
     * @param card carte scannée
     * @param reader liste des cases
     */
    arriveeAnonymous(card, reader) {
      pvAnonymous = 2;
      //Vérifie si la carte est bel et bien l'anonymous et qu'elle n'a pas déjà été posée
      if (card.name === "Anonymous" && !dejaPosee) {
        dejaPosee = true;

        //Vide les cases
        if(reader[0].name !== "Super-antivirus") {
          let carteDef = carteEnJeu.find(carte => carte.name === reader[0].name);
          console.log("carte def", carteDef)
          let indexDef = carteEnJeu.indexOf(carteDef);
          console.log("index carte", indexDef);
          carteEnJeu.splice(indexDef, 1);
          reader[0].name = null;
          reader[0].image = null;
        }else
          pvSuperAntivirus = 1;

        if(reader[1].name !== "Super-antivirus") {
          let carteDef = carteEnJeu.find(carte => carte.name === reader[1].name);
          console.log("carte def2", carteDef)
          let indexDef = carteEnJeu.indexOf(carteDef);
          console.log("index def2", indexDef)
          carteEnJeu.splice(indexDef, 1);
          reader[1].name = null;
          reader[1].image = null;
        }else
          pvSuperAntivirus = 1;

        if(reader[4].name !== "Super-antivirus") {
          let carteDef = carteEnJeu.find(carte => carte.name === reader[4].name);
          console.log("carte def3", carteDef)
          let indexDef = carteEnJeu.indexOf(carteDef);
          console.log("index def3", indexDef)
          carteEnJeu.splice(indexDef, 1);
          reader[4].name = null;
          reader[4].image = null;
        }else
          pvSuperAntivirus = 1;

        if(reader[6].name !== "Super-antivirus") {
          let carteDef = carteEnJeu.find(carte => carte.name === reader[6].name);
          console.log("carte def4", carteDef)
          let indexDef = carteEnJeu.indexOf(carteDef);
          console.log("index def4", indexDef)
          carteEnJeu.splice(indexDef, 1);
          reader[6].name = null;
          reader[6].image = null;
        }else
          pvSuperAntivirus = 1;
        //Vide la liste des cartes en jeu, car plus aucune n'est présente
      }
    },

    /**
     * L'ordinateur pose des cartes en défense en fonction de celle présente en attaque
     * @param cartesEnMains cartes dans la main de l'ordinateur
     * @param reader case sur laquelle la carte va être posée
     * @param emplacementListe permet d'ordrer la liste des cartes en jeu en fonction de leur ordre sur le plateau
     */
    defendMalin(cartesEnMains, reader, emplacementListe) {
      nbrAttaqueAnonymous = 0;

      //Pose une carte seulement s'il n'y en a pas une de déjà posé
      if (reader.image === null) {
        let cartePosee = null;

        outerLoop:
            for (let i = 0; i < cartesAttaque.length; i++) {
              for (let j = 0; j < cartesEnMains.length; j++) {

                let carteEnMainCounter = cartesEnMains[j].counter;

                if (carteEnMainCounter.includes(cartesAttaque[i].name)) {
                  cartePosee = cartesEnMains[j];

                  //Empêche la redondance de données d'être la première carte posée sur le terrain
                  // afin qu'elle puisse copier une carte déjà présente
                  if (cartePosee.name === "Redondance de données") {

                    if (carteEnJeu.length === 0) {
                      cartePosee = cartesEnMains[j + 1];
                    } else {
                      cartePosee = carteEnJeu[0];
                    }
                  }
                }
                  if (cartePosee !== null) {
                    reader.image = cartePosee.image;
                    reader.name = cartePosee.name;
                    cartesEnMains.splice(j, 1);
                    carteEnJeu.splice(emplacementListe, 0, cartePosee);
                    break outerLoop;
                  }
              }
            }
        if (cartePosee === null) {
          this.poserCarte(cartesEnMains, reader);
        }
      }
    },

    /**
     * Gère la perte de PV de l'attaquant
     */
    perdrePvAttaquant() {
      if (pv.value > 0) {
        pv.value--;
        console.log("pv", pv.value);
      }
    },

    /**
     * Permet de reset la valeur de la liste dejaAttaquer depuis un autre composant
     */
    resetDejaAttaquer() {
      dejaAttaquer = [];
    },

    /**
     * Permet de retrouver un objet par rapport à son nom dans une liste
     * @param object objet a retrouvé dans la liste
     * @param liste dans laquelle chercher l'objet
     * @returns {*} l'objet, s'il est présent dans la liste
     */
    trouverObjet(object, liste) {
      return liste.find(objet => objet.name === object.name);
    },

    /**
     * Permet de retrouver la case qui contient la carte en défense
     * @param readers liste des cases
     * @param card carte en attaque
     * @returns {*} l'emplacement de la carte en défense
     */
    trouverCarteDefense(readers, card) {
      return readers.find(defenseur => card.counter.includes(defenseur.name));
    },

    /**
     *Permet à l'utilisateur d'attaquer les cartes de l'ordinateur,
     * les attaques se font automatiquement sur la bonne carte
     * @param card carte qui va attaquer
     * @param reader lecteur sur lequel la carte est posée
     * @param readers liste des lecteurs
     */
    attaquerNouveau(card, reader, readers) {
      let counterCarteEnJeu = [];
      let carteDefendu = false;
      let indexCarteScannee = cartesAttaque.indexOf(this.trouverObjet(card, cartesAttaque));

      //Retrouve le nombre de fois qu'une carte est présente sur le plateau
      const occurrences = cartesAttaque.filter(c => c.name === card.name).length;

      //Retire la carte attaquante des cartes en attaque
      cartesAttaque.splice(indexCarteScannee, 1);

      //Test si la carte qui attaque est présente plus d'une fois
      if (occurrences === 1) {
        if (card.name === "Anonymous") {
          nbrAttaqueAnonymous++;
          if (nbrAttaqueAnonymous >= 2)
            dejaAttaquer.push(card);
        } else
          dejaAttaquer.push(card);
      }

      //Fonction permettant d'arrêter les deux boucles à un moment donné
      outerLoop:
          //Boucle passant sur chaque case de l'ordinateur
          for (let j = 0; j < carteEnJeu.length; j++) {
            //Liste des cartes qui contrent les cartes présentent sur le jeu
            counterCarteEnJeu = carteEnJeu[j].counter;

            //Boucle passant tous les contre des cartes
            for (let i = 0; i < counterCarteEnJeu.length; i++) {
              //Test si la carte qui attaque à un contre présent sur le terrain
              if (counterCarteEnJeu.includes(card.name)) {
                carteDefendu = true;

                //Retrouve les cases sur lesquelles les cartes sont présentes
                let carteDefense = this.trouverObjet(carteEnJeu[j], readers);

                //Retire le nom et l'image de la carte détruite de leur case
                //et détruit l'Anonymous et le super-antivirus uniquement s'ils ont déjà été attaqués une fois
                if ((carteDefense.name === "Super-antivirus" && pvSuperAntivirus === 1)
                    || carteDefense.name !== "Super-antivirus") {

                  //Retire la carte détruite du jeu
                  carteDefense.image = null;
                  carteDefense.name = null;
                  carteEnJeu.splice(j, 1);

                } else
                  pvSuperAntivirus = 1;

                if ((reader.name === "Anonymous" && pvAnonymous === 1) || reader.name !== "Anonymous") {
                  reader.image = null;
                  reader.name = null;

                } else
                  pvAnonymous = 1;
                //Termine la fonction une fois qu'une carte a été détruite
                break outerLoop;
              }
            }
          }
      if (!carteDefendu) {
        //Retire des points de vie au défenseur et rajoute la carte dans la liste si elle n'est pas défendue
        this.perdrePvAttaquant();
        cartesAttaque.push(card);
      }
      if (card.name === "Anonymous" && pvAnonymous > 0 && nbrAttaqueAnonymous < 2) {
        //S'il reste des points de vie et des attaques disponibles à l'anonymous, le rajoute dans la liste
        card.poseeDepuis = 2;
        cartesAttaque.push(card);
      }
    },

    /**
     * Vérifie si une carte remplie les conditions nécessaires pour attaquer
     * @param card carte à vérifier
     * @returns {boolean} si oui ou non la carte peut attaquer
     */
    peutAttaquer(card) {

      let carteDejaAttaquer = dejaAttaquer.some(carteAttaquante => carteAttaquante.name === card.name);
      let carteTrouvee = cartesAttaque.some(cartes => cartes.name === card.name);
      let cartePresenteDepuis = this.trouverObjet(card, cartesAttaque);

      if (cartePresenteDepuis.poseeDepuis >= 2 && !carteDejaAttaquer && carteTrouvee) {
        return true

      } else if (carteDejaAttaquer) {
        alert("Cette carte a deja attaquer")
        cartesAttaque.push(card);

      } else if (card.poseeDepuis < 2) {
        alert("Vous devez attendre un tour avant d'attaquer")
        cartesAttaque.push(card);

      } else if (!carteTrouvee)
        alert("Carte pas posée");

      return false;
    }
  }
};
</script>