<template>
    <div class="home-container">
        <div class="header-section">
            <h1>Here’s what’s at steak:</h1>
            <div class="icon-section">
                <img class="illustrativeicon" src="../assets/cow.svg">
                <img class="illustrativeicon" src="../assets/pig.svg">
                <img class="illustrativeicon" src="../assets/chicken.svg">
                <img class="illustrativeicon" src="../assets/fish.svg">
                <img class="illustrativeicon" src="../assets/lamb.svg">
            </div>
        </div>

        <div class="box" @click="navigateToSwissEmission">
            <div class="box-header">
                <p>The average swiss person consumes...</p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    style="fill: #aaaaaa; width: 1rem; height: 1rem;">
                    <path d="M12 2L10.59 3.41 18.17 11H2V13H18.17L10.59 20.59L12 22L22 12L12 2Z" />
                </svg>
            </div>
            <div class="box-content">
                <span class="highlight-brown">82kg</span> <span class="subtext">of meat a year</span>
            </div>
            <!-- <div class="mock-treemap brown-treemap"></div> -->
        </div>

        <div class="box" @click="navigateToSwissEmission">
            <div class="box-header">
                <p>This means a yearly emission of...</p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    style="fill: #aaaaaa; width: 1rem; height: 1rem;">
                    <path d="M12 2L10.59 3.41 18.17 11H2V13H18.17L10.59 20.59L12 22L22 12L12 2Z" />
                </svg>
            </div>
            <div class="box-content">
                <span class="highlight-green">2’757kg</span> <span class="subtext">CO2</span>
            </div>
            <!--  <div class="mock-treemap green-treemap"></div> -->
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
    methods: {
        navigateToSwissEmission() {
            this.$router.push("/swiss-emission");
        },
    },
};
</script>

<style scoped>
.home-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100%;
}

.box {
    background-color: rgba(255, 255, 255, 0.04);
    padding: 2rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.box:hover {
    background-color: rgba(255, 255, 255, 0.06);
}

.box-header {
    font-size: 0.875rem;
    color: #aaa;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.icon-section {
    display: flex;
    gap: 0.5rem;
}

.illustrativeicon {
    height: 1rem;
}

.box-content {
    font-size: 2rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    gap: 2rem;
}

.highlight-brown {
    font-family: "Fragment Mono";
    font-size: 4.5rem;
    font-style: italic;
    font-weight: 400;
    line-height: normal;
    color: #836B62;
}


.highlight-green {
    font-family: "Fragment Mono";
    font-size: 4.5rem;
    font-style: italic;
    font-weight: 400;
    line-height: normal;
    color: #718258;
}

.subtext {
    font-family: "Fragment Mono";
    font-size: 4.5rem;
    font-style: italic;
    font-weight: 400;
    line-height: normal;
}

.mock-treemap {
    display: flex;
    overflow: hidden;
    width: 100%;
    flex: 1;
    height: 100%;
}

.brown-treemap {
    background-color: #563323;
}

.green-treemap {
    background-color: #1C4028;
}
</style>