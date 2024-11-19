<template>
  <div class="plateau-finale-attaque"

       :class="{ 'red-border': isRedBorder }">
    <div :class="{'center-clear' : isRedBorder}"></div>
  >
    <!-- PV du défenseur -->
    <PVDefenseur_attaque />

    <!-- Case de la défense -->
    <CaseDefenseur_attaque :readers="readers" :socket="socket"  @update-readers="updateReaders" />

    <img src="../../img/composant_plateau/ligne.png" alt="Ligne" class="line" id="ligne_attaque">

    <!-- Compteurs de l'attaque -->
    <TourAttaquant_attaque :socket="socket" />

    <!-- Case de l'attaque -->
    <CaseAttaquant_attaque :readers="readers" :socket="socket" @update-readers="updateReaders"/>
  </div>
</template>

<script>
import io from "socket.io-client";
import {watch, ref} from "vue";
import CaseAttaquant_attaque from "@/components/plateauAttaque/Case_attaquant/CaseAttaquant_attaque.vue";
import CaseDefenseur_attaque from "@/components/plateauAttaque/Case_defenseur/CaseDefenseur_attaque.vue";
import TourAttaquant_attaque from "@/components/plateauAttaque/TourAttaquant_attaque.vue";
import PVDefenseur_attaque from "@/components/plateauAttaque/PVDefenseur_attaque.vue";

export let redBorder = ref(false);

export default {
  components: {
    CaseAttaquant_attaque,
    CaseDefenseur_attaque,
    TourAttaquant_attaque,
    PVDefenseur_attaque
  },
  data() {
    return {
      readers: [
        {id: 1, name: 'Reader 1', image: null},
        {id: 2, name: 'Reader 2', image: null},
        {id: 3, name: 'Reader 3', image: null},
        {id: 4, name: 'Reader 4', image: null},
        {id: 5, name: 'Reader 5', image: null},
        {id: 6, name: 'Reader 6', image: null},
        {id: 7, name: 'Reader 7', image: null},
      ],
      socket: null,
      isRedBorder: false,
    };
  },
  mounted() {

    watch(redBorder, (newVal) => {
      this.isRedBorder = newVal
    });

    this.socket = io('http://localhost:3000');
    },

  methods: {
    updateReaders(newReaders){
      this.readers = newReaders;
    }
  }
}
</script>

<style scoped>

.line {
  margin-top: 50px;
  margin-bottom: 50px;
  max-width: 100%;
  mix-blend-mode: lighten;
  opacity: 0.9;
  position: absolute;
}

#ligne_attaque.line {
  rotate: 180deg;
}

.plateau-finale-attaque {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  gap: 15px;
}


@keyframes red-border-flash {
  0% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 1); /* Rouge total */
  }
  10% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0.95); /* Rouge très intense */
  }
  20% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0.9); /* Approche du rouge complet */
  }
  30% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0.75); /* Rouge fort */
  }
  40% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0.65); /* Rouge modéré */
  }
  50% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0.5); /* Moitié rouge */
  }
  60% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0.35); /* Rouge léger */
  }
  70% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0.2); /* Transition douce */
  }
  80% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0.1); /* Très léger rouge */
  }
  90% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0.05); /* Presque invisible */
  }
  100% {
    box-shadow: 0 0 0 100vw rgba(255, 0, 0, 0); /* Complètement transparent */
  }
}

.red-border {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("../../img/composant_plateau/fond_ecran/fondEcranAttaque.jpeg") 50%/cover no-repeat fixed;
  z-index: 999;
}

.center-clear {
  position: fixed;
  height: 95%;
  width: 95%;
  border-radius: 20%;
  z-index: 998;
  animation: red-border-flash 1s ease-out ;
}

</style>
