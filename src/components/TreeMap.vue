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
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.processData();
                this.createChart();
                window.addEventListener("resize", this.updateChart);
            }, 50);
        });
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.updateChart);
    },
    data() {
        return {
            processedData: [],
        };
    },
    methods: {
        processData() {
            this.processedData = this.data
                .map((item) => ({
                    ...item,
                    svg: new URL(`../assets/${item.svg}`, import.meta.url).href, // Add SVG dynamically
                }))
                .sort((a, b) => b.TotalEmissionsPerCapita - a.TotalEmissionsPerCapita); // Sort descending
        },
        createChart() {
            this.updateChart();
        },
        updateChart() {
            if (!this.$refs.chartContainer || !this.processedData.length) return;

            const data = this.processedData;
            const containerWidth = this.$refs.chartContainer.parentElement.offsetWidth || 500; // Default width
            const containerHeight = this.$refs.chartContainer.parentElement.offsetHeight || 400; // Default height
            const height = containerHeight - 210;

            // Define power scale for nicer width distribution
            const minTileWidth = 100;
            const maxTileWidth = containerWidth * 0.35;
            const powerScale = d3.scalePow()
                .exponent(0.5)
                .domain([
                    d3.min(data, (d) => d.TotalEmissionsPerCapita),
                    d3.max(data, (d) => d.TotalEmissionsPerCapita),
                ])
                .range([minTileWidth, maxTileWidth]);

            let scaledWidths = data.map((d) =>
                Math.max(powerScale(d.TotalEmissionsPerCapita), minTileWidth)
            );
            const totalScaledWidth = scaledWidths.reduce((sum, w) => sum + w, 0);
            const scaleFactor = containerWidth / totalScaledWidth;
            scaledWidths = scaledWidths.map((w) => w * scaleFactor);

            d3.select(this.$refs.chartContainer).html("");

            const container = d3
                .select(this.$refs.chartContainer)
                .style("width", `${containerWidth}px`)
                .style("height", `${containerHeight}px`)
                .style("position", "relative");

            const tooltip = d3
                .select(this.$refs.chartContainer)
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("opacity", 0);

            let xOffset = 0;
            data.forEach((d, i) => {
                const sliceWidth = scaledWidths[i];
                const color = this.getColor(d.type);

                const tile = container
                    .append("div")
                    .style("position", "absolute")
                    .style("top", "0")
                    .style("left", `${xOffset}px`)
                    .style("width", `${sliceWidth}px`)
                    .style("height", `${height}px`)
                    .style("background-color", color)
                    .style("cursor", "pointer")
                    .style("box-sizing", "border-box")
                    .style("padding", "1.5rem")
                    .style("display", "flex")
                    .html(`
                <img src="${d.svg}" alt="${d.type}" style="width: 2rem; height: 2rem; margin-bottom: 10px;" />
                
            `)
                    .on("mousemove", (event) => {
                        const { pageX, pageY } = event;
                        const tooltipWidth = tooltip.node().offsetWidth;
                        const tooltipHeight = tooltip.node().offsetHeight;

                        const containerRect = this.$refs.chartContainer.getBoundingClientRect();
                        const containerLeft = containerRect.left;
                        const containerTop = containerRect.top;
                        const containerWidth = containerRect.width;
                        const containerHeight = containerRect.height;

                        let left = pageX - containerLeft + 20;
                        let top = pageY - containerTop + 20;

                        // Adjust for container boundaries
                        if (left + tooltipWidth > containerWidth) {
                            left = containerWidth - tooltipWidth - 10;
                        }
                        if (top + tooltipHeight > containerHeight) {
                            top = containerHeight - tooltipHeight - 10;
                        }
                        if (left < 0) {
                            left = 10;
                        }
                        if (top < 0) {
                            top = 10;
                        }

                        const emissions = [
                            { category: "Land Use", value: d.emissionsLandUse },
                            { category: "Farming", value: d.emissionsFarming },
                            { category: "Feed", value: d.emissionsFeed },
                            { category: "Processing", value: d.emissionsProcessing },
                            { category: "Transport", value: d.emissionsTransport },
                            { category: "Retail", value: d.EmissionsRetail },
                            { category: "Packaging", value: d.emissionsPackaging },
                            { category: "Waste", value: d.emissionsWaste },
                        ];

                        const powerScale = d3.scalePow()
                            .exponent(0.4)
                            .domain([0, d3.max(emissions, (item) => item.value)])
                            .range([0, 100]);

                        const treemapHtml = emissions
                            .map((item) => {
                                const scaledWidth = powerScale(item.value);
                                return `<div style="display: inline-block; width: ${scaledWidth}%; height: 2rem; background-color: ${this.getColor(item.category)};"></div>`;
                            })
                            .join("");

                        tooltip
                            .html(`
                                <div class="tooltip-header"><p>${d.type}</p><p>${d.TotalEmissionsPerCapita.toFixed(2)} CO2/year</p></div>
                                <div class="tooltip-divider"></div>
                                <div class="tooltip-line-wrapper">
                                    <div class="tooltip-line"><p>Land Use:</p> <p>${d.emissionsLandUse}kg</p></div>
                                    <div class="tooltip-line"><p>Farming:</p> <p>${d.emissionsFarming}kg</p></div>
                                    <div class="tooltip-line"><p>Feed:</p> <p>${d.emissionsFeed}kg</p></div>
                                    <div class="tooltip-line"><p>Processing:</p><p>${d.emissionsProcessing}kg</p></div>
                                    <div class="tooltip-line"><p>Transport:</p><p>${d.emissionsTransport}kg</p></div>
                                    <div class="tooltip-line"><p>Retail:</p><p>${d.EmissionsRetail}kg</p></div>
                                    <div class="tooltip-line"><p>Packaging:</p><p>${d.emissionsPackaging}kg</p></div>
                                    <div class="tooltip-line"><p>Waste:</p><p>${d.emissionsWaste}kg</p></div>
                                    <div class="mini-treemap">${treemapHtml}</div>
                                </div>
                                 
                            `)
                            .style("top", `${top}px`)
                            .style("left", `${left}px`)
                            .style("opacity", 1);
                    })
                    .on("mouseleave", () => {
                        tooltip.style("opacity", 0);
                    })
                    .on("click", () => {
                        this.$router.push({
                            path: `/animal/${d.type.toLowerCase()}`, // Pass only the type
                        });
                    });

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

        //My own color palette for big treemap according to Figma
        getColor(type) {
            const parentColors = ["#1C4028", "#2B532F", "#41643B", "#597848", "#718258"];
            const categoryColors = {
                "Land Use": "#1C4028",
                "Farming": "#2B532F",
                "Feed": "#41643B",
                "Processing": "#597848",
                "Transport": "#718258",
                "Retail": "#8B9D6E",
                "Packaging": "#A8C19B",
                "Waste": "#C3D5B8",
            };

            // Check if the type matches any existing acategory colors
            if (categoryColors[type]) {
                return categoryColors[type];
            }

            // Fallback to parentColors for types
            const types = this.processedData.map((d) => d.type);
            const colorScale = d3.scaleOrdinal().domain(types).range(parentColors);
            return colorScale(type);
        },

    }
};
</script>

<style>
.chart-container {
    display: block;
    overflow: hidden;
}

.tooltip {
    position: absolute;
    z-index: 10;
    background: #121515;
    color: #fff;
    padding: 1rem;
    pointer-events: none;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: opacity 0.2s ease-in-out;
    width: 18rem;
}

.tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;
}

.tooltip-header>p:nth-child(1) {
    font-size: 1.2rem;
    margin: 0;
}

.tooltip-header>p:nth-child(2) {
    font-size: 1.2rem;
    color: #94B268;
    margin: 0;
}

.tooltip-line-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.tooltip-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: stretch;

}

.tooltip-line>p {
    color: #8E9090;
    margin: 0;
    font-size: 0.8rem;
}

.tooltip-divider {
    border: 1px dashed rgba(255, 255, 255, 0.12);
}

.mini-treemap {
    margin-top: 10px;
    width: 100%;
    display: flex;
    align-items: center;
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
