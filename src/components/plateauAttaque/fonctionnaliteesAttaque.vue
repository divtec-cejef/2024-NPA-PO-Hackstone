<script>
import {ref} from "vue";
// Importation de `ref` pour créer des variables réactives
export let pv = ref(5);
export let stockage = ref(false);
// Importation du fichier JSON des CARTES
let cardsData = require('../../../cards.json');
let carteEnJeu = [];
let pvAnonymous = 2;
let pvSuperAntivirus = 2;
let nbrAttaqueAnonymous = 0;
let dejaPosee = false;

export let dejaAttaquer = [];
export let cartesAttaque = [];

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
     *Permet à l'utilisateur d'attaquer les cartes de l'ordinateur,
     * les attaques se font automatiquement sur la bonne carte
     * @param card carte qui va attaquer
     * @param readers lecteur sur lesquelles les cartes sont posées
     */
    attaquer(card, readers) {
      let counterCarteEnJeu = [];
      let carteDefendu = false;

      //Recherche si la carte est bel et bien présente sur le jeu
      let carteTrouvee = cartesAttaque.some(cartes => cartes.name === card.name);

      //Retrouve la carte afin de savoir depuis quand elle est présente sur le jeu
      let cartePresenteDepuis = this.trouverObjet(card, cartesAttaque);

      //Retrouve si la carte a déjà attaqué ou non.
      let carteDejaAttaquer = dejaAttaquer.some(carteAttaquante => carteAttaquante.name === card.name);

      let indexCarteScannee = cartesAttaque.indexOf(this.trouverObjet(card, cartesAttaque));

      //Retrouve le nombre de fois qu'une carte est présente sur le plateau
      const occurrences = cartesAttaque.filter(c => c.name === card.name).length;
      console.log("Carte trouvée", carteTrouvee);
      cartesAttaque.splice(indexCarteScannee, 1);
      //Test si la carte est présente, si elle ne vient pas d'être posée et si elle n'a pas déjà attaqué
      if (carteTrouvee && cartePresenteDepuis.poseeDepuis === 2 && !carteDejaAttaquer) {
        //Test si la carte qui attaque est présente plus d'une fois
        if (occurrences === 1) {
          if (card.name === "Anonymous"){
            nbrAttaqueAnonymous++;
            if(nbrAttaqueAnonymous >= 2)
              dejaAttaquer.push(card);
          }else
            dejaAttaquer.push(card);
        }
        console.log("Deja attaquer", dejaAttaquer);
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
                  let carte = this.trouverObjet(carteEnJeu[j], readers);
                  let carte2 = this.trouverObjet(card, readers);

                  //Retire le nom et l'image de la carte détruite de leur case
                  //et détruit l'Anonymous et le super-antivirus uniquement s'ils ont déjà été attaqués une fois
                  if ((carte.name === "Super-antivirus" && pvSuperAntivirus === 1) || carte.name !== "Super-antivirus") {
                    carte.image = null;
                    carte.name = null;
                    carteEnJeu.splice(j, 1);
                  } else
                    pvSuperAntivirus = 1;

                  if ((carte2.name === "Anonymous" && pvAnonymous === 1) || carte2.name !== "Anonymous") {
                    carte2.image = null;
                    carte2.name = null;

                  } else
                    pvAnonymous = 1;

                  //Termine la fonction une fois qu'une carte a été détruite
                  break outerLoop;
                }
              }
            }
        if (!carteDefendu) {
          console.log("carte pas defendue")
          this.perdrePvAttaquant();
          cartesAttaque.push(card);
        }
      } else if (!carteTrouvee) {
        alert("Carte pas présente")
      }else if (carteDejaAttaquer) {
        cartesAttaque.push(card);
        alert("cette carte a deja attaquer")
      } else if (cartePresenteDepuis.poseeDepuis !== 2 ){
        cartesAttaque.push(card);
        alert("Vous devez attendre un tour avant de pouvoir attaquer avec cette carte !")
      }
      if (card.name === "Anonymous" && pvAnonymous > 0 && nbrAttaqueAnonymous < 2){
        card.poseeDepuis = 2;
        cartesAttaque.push(card);
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
        reader[0].name = null;
        reader[0].image = null;
        reader[1].name = null;
        reader[1].image = null;
        reader[4].name = null;
        reader[4].image = null;
        reader[6].name = null;
        reader[6].image = null;
        //Vide la liste des cartes en jeu, car plus aucune n'est présente
        carteEnJeu = [];
      }
    },
    defendMalin(cartesEnMains, reader) {
      nbrAttaqueAnonymous = 0;
      let test = [];
      for (let a = 0; a < cartesAttaque.length; a++)
        test.push(cartesAttaque[a]);
      console.log("Test ", test)

      let stockagePresent = cartesEnMains.some(a => a.name === "Stockage")
      if(stockagePresent) {
        console.log("Cadenas");
        stockage.value = true;
        let indexStockage = cartesEnMains.find(index => index.name === "Stockage" );
        console.log("index stockage", indexStockage);
        cartesEnMains.splice(cartesEnMains.indexOf(indexStockage), 1)
      }
      //Pose une carte seulement s'il n'y en a pas une de déjà posé
      if (reader.image === null) {
        let cartePosee = null;
        console.log("Cartes en main", cartesEnMains)
        console.log("Cartes en jeu", carteEnJeu)
        //Empêche la redondance de données d'être la première carte posée sur le terrain
        // afin qu'elle puisse copier une carte déjà présente

        outerLoop:
            for (let i = 0; i < test.length; i++) {
              for (let j = 0; j < cartesEnMains.length; j++) {
                //cartePosee = cartesEnMains[j];
                // if (cartesEnMains[j].name === "Stockage") {
                //   console.log("Cadenas");
                //   stockage = true;
                //   cartesEnMains.splice(j, 1);
                //   // Case_4_Defenseur_Attaque.methods.triggerLockAnimation();
                //   // cartePosee = cartesEnMains[j];
                // } else {
                let carteEnMainCounter = cartesEnMains[j].counter;
                if (carteEnMainCounter.includes(test[i].name)) {
                  cartePosee = cartesEnMains[j];
                  if (cartePosee.name === "Redondance de données") {
                    if (carteEnJeu.length === 0) {
                      cartePosee = cartesEnMains[j + 1];
                    } else {
                      cartePosee = carteEnJeu[0];
                    }
                  }
                }

                if (cartePosee !== null) {
                  console.log("Defend malin")
                  reader.image = cartePosee.image;
                  reader.name = cartePosee.name;
                  cartesEnMains.splice(j, 1);
                  carteEnJeu.push(cartePosee);
                  test = [];
                  break outerLoop;
                }
              }
            }

        if (cartePosee === null) {
          this.poserCarte(cartesEnMains, reader);
        }
      }
    },
    // Gère la perte de PV de l'attaquant
    perdrePvAttaquant() {
      if (pv.value > 0) {
        pv.value--;  // Décrémentation de la valeur réactive de pv
        console.log("pv", pv.value);
      }
    },
    resetDejaAttaquer(){
      dejaAttaquer = [];
    },
    trouverObjet(card, liste){
      return liste.find(objet => objet.name === card.name);
    },

    trouverCarte(){
      return true;
    }
  }
};
</script>