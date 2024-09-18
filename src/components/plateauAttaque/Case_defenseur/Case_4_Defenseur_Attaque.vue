<template>
  <div class="topReader4_defense">
    <div class="lock">
      <div class="serrure"></div>
      <div class="base"></div>
    </div>
  </div>
</template>

<script>

</script>

<style scoped>
.topReader4_defense {
  width: 270px;
  height: 380px;
  border-width: 4px;
  border-style: solid;
  border-color: red;
  border-image: initial;

  font-size: 24px;
  justify-content: center;
  display: flex;
  align-items: center;
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
</style>