<template>
  <div :class="['bottomReader4_defense', { 'exploded': hasUnlocked }]">
    <img v-if="image" :src="getImagePath(image)" alt="" class="defense-card">
    <div v-if="!hasUnlocked" class="lock" :class="{ opening: isOpening, opened: isOpened, inaccessible: !isAccessible }">
      <div class="serrure"></div>
      <div class="base"></div>
    </div>
  </div>
</template>

<script>
import 'animate.css'
import io from "socket.io-client";
import {ref} from "vue";

export let ouvert = ref(false);
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    card: {
      type: Object,
      required: false
    }
  },

  data() {
    return {
      isOpening: false,
      isOpened: false,
      isAccessible: false,
      isStockageCard: false,
      isCardVisible: false,
      hasUnlocked: false
    };
  },

  mounted() {
    this.socket = io('http://localhost:3001');
    this.socket.on('rfidData', (data) => {
      let { readerID, card } = data;
      //Si la carte Stockage est scannée, déverrouille la zone de carte
      if ((card.type === 'défense' && card.name === 'Stockage' && readerID === '7)')) {
        this.isStockageCard = true;
        this.triggerLockAnimation();
        this.isAccessible = true;
        ouvert.value = true;

      } else {
        this.isStockageCard = false;
        this.isCardVisible = this.isAccessible === true;
      }
    });
  },
  methods: {
    getImagePath(image) {
      try {
        return require(`@/${image}`);
      } catch (e) {
        console.error("Image not found:", image);
        return '';
      }
    },

    triggerLockAnimation() {
      this.isAccessible = false;
      this.isOpening = true;
      setTimeout(() => {
        this.isOpening = false;
        this.isOpened = true;
        setTimeout(() => {
          this.isOpened = false;
          this.isAccessible = true;
          this.isCardVisible = true;
          this.hasUnlocked = true;
        }, 1000);
      }, 2000);
    }
  }
}
</script>

<style scoped>
.bottomReader4_defense {
  width: 300px;
  height: 420px;
  background-size: 100%;
  border-width: 4px;
  border-style: solid;
  border-color: red;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: rgba(255, 0, 0, 0.5);

}
.defense-card{
  height: 420px;
  animation: slideInUp;
  animation-duration: 1s;
  position: fixed;
}

.bottomReader4_defense.exploded {
  border-color: white !important;
  background-color: rgba(255, 255, 255, 0.5);

}

.lock {
  position: relative;
  width: 80px;
  height: 100px;
  margin: 0 auto;
}

.serrure {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 60px;
  border: 10px solid azure;
  border-bottom: none;
  border-radius: 20px 20px 0 0;

}

.base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 60px;
  background-color: red;
  border-radius: 10px;
}

@keyframes openShackle {
  0% {
    transform: translateX(-50%);
  }
  50% {
    transform: translateX(-50%) rotate(45deg) translateY(-20px);
  }
  100% {
    transform: translateX(-50%) rotate(45deg) translateY(-20px);
  }
}

@keyframes explode {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
    filter: blur(10px);
  }
}

.lock.inaccessible {
  opacity: 1;
  pointer-events: none;
}

.lock .serrure {
  animation: none;
}

.lock.opening .serrure {
  animation: openShackle 2s ease-in-out forwards;
}

.lock.opened {
  animation: explode 1s forwards;
}
</style>
