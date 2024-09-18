<template>
  <div class="topReaders_attaque">
    <Case_1_Attaquant_defense/>

    <Case_2_Attaquant_defense/>

    <Case_3_Attaquant_defense/>
  </div>
</template>

<script>
import Case_1_Attaquant_defense from "@/components/plateauDefense/case_attaque/Case_1_Attaquant_defense.vue";
import Case_2_Attaquant_defense from "@/components/plateauDefense/case_attaque/Case_2_Attaquant_defense.vue";
import Case_3_Attaquant_defense from "@/components/plateauDefense/case_attaque/Case_3_Attaquant_defense.vue";

export default {
  components: {
    Case_1_Attaquant_defense,
    Case_2_Attaquant_defense,
    Case_3_Attaquant_defense
  }
};
</script>

<style scoped>
.topReaders_attaque {
  display: flex;
  justify-content: center;
  gap: 147px;
}
</style>