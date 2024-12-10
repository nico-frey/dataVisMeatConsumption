<template>
    <div ref="chartContainer" class="chart-container"></div>
</template>

<script>
import * as d3 from "d3";

export default {
    name: "TreeMap",
    props: {
        data: {
            type: Array,
            required: true,
        },
    },
    watch: {
        data: {
            handler(newData) {
                if (Array.isArray(newData)) {
                    this.rawData = this.prepareData(newData);
                    this.updateChart();
                } else {
                    console.warn("Received invalid data format in TreeMap component.");
                }
            },
            immediate: true,
        },
    },
    data() {
        return {
            rawData: [], // Processed data for the chart
        };
    },
    mounted() {
        window.addEventListener("resize", this.updateChart);
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateChart);
    },
    methods: {
        prepareData(data) {
            if (!Array.isArray(data)) {
                console.warn("Invalid data format. Expected an array.");
                return [];
            }

            return data
                .map((item) => ({
                    ...item,
                    svg: new URL(`../assets/${item.svg}`, import.meta.url).href, // Add svg dynamically
                }))
                .sort((a, b) => b.TotalEmissionsPerCapita - a.TotalEmissionsPerCapita); // Sort descending
        },
        updateChart() {
            if (!this.$refs.chartContainer || !this.rawData.length) return;

            const data = this.rawData;
            const containerWidth = this.$refs.chartContainer.parentElement.offsetWidth;
            const containerHeight = this.$refs.chartContainer.parentElement.offsetHeight;
            const height = containerHeight - 200; // Leave space for labels

            // Define power scale for width distribution
            const minTileWidth = 100;
            const maxTileWidth = containerWidth * 0.35;
            const powerScale = d3.scalePow()
                .exponent(0.5)
                .domain([
                    d3.min(data, (d) => d.TotalEmissionsPerCapita),
                    d3.max(data, (d) => d.TotalEmissionsPerCapita),
                ])
                .range([minTileWidth, maxTileWidth]);

            // Calculate scaled widths
            let scaledWidths = data.map((d) =>
                Math.max(powerScale(d.TotalEmissionsPerCapita), minTileWidth)
            );
            const totalScaledWidth = scaledWidths.reduce((sum, w) => sum + w, 0);
            const scaleFactor = containerWidth / totalScaledWidth;
            scaledWidths = scaledWidths.map((w) => w * scaleFactor);

            // Clear the container
            d3.select(this.$refs.chartContainer).html("");

            // Define the chart container styles
            const container = d3
                .select(this.$refs.chartContainer)
                .style("width", `${containerWidth}px`)
                .style("height", `${containerHeight}px`)
                .style("position", "relative");

            // Render tiles
            let xOffset = 0;
            data.forEach((d, i) => {
                const sliceWidth = scaledWidths[i];
                const color = this.getColor(d.type);

                container
                    .append("div")
                    .style("position", "absolute")
                    .style("top", "0")
                    .style("left", `${xOffset}px`)
                    .style("width", `${sliceWidth}px`)
                    .style("height", `${height}px`)
                    .style("background-color", color)
                    .style("display", "flex")
                    .style("justify-content", "left")
                    .style("align-items", "top")
                    .style("padding", "1.5rem")
                    .style("box-sizing", "border-box")
                    .style("color", "white")
                    .html(`<div style="text-align: center;">
                        <img src="${d.svg}" alt="${d.type}" style="width: 24px; height: 24px;" />
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
                    .html(`<div class="label-wrapper"><div class="label-name">${d.type}</div><div class="label-value">${d.TotalEmissionsPerCapita.toFixed(2)}kg</div></div>`);

                xOffset += sliceWidth;
            });
        },
        getColor(type) {
            const customColors = ["#1C4028", "#2B532F", "#41643B", "#597848", "#718258"];
            const types = this.rawData.map((d) => d.type);
            const colorScale = d3.scaleOrdinal().domain(types).range(customColors);
            return colorScale(type);
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
