<template>
    <div ref="chartContainer" class="chart-container"></div>
</template>

<script>
import * as d3 from "d3";

export default {
    name: "CO2Chart",
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
    mounted() {
        this.createChart();

        window.addEventListener("resize", this.updateChart);
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateChart);
    },
    methods: {
        createChart() {
            this.updateChart();
        },
        updateChart() {
            if (!this.$refs.chartContainer) return;

            const data = this.data;

            const containerWidth = this.$refs.chartContainer.parentElement.offsetWidth;
            const height = 500;

            const totalEmissions = data.reduce((sum, d) => sum + d.value, 0);

            d3.select(this.$refs.chartContainer).html("");

            const container = d3
                .select(this.$refs.chartContainer)
                .style("width", `${containerWidth}px`)
                .style("height", `${height + 50}px`) // Add extra height for labels
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
              <img src="${d.icon}" alt="${d.name}" style="width: 24px; height: 24px;" />
            </div>`);
                container
                    .append("div")
                    .style("position", "absolute")
                    .style("background-color", "red")
                    .style("top", `${height}px`)
                    .style("left", `${xOffset}px`)
                    .style("width", `${sliceWidth}px`)
                    .style("height", "50px")
                    .style("display", "flex")
                    .style("flex-direction", "column")
                    .style("justify-content", "flex-start")
                    .style("align-items", "center")
                    .style("color", "white")
                    .style("font-family", "sans-serif")
                    .style("font-size", "12px")
                    .style("text-align", "center")
                    .html(`<div>${d.name}</div><div>${d.value}kg</div>`);

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
</style>