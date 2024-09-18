<template>
  <div class="bottomReader1_attaque">
    <img v-if="image" :src="getImagePath(image)" alt="Defense Card" class="defense-card">
    <p v-else>Case Défense {{ id }} - Aucune image reçue</p>
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
};
</script>

<style scoped>
.bottomReader1_attaque {
  width: 262px;
  height: 372px;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>