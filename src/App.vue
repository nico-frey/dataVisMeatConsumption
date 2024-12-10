<script>
import TreeMap from "./components/TreeMap.vue";
import CloseButton from "./components/CloseButton.vue"

export default {
  name: "App",
  components: {
    TreeMap, CloseButton,
  },
  data() {
    return {
      co2Data: [
        { name: "Beef", value: 1966, color: "#003300", icon: "src/assets/paw-print.svg" },
        { name: "Pork", value: 347, color: "#004d00", icon: "src/assets/paw-print.svg" },
        { name: "Fish", value: 217, color: "#006600", icon: "src/assets/paw-print.svg" },
        { name: "Chicken", value: 174, color: "#008000", icon: "src/assets/paw-print.svg" },
        { name: "Lamb", value: 53, color: "#009900", icon: "src/assets/paw-print.svg" },
      ],
    };
  },
};
</script>

<template>
  <div class="chart-wrapper">
    <div class="chart-header">
      <h1>How much CO2 does the average swiss meat eater emmit?</h1>
      <CloseButton @onClick="" />
    </div>
    <TreeMap :data="co2Data" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.chart-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
