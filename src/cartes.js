//Récupère les valeurs présentes dans le fichier json
let cards = []
cards= require('../cards.json');
const data = {
    cards
};

//Met les valeurs contenues dans le fichier json dans une liste
const cartes = data.cards.cards;


/**
 * Génère le deck de l'attaquant
 * @returns le deck de l'attaquant
 */
function genererDeckAttaque () {
    let cartesAttaque = [];
    for (let i = 0; i < cartes.length; i++) {

        if (cartes[i].type === "attaque") {
            cartesAttaque.push(cartes[i]);

            if (cartes[i].level === "bas niveau") {
                cartesAttaque.push(cartes[i])

                if (cartes[i].name !== "Virus" && cartes[i].name !== "Cheval de troie") {
                    cartesAttaque.push(cartes[i]);
                }
            }
        }
    }
    cartesAttaque.splice(0, 1);
    return cartesAttaque;
}

/**
 * Génère le deck du défenseur
 * @returns le deck du défenseur
 */
function genererDeckDefense() {
    let cartesDefense = [];
    for (let i = 0; i < cartes.length; i++) {

        if (cartes[i].type === "défense") {
            cartesDefense.push(cartes[i])

            if (cartes[i].level === "bas niveau") {
                cartesDefense.push(cartes[i])

                if (cartes[i].name === "Antivirus") {
                    cartesDefense.push(cartes[i]);
                }
            }
        }
    }
    cartesDefense.splice(0, 1);
    return cartesDefense;
}

/**
 * Génère un nombre aléatoire
 * @param min nombre minimal
 * @param max nombre maximal
 * @returns un nombre aléatoire
 */
function getNombreAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pioche jusqu'à ce que l'ordinateur ait 5 cartes dans sa main, s'il en a déjà 5, il en pioche une seule
 * @param cartesDeck cartes présentent dans le deck
 * @param cartesEnMain cartes présentes dans la main
 */
function piocher(cartesDeck, cartesEnMain) {
    if (cartesEnMain.length >= 5 ) {
        let index = getNombreAleatoire(0, cartesDeck.length - 1);
        cartesEnMain.push(cartesDeck[index]);
        cartesDeck.splice(index, 1);
    }
    while (cartesEnMain.length < 5){
        let index = getNombreAleatoire(0, cartesDeck.length-1);
        cartesEnMain.push(cartesDeck[index]);
        cartesDeck.splice(index, 1);
    }
}

let cartesDefense = genererDeckDefense();
let cartesAttaque = genererDeckAttaque();
let cartesEnMains = [];
console.log(cartesAttaque.length);
piocher(cartesAttaque, cartesEnMains);
piocher(cartesAttaque, cartesEnMains);
console.log(cartesEnMains);
console.log(cartesAttaque.length);
console.log(cartesDefense.length);
console.log(cartesAttaque);