<!-- src/views/SwissEmission.vue -->
<template>
    <div class="chart-wrapper">
        <div class="chart-header">
            <h1>How much CO2 does the average Swiss meat eater emit?</h1>
            <CloseButton @onClick="closeRoute" />
        </div>
        <TreeMap :data="data" />
    </div>
</template>

<script>
import TreeMap from "../components/TreeMap.vue";
import CloseButton from "../components/CloseButton.vue";

export default {
    name: "SwissEmission",
    components: {
        TreeMap,
        CloseButton,
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
    methods: {
        closeRoute() {
            this.$router.push("/");
        },
    },
};
</script>

<style>
.chart-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    height: 100%;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}
</style>
