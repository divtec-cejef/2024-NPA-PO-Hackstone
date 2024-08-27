// script.js

document.addEventListener("DOMContentLoaded", function() {
    const serrure = document.querySelector(".serrure");
    const lock = document.querySelector(".lock");
    const caseStockage = document.querySelector(".case_carte_stockage");

    // Fonction pour gérer l'ouverture du cadenas
    function handleLockOpen() {
        lock.classList.add("opened"); // Déclenche l'explosion
        caseStockage.classList.add("opened"); // Change la bordure en blanc
    }

    // Fonction pour gérer la réapparition du cadenas
    function handleLockReappear() {
        lock.classList.remove("opened"); // Réinitialise l'état ouvert
        lock.classList.add("reappeared"); // Déclenche l'animation de réapparition
        caseStockage.classList.remove("opened"); // Réinitialise la bordure
        serrure.classList.remove("opened"); // Assure que la serrure est fermée
        serrure.classList.add("reappeared"); // Assure que la serrure reste fermée
    }

    // Gère l'ouverture du cadenas après la fin de l'animation
    serrure.addEventListener("animationend", function() {
        handleLockOpen();

        // Optionnel : Ajoutez un délai avant la réapparition
        setTimeout(handleLockReappear, 3000); // 3000 ms = 3 secondes
    });
});
