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
  <router-view :data="filteredData" />
</template>

<style scoped></style>
