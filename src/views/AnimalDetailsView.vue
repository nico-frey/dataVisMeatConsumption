<template>
    <div v-if="animalData">
        <AnimalCard :data="animalData" />
    </div>
    <div v-else>
        <h1>Animal not found</h1>
    </div>
</template>

<script>
import AnimalCard from "../components/AnimalCard.vue";

export default {
    name: "AnimalDetailsView",
    components: {
        AnimalCard,
    },
    props: {
        data: {
            type: Array,
            required: true, // Ensure data is required
        },
    },
    computed: {
        // Filter the data based on the `type` parameter from the route
        animalData() {
            const type = this.$route.params.type;
            return this.data.find(
                (animal) => animal.type.toLowerCase() === type.toLowerCase()
            );
        },
    },
    methods: {
        closeRoute() {
            this.$router.push("/swiss-emission");
        },
    },
};
</script>