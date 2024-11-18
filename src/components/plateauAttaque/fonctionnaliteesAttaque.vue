<script>
import {ref} from "vue";
import {userMessageAttack} from "@/components/plateauAttaque/TourAttaquant_attaque.vue";
import {peutAttaquer} from "@/components/plateauAttaque/Case_attaquant/Case_1_Attaquant_Attaque.vue";
import {peutAttaquerCase3} from "@/components/plateauAttaque/Case_attaquant/Case_3_Attaquant_Attaque.vue";
import {peutAttaquerCase2} from "@/components/plateauAttaque/Case_attaquant/Case_2_Attaquant_Attaque.vue";

// Importation de `ref` pour créer des variables réactives
export let pv = ref(5);
export let stockage = ref(false);
export let alreadyAttacked = [];
export let attackingCards = [];

// Importation du fichier JSON des CARTES
let cardsData = require('../../../cards.json');
let inGameCards = [];
let pvAnonymous = 2;
let pvSuperAntivirus = 2;
let anonymousAttackNumber = 0;
let alreadySummon = false;

const DECK = {
  cardsData
};
const CARTES = DECK.cardsData.cards;
export default {

  methods: {

    /**
     * Génère le deck du défenseur à partir d'un fichier json
     * @returns attackingCards cartes présentent dans le deck
     */
    genererDeckDefense() {
      let cartesEnAttaque = [];
      for (let i = 0; i < CARTES.length; i++) {
        if (CARTES[i].type === 'défense') {
          //Retrouve le nombre de fois qu'une carte est présente dans le deck grâce à son nombre d'ID
          for (let j = 0; j < CARTES[i].uid.length; j++)
            cartesEnAttaque.push(CARTES[i]);
        }
      }
      return cartesEnAttaque;
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
        stockage.value = true;
        let indexStockage = cartesEnMain.find(index => index.name === "Stockage");
        cartesEnMain.splice(cartesEnMain.indexOf(indexStockage), 1);
      }
      //  let anon = cartesDeck.find(carte => carte.name === "Super-antivirus")
      //  if (anon !== undefined)
      //    cartesEnMain.push(anon)
      // cartesEnMain.splice(cartesEnMain.length, 1);
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
        } while (cartePosee.name === "Redondance de données" && inGameCards.length === 0);

        //La carte redondance de données devient une copie de la carte sur la case de gauche.
        if (cartePosee.name === "Redondance de données") {
          cartePosee = inGameCards[0];
        }
        //Change le nom et l'image des cases à l'écran par ceux de la carte scannée
        reader.image = cartePosee.image;
        reader.name = cartePosee.name;
        cartesEnMains.splice(index, 1);
        inGameCards.push(cartePosee);
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
      if (card.name === "Anonymous" && !alreadySummon) {
        alreadySummon = true;
        let readerID = [0, 1, 4, 6]
        for (let i = 0; i < readerID.length; i++){
          if(reader[readerID[i]].name !== "Super-antivirus"
              || (reader[readerID[i]].name === "Super-antivirus" && pvSuperAntivirus === 1)) {

            //Retrouve l'index de la carte qui va être détruite
            let indexCarteDefense = inGameCards.find(carte => carte.name === reader[readerID[i].name])
            if (reader[readerID[i]].image !== null )
            inGameCards.splice(inGameCards.indexOf(indexCarteDefense), 1);

            reader[readerID[i]].name = null;
            reader[readerID[i]].image = null;
          } else if (reader[readerID[i]].name === "Super-antivirus") {
            pvSuperAntivirus = 1;
          }
        }
      }
    },

    /**
     * L'ordinateur pose des cartes en défense en fonction de celle présente en attaque
     * @param cartesEnMains cartes dans la main de l'ordinateur
     * @param reader case sur laquelle la carte va être posée
     * @param emplacementListe permet d'ordres la liste des cartes en jeu en fonction de leur ordre sur le plateau
     */
    defendMalin(cartesEnMains, reader, emplacementListe) {
      anonymousAttackNumber = 0;

      //Pose une carte seulement s'il n'y en a pas une de déjà posé
      if (reader.image === null) {
        let cartePosee = null;

        outerLoop:
            for (let i = 0; i < attackingCards.length; i++) {
              for (let j = 0; j < cartesEnMains.length; j++) {

                let carteEnMainCounter = cartesEnMains[j].counter;

                if (carteEnMainCounter.includes(attackingCards[i].name)) {
                  cartePosee = cartesEnMains[j];

                  //Empêche la redondance de données d'être la première carte posée sur le terrain
                  // afin qu'elle puisse copier une carte déjà présente
                  if (cartePosee.name === "Redondance de données") {

                    if (inGameCards.length === 0) {
                      cartePosee = cartesEnMains[j + 1];
                    } else {
                      cartePosee = inGameCards[0];
                    }
                  }
                }
                if (cartePosee !== null) {
                  reader.image = cartePosee.image;
                  reader.name = cartePosee.name;
                  cartesEnMains.splice(j, 1);
                  inGameCards.splice(emplacementListe, 0, cartePosee);
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
      }
    },

    /**
     * Permet de reset la valeur de la liste alreadyAttacked depuis un autre composant
     */
    resetDejaAttaquer() {
      alreadyAttacked = [];
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
      let counterCarteEnJeu
      //Boucle passant sur chaque case de l'ordinateur
      for (let j = 0; j < inGameCards.length; j++) {
        //Liste des cartes qui contrent les cartes présentent sur le jeu
        counterCarteEnJeu = inGameCards[j].counter;

        //Boucle passant tous les contre des cartes
        let carteDefense = this.trouverObjet(inGameCards[j], readers);
        if (carteDefense !== undefined && counterCarteEnJeu.includes(card.name)){
          return carteDefense;
        }
      }
      return undefined;
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
      let indexCarteScannee = attackingCards.indexOf(this.trouverObjet(card, attackingCards));

      //Retrouve le nombre de fois qu'une carte est présente sur le plateau
      const occurrences = attackingCards.filter(c => c.name === card.name).length;
      //Retire la carte attaquante des cartes en attaque
      attackingCards.splice(indexCarteScannee, 1);

      //Test si la carte qui attaque est présente plus d'une fois
      if (occurrences === 1) {
        if (card.name === "Anonymous") {
          anonymousAttackNumber++;
          if (anonymousAttackNumber >= 2)
            alreadyAttacked.push(card);
        } else
          alreadyAttacked.push(card);
      }

      //Fonction permettant d'arrêter les deux boucles à un moment donné
      outerLoop:
          //Boucle passant sur chaque case de l'ordinateur
          for (let j = 0; j < inGameCards.length; j++) {
            //Liste des cartes qui contrent les cartes présentent sur le jeu
            counterCarteEnJeu = inGameCards[j].counter;

            //Boucle passant tous les contre des cartes
            for (let i = 0; i < counterCarteEnJeu.length; i++) {
              //Test si la carte qui attaque à un contre présent sur le terrain
              if (counterCarteEnJeu.includes(card.name)) {
                carteDefendu = true;

                //Retrouve les cases sur lesquelles les cartes sont présentes
                let carteDefense = this.trouverObjet(inGameCards[j], readers);

                //Retire le nom et l'image de la carte détruite de leur case
                //et détruit l'Anonymous et le super-antivirus uniquement s'ils ont déjà été attaqués une fois
                if (carteDefense !== undefined){
                  if ((carteDefense.name === "Super-antivirus" && pvSuperAntivirus === 1)
                      || carteDefense.name !== "Super-antivirus") {

                    //Retire la carte détruite du jeu
                    carteDefense.image = null;
                    carteDefense.name = null;
                    inGameCards.splice(j, 1);

                  } else
                    pvSuperAntivirus = 1;
                }
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
        if (card.name === "Anonymous"){
          switch (reader.id){
            case 3 : peutAttaquer.value = readers[2].name !== "Anonymous";
              break;
            case 4 : peutAttaquerCase2.value = readers[3].name !== "Anonymous";
              break;
            case 6 : peutAttaquerCase3.value = readers[5].name !== "Anonymous";
          }
        }
        if (card.name !== "Anonymous"){
          switch (reader.id) {
            case 3 : peutAttaquer.value = false;
              break;
            case 4 : peutAttaquerCase2.value = false;
              break;
            case 6 : peutAttaquerCase3.value = false;
          }
        }

        this.perdrePvAttaquant();
        attackingCards.push(card);
        userMessageAttack.value = "Attaque réussie, repose ta carte sur sa case"


      } else if (reader.name === null ){
        userMessageAttack.value = "Attaque défendue, envoie ta carte au cimetière"
        switch (reader.id) {
          case 3 : peutAttaquer.value = false;
            break;
          case 4 : peutAttaquerCase2.value = false;
            break;
          case 6 : peutAttaquerCase3.value = false;
        }
      }
      if (card.name === "Anonymous" && pvAnonymous > 0 && anonymousAttackNumber < 2) {
        //S'il reste des points de vie et des attaques disponibles à l'anonymous, le rajoute dans la liste
        card.poseeDepuis = 2;
        attackingCards.push(card);
      }
    },

    /**
     * Vérifie si une carte remplie les conditions nécessaires pour attaquer
     * @param card carte à vérifier
     * @returns {boolean} si oui ou non la carte peut attaquer
     */
    peutAttaquer(card) {

      let carteDejaAttaquer = alreadyAttacked.some(carteAttaquante => carteAttaquante.name === card.name);
      let carteTrouvee = attackingCards.some(cartes => cartes.name === card.name);
      let cartePresenteDepuis = this.trouverObjet(card, attackingCards);

      if (cartePresenteDepuis.poseeDepuis >= 2 && !carteDejaAttaquer && carteTrouvee) {
        return true

      } else if (carteDejaAttaquer) {
        userMessageAttack.value = "Cette carte a déjà attaqué";

      } else if (card.poseeDepuis < 2) {
        userMessageAttack.value = "Attaque échoué, cette carte viens d'être posée";

      } else if (!carteTrouvee)
        userMessageAttack.value = "Attaque impossible, cette carte n'a pas été posée";
      return false;
    },
  }
};
</script>