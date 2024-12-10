<template>
    <CloseButton @click="closeRoute" />

    <h2>The average Swiss person consumes...</h2>
    <h1>{{ data.consumption }}kg of {{ data.type }}</h1>

</template>
<script>
import CloseButton from './CloseButton.vue';

export default {
    name: "AnimalDetailsView",
    components: {
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
            this.$router.push("/swiss-emission");
        },
    }
}
</script>