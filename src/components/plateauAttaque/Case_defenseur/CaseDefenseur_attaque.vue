<template>
  <div class="topReaders_defense">
    <Case_1_Defenseur_Attaque/>
    <Case_2_Defenseur_Attaque/>
    <Case_3_Defenseur_Attaque/>
    <Case_4_Defenseur_Attaque/>
  </div>
</template>

<script>
import Case_1_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_1_Defenseur_Attaque.vue";
import Case_2_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_2_Defenseur_Attaque.vue";
import Case_3_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_3_Defenseur_Attaque.vue";
import Case_4_Defenseur_Attaque from "@/components/plateauAttaque/Case_defenseur/Case_4_Defenseur_Attaque.vue";

export default {
  components: {
    Case_1_Defenseur_Attaque,
    Case_2_Defenseur_Attaque,
    Case_3_Defenseur_Attaque,
    Case_4_Defenseur_Attaque
  },
};
</script>

<style scoped>
.topReaders_defense {
  display: flex;
  justify-content: center;
  gap: 147px;
}
</style>