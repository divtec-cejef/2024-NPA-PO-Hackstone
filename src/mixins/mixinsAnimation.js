import { gsap } from "gsap";

export default {
    methods: {
        attaquerCarte(refName, deplacementX, deplacementY = -420) {
            const attackingCard = this.$refs[refName];

            if (!attackingCard) {
                console.error("La carte attaquante n'est pas disponible.");
            }

            const tl = gsap.timeline();
            tl.to(attackingCard, {
                duration: 0.3,
                scale: 1.1, // Zoom léger
                ease: "power2.inOut"
            })
                // Ajout d'un délai avant le déplacement
                .to(attackingCard, {
                    duration: 0.3,
                    y: deplacementY, // Déplacement vertical
                    x: deplacementX, // Déplacement horizontal spécifique
                    scale: 1, // Retour à la taille normale
                    ease: "power2.inOut",
                    delay: 0.6 // Délai entre le zoom et le mouvement
                })
                .to(attackingCard, {
                    duration: 0.3,
                    y: 0,
                    x: 0, // Retour à la position initiale
                    ease: "power2.inOut",
                    delay: 2
                });
        }
    }
};
