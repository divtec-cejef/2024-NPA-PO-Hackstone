<template>
  <div class="topReader2_defense">
    <img v-if="image" :src="getImagePath(image)" alt="Defense Card" class="defense-card">
  </div>
</template>

<script>
import "animate.css"
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: false
    }
  },
  methods: {
    getImagePath(image) {
      try {
        return require(`@/${image}`);
      } catch (e) {
        console.error("Image not found:", image);
        return ''; // Return a default or empty string if image not found
      }
    }
  }
}
</script>

<style scoped>
.topReader2_defense {
  width: 300px;
  height: 420px;
  border-width: 4px;
  border-style: solid;
  border-color: white;
  border-image: initial;
  background-size: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
  justify-content: center;
  display: flex;
  align-items: center;
}

.defense-card{
    height: 420px;
    animation: slideInDown; /* referring directly to the animation's @keyframe declaration */
    animation-duration: 1s; /* don't forget to set a duration! */
    position: fixed;
}
</style>