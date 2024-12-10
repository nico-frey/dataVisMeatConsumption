<script>

export default {
  name: "App",
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
  <router-view :data="filteredData" v-slot="{ Component }">
    <transition name="route" mode="out-in">
      <component :is="Component" :data="filteredData"></component>
    </transition>
  </router-view>
</template>

<style scoped>
.route-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.route-enter-active {
  transition: all 0.3 ease-out;
}

.route-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.route-leave-active {
  transition: all 0.3 ease-in;
}
</style>
