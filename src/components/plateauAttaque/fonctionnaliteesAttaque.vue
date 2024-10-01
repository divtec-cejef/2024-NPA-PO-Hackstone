<script>
import {ref} from "vue"; // Importation de `ref` pour créer des variables réactives
export let pv = ref(5);

// Importation du fichier JSON des CARTES
let cardsData = require('../../../cards.json');
let carteEnJeu = [];
let pvAnonymous = 2;
let pvSuperAntivirus = 2;
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
      cartesEnMain.splice(cartesEnMain.length, 1);
    },

    /**
     * Effectue toutes les actions nécessaires au début de n'importe quel tour (excepté le premier)
     * @param cartesDeck cartes présentent dans le deck
     * @param cartesEnMains cartes présentent dans la main de l'ordinateur
     */
    DebutTour(cartesDeck, cartesEnMains) {
      for (let i = 0; i < cartesDeck.length; i++) {
        if (cartesDeck[i].name === ("Stockage")) {
          cartesDeck.splice(i, 1);
        }
      }
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
          alert("Redondance de données");
          cartePosee = carteEnJeu[0];
        }

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
      let carteTrouvee = cartesAttaque.some(cartes => cartes.name === card.name);
      let cartePresenteDepuis = cartesAttaque.find(carteATrouver => carteATrouver.name === card.name);
      let carteDejaAttaquer = dejaAttaquer.some(carteAttaqPauante => carteAttaquante.name === card.name);

      console.log("carte", carteDejaAttaquer);
      console.log("cartes en attaque ", cartesAttaque);

      let indexx = cartesAttaque.find(carte => carte.name === card.name)
      let index = cartesAttaque.indexOf(indexx);

      const occurrences = cartesAttaque.filter(c => c.name === card.name).length;
      console.log("Carte trouvée", carteTrouvee);
      cartesAttaque.splice(index, 1);
      if (carteTrouvee && cartePresenteDepuis.poseeDepuis === 2 && !carteDejaAttaquer) {
        if (cartesAttaque.length > 0){
          if (occurrences === 1)
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
                  let carte = readers.find(cartes => cartes.name === carteEnJeu[j].name);
                  let carte2 = readers.find(zone => zone.name === card.name);

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
    },

    /**
     * Retire toutes les cartes en défense lors de l'arrivée de l'anonymous
     * @param card carte scannée
     * @param reader liste des cases
     */
    arriveeAnonymous(card, reader) {
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

        //Vide la liste des cartes en jeu, car plus aucune n'est présente
        carteEnJeu = [];
      }
    },
    defendMalin(cartesEnMains, reader) {

      let test = [];
      for (let a = 0; a < cartesAttaque.length; a++)
        test.push(cartesAttaque[a]);
      console.log("Test ", test)

      //Pose une carte seulement s'il n'y en a pas une de déjà posé
      if (reader.image === null) {
        let index = 0;
        let cartePosee = null;
        console.log("Cartes en main", cartesEnMains)
        console.log("Cartes en jeu", carteEnJeu)
        //Empêche la redondance de données d'être la première carte posée sur le terrain
        // afin qu'elle puisse copier une carte déjà présente
        outerLoop:
            for (let i = 0; i < test.length; i++) {
              for (let j = 0; j < cartesEnMains.length; j++) {
                let carteEnMainCounter = cartesEnMains[j].counter;
                //console.log("les counter", carteEnMainCounter)
                if (carteEnMainCounter.includes(test[i].name)) {
                  cartePosee = cartesEnMains[j];
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
          do {
            index = this.getNombreAleatoire(0, cartesEnMains.length - 1);
            cartePosee = cartesEnMains[index];
          } while (cartePosee.name === "Redondance de données" && carteEnJeu.length === 0);

          //La carte redondance de données devient une copie de la carte sur la case de gauche.
          if (cartePosee.name === "Redondance de données") {
            alert("Redondance de données");
            cartePosee = carteEnJeu[0];
          }
          reader.image = cartePosee.image;
          reader.name = cartePosee.name;
          cartesEnMains.splice(index, 1);

          carteEnJeu.push(cartePosee);
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
    listeADoublons(){
      let set = [...new Set(this.cartesAttaque)];
      console.log("Taille liste ", cartesAttaque)
      console.log("Taille set ", set)
      return set.size !== cartesAttaque.length;
    }
  }
};
</script>