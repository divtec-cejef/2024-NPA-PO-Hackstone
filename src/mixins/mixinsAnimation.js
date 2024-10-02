import { gsap } from "gsap";

export default {
    methods: {
        attaquerCarte(card_number, deplacementX, deplacementY = -420) {
            console.log(this.$el)
            const attackingCard = this.$el.querySelector('.attaque-card'+card_number); // Sélectionne l'élément par classe
            console.log("Attacking card :", attackingCard);

            if (!attackingCard) {
                console.error("La carte attaquante n'est pas disponible.");
                return;
            }

            const tl = gsap.timeline();
            tl.to(attackingCard, {
                duration: 0.3,
                scale: 1.1,
                ease: "power2.inOut"
            })
                .to(attackingCard, {
                    duration: 0.3,
                    y: deplacementY,
                    x: deplacementX,
                    scale: 1,
                    ease: "power2.inOut",
                    delay: 0.6
                })
                .to(attackingCard, {
                    duration: 0.3,
                    y: 0,
                    x: 0,
                    ease: "power2.inOut",
                });
        }
    }
};
