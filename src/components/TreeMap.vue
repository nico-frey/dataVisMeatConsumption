<template>
    <div ref="chartContainer" class="chart-container"></div>
</template>

<script>
import * as d3 from "d3";

export default {
    name: "TreeMap",
    data() {
        return {
            rawData: [],
        };
    },
    async mounted() {
        await this.fetchData();
        this.createChart();

        window.addEventListener("resize", this.updateChart);
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateChart);
    },
    methods: {
        async fetchData() {
            try {
                const response = await fetch("/data.json");
                const json = await response.json();

                // Transform raw data into format suitable for the chart
                this.rawData = json.map((item) => ({
                    name: item.type,
                    value: item.TotalEmissionsPerCapita,
                    color: this.getColor(item.type),
                }))
                    .sort((a, b) => b.value - a.value);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        },
        getColor(type) {
            const colors = {
                Beef: "#1C4028",
                Fish: "#2B532F",
                Lamb: "#41643B",
                Pork: "#597848",
                Poultry: "#718258",
            };
            return colors[type] || "#8A8D85";
        },
        createChart() {
            this.updateChart();
        },
        updateChart() {
            if (!this.$refs.chartContainer || !this.rawData.length) return;

            const data = this.rawData;

            const containerWidth = this.$refs.chartContainer.parentElement.offsetWidth;
            const height = 500;

            const totalEmissions = data.reduce((sum, d) => sum + d.value, 0);

            d3.select(this.$refs.chartContainer).html("");

            const container = d3
                .select(this.$refs.chartContainer)
                .style("width", `${containerWidth}px`)

                // height but with extra height so there's space for the labels
                .style("height", `${height + 100}px`)
                .style("position", "relative");

            let xOffset = 0;
            data.forEach((d) => {
                const sliceWidth = (d.value / totalEmissions) * containerWidth;
                container
                    .append("div")
                    .style("position", "absolute")
                    .style("top", "0")
                    .style("left", `${xOffset}px`)
                    .style("width", `${sliceWidth}px`)
                    .style("height", `${height}px`)
                    .style("background-color", d.color)
                    .style("display", "flex")
                    .style("justify-content", "left")
                    .style("align-items", "top")
                    .style("padding", "1.5rem")
                    .style("box-sizing", "border-box")
                    .style("color", "white")
                    .style("font-family", "sans-serif")
                    .style("font-size", "14px")
                    .html(`<div style="text-align: center;">
              <img src="src/assets/paw-print.svg" alt="${d.name}" style="width: 24px; height: 24px;" />
            </div>`);
                container
                    .append("div")
                    .attr("class", "chart-label")
                    .style("position", "absolute")
                    .style("border-left-style", "dotted")
                    .style("border-width", "0.1rem")
                    .style("border-color", "#848586")
                    .style("box-sizing", "border-box")
                    .style("top", `${height}px`)
                    .style("left", `${xOffset}px`)
                    .style("width", `${sliceWidth}px`)
                    .style("height", "100px")
                    .style("display", "flex")
                    .style("padding-left", "0.75rem")
                    .style("flex-direction", "column")
                    .style("justify-content", "flex-end")
                    .style("align-items", "flex-start")
                    .html(`<div class="label-wrapper"><div class="label-name">${d.name}</div><div class="label-value">${d.value.toFixed(2)}kg</div></div>`);

                xOffset += sliceWidth;
            });
        },
    },
};
</script>

<style>
.chart-container {
    display: block;
    overflow: hidden;
}

.label-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    color: #FFF;
    font-family: "Fragment Mono";
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.label-value {
    color: rgba(255, 255, 255, 0.50);
}
</style>