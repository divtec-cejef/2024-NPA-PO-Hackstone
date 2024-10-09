<template>
  <div class="bottomReader3_defense">
    <img v-if="image" :src="getImagePath(image)" alt="Defense Card" class="defense-card">
    <p v-else>{{id}}</p>
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
        return ''; // Retourne un chemin vide si l'image n'est pas trouvée
      }
    }
  }
};
</script>

<style scoped>
.bottomReader3_defense {
  width: 300px;
  height: 420px;
  background-size: 100%;
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.defense-card{
  height: 100%;
}
</style>