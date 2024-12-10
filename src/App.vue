<script>
import TreeMap from "./components/TreeMap.vue";

export default {
  name: "App",
  components: {
    TreeMap,
  },
  data() {
    return {
      rawData: [],
    };
  },
  computed: {
    filteredData() {
      return Array.isArray(this.rawData) ? this.rawData : [];
    },
  },
  async created() {
    try {
      const response = await fetch("/data.json");
      const json = await response.json();
      if (Array.isArray(json)) {
        this.rawData = json;
      } else {
        console.error("Data fetched is not an array:", json);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  },
};
</script>

<template>
  <div class="chart-wrapper">
    <div class="chart-header">
      <h1>How much CO2 does the average swiss meat eater emmit?</h1>
      <CloseButton @onClick="" />
    </div>
    <TreeMap :data="filteredData" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  height: 100%;
}

.chart-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
