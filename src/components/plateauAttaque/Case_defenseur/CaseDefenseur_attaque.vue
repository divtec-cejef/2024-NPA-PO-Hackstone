<template>
  <div class="topReaders_attaque">
    <!-- Case de la défense -->
    <div v-for="topReader_attaque in topReaders_attaque"
         :key="topReader_attaque.id"
         :id="'topReader_attaque' + topReader_attaque.id"
         :class="[
           'topReader_attaque',
           {
             accessible: topReader_attaque.accessible,
             'unlock-animation': topReader_attaque.accessible && topReader_attaque.id === 7,
             'border-red': topReader_attaque.id === 7
           }
         ]">
      <img v-if="topReader_attaque.image" :src="getImagePath(topReader_attaque.image)" alt="Card Image" style="max-width: 100%; height: auto;">
      <p v-else></p>

      <div v-if="topReader_attaque.id === 7" class="lock">
        <div class="serrure"></div>
        <div class="base"></div>
      </div>
    </div>
  </div>
</template>


<script>

export default {

  props: {
    readers: {
      type: Array,
      required: true
    },
    socket: {
      type: Object,
      required: true
    }
  },
  computed: {
    topReaders_attaque() {
      const bottom = this.readers.slice(3, 7);
      console.log("Bottom Readers:", bottom);  // Pour vérifier les valeurs
      return bottom;
    },
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
.topReaders_attaque {
  display: flex;
  justify-content: center;
  gap: 147px;
}

.topReader_attaque {
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

.border-red {
  border-color: red;
}
</style>