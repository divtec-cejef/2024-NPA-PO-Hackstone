<template>
  <div class="bottomReader3_attaque">
    <img v-if="image" :src="getImagePath(image)" alt="Defense Card" class="defense-card">
    <p v-else></p>
  </div>
</template>

<script>
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

<style>
.bottomReader3_attaque {
  width: 300px;
  height: 420px;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: 100%;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>