<template>
    <div ref="chartContainer" class="chart-container"></div>
</template>

<script>
import * as d3 from "d3";
import { svg } from "d3";

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

                this.rawData = json
                    .map((item) => ({
                        name: item.type,
                        value: item.TotalEmissionsPerCapita,
                        svg: new URL(`../assets/${item.svg}`, import.meta.url).href,
                    }))
                    .sort((a, b) => b.value - a.value);

                const minValue = d3.min(this.rawData, (d) => d.value);
                const maxValue = d3.max(this.rawData, (d) => d.value);

                const customColors = ["#1C4028", "#2B532F", "#41643B", "#597848", "#718258"];
                this.colorScale = d3.scaleOrdinal()
                    .domain(this.rawData.map((d) => d.name))
                    .range(customColors);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
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

            // Scaling the chart so everything fits neately
            const minTileWidth = 100;
            const maxTileWidth = containerWidth * 0.5;
            const powerScale = d3.scalePow()
                .exponent(0.9)
                .domain([d3.min(data, (d) => d.value), d3.max(data, (d) => d.value)])
                .range([minTileWidth, maxTileWidth]);

            let scaledWidths = data.map((d) => Math.max(powerScale(d.value), minTileWidth));

            const totalScaledWidth = scaledWidths.reduce((sum, w) => sum + w, 0);

            const scaleFactor = containerWidth / totalScaledWidth;
            scaledWidths = scaledWidths.map((w) => w * scaleFactor);

            d3.select(this.$refs.chartContainer).html("");

            const container = d3
                .select(this.$refs.chartContainer)
                .style("width", `${containerWidth}px`)

                // height but with extra height so there's space for the labels
                .style("height", `${height + 100}px`)
                .style("position", "relative");

            let xOffset = 0;
            data.forEach((d, i) => {
                const sliceWidth = scaledWidths[i];
                const color = this.colorScale(d.value);

                console.log("Value:", d.value, "Scaled Width:", powerScale(d.value));

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
                    .style("font-family", "sans-serif")
                    .style("font-size", "14px")
                    .html(`<div style="text-align: center;">
                    <img src="${d.svg}" alt="${d.name}" style="width: 24px; height: 24px;" />
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