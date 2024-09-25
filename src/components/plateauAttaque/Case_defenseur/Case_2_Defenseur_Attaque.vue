<template>
  <div class="topReader2_defense">
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

<style scoped>
.topReader2_defense {
  width: 270px;
  height: 380px;
  border-width: 4px;
  border-style: solid;
  border-color: white;
  border-image: initial;

  font-size: 24px;
  justify-content: center;
  display: flex;
  align-items: center;
}
</style>