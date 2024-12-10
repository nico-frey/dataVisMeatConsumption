<script>
export default {
    name: "CloseButton",
    props: {
        size: {
            type: String,
            default: "1.5rem",
        },
    },
    methods: {
        onClick() {
            this.$emit("click");
        },
    },
};
</script>
<template>
    <div class="close-button">
        <img src="../assets/x.svg" alt="Close" class="close-icon" />
    </div>
</template>

<style scoped>
.close-button {
    width: 1.5rem;
    height: 1.5rem;
    min-width: 1.5rem;
    max-height: 1.5rem;
    border-radius: 999rem;
    background: rgba(255, 255, 255, 0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    margin: 0;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.close-button:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.close-icon {
    width: 1rem;
    height: 1rem;
    filter: invert(100%);
}
</style>