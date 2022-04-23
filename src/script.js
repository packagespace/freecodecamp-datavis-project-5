const KICKSTARTER_JSON =
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

const options = {
	title: "Kickstarter Pledges",
	description: "100 most pledged projects",
	dimensions: {
		width: 1000,
		height: 500,
	},
	padding: {
		top: 100,
		right: 400,
		bottom: 150,
		left: 50,
		inner: 1,
	},
	titlePosition: {
		x: 15,
		y: 15,
	},
	descriptionPosition: {
		x: 15,
		y: 40,
	},
	tooltipOffset: {
		x: -75,
		y: -100,
	},
	legendDimensions: {
		width: 250,
		height: 600,
	},
	legendPosition: {
		x: 1100,
		y: 110,
	},
	legendItemOffset: 25,
};

d3.json(KICKSTARTER_JSON)
	.then((data) => Treemap(data, options))
	.catch((err) => console.error(err.message, err.lineNumber, err.fileName));

function Treemap(
	data,
	{
		title,
		description,
		dimensions,
		padding,
		titlePosition,
		descriptionPosition,
		tooltipOffset,
		legendDimensions,
		legendPosition,
		legendItemOffset,
	}
) {
	//compute dimensions
	const [totalWidth, totalHeight] = getTotalDimensions(dimensions, padding);

	//create svg
	const svg = d3
		.select("#visHolder")
		.append("svg")
		.attr("id", "vis")
		.attr("width", totalWidth)
		.attr("height", totalHeight)
		.attr("viewBox", [0, 0, totalWidth, totalHeight])
		.attr("style", "width: 100%; height: auto; height: intrinsic;");

	//create title
	const titleElement = svg
		.append("text")
		.attr("id", "title")
		.text(title)
		.attr("x", titlePosition.x)
		.attr("y", titlePosition.y);

	//create description
	const descriptionElement = svg
		.append("text")
		.attr("id", "description")
		.text(description)
		.attr("x", descriptionPosition.x)
		.attr("y", descriptionPosition.y);

	//create chart area
	const chartArea = svg
		.append("svg")
		.attr("id", "chartArea")
		.attr("width", dimensions.width)
		.attr("height", dimensions.height)
		.attr("transform", `translate(${padding.left}, ${padding.top})`);

	//compute treemap
	const root = d3
		.hierarchy(data)
		.sum((d) => d.value)
		.sort((a, b) => d3.descending(a.value, b.value));
	const treemap = d3
		.treemap()
		.size([dimensions.width, dimensions.height])
		.paddingInner(padding.inner);
	treemap(root);

	//create category array
	const categories = data.children.map((child) => child.name);

	//create category - color scale
	const colorScale = d3
		.scaleOrdinal([
			"#1f77b4",
			"#aec7e8",
			"#ff7f0e",
			"#ffbb78",
			"#2ca02c",
			"#98df8a",
			"#d62728",
			"#ff9896",
			"#9467bd",
			"#c5b0d5",
			"#8c564b",
			"#c49c94",
			"#e377c2",
			"#f7b6d2",
			"#7f7f7f",
			"#c7c7c7",
			"#bcbd22",
			"#dbdb8d",
			"#17becf",
			"#9edae5",
		])
		.domain(categories);

	//create legend area
	const legendArea = svg
		.append("svg")
		.attr("id", "legend")
		.attr("transform", `translate(${legendPosition.x}, ${legendPosition.y})`)
		.attr("height", legendDimensions.height)
		.attr("width", legendDimensions.width);

	//create legend lines
	const legendLines = legendArea
		.selectAll("g")
		.data(categories)
		.join("g")
		.attr("class", "legend-line")
		.attr("transform", (_d, i) => `translate(0, ${legendItemOffset * i})`);

	//create legend tiles
	const legendTiles = legendLines
		.append("rect")
		.attr("class", "legend-item")
		.attr("width", 20)
		.attr("height", 20)
		.attr("fill", colorScale);

	//create legend text
	const legendText = legendLines
		.append("text")
		.attr("class", "legend-text")
		.attr("transform", `translate(${legendItemOffset}, ${20})`)
		.text((d) => d);
	//create tiles
	const tiles = chartArea
		.selectAll("rect")
		.data(root.leaves())
		.join("rect")
		.attr("class", "tile")
		.attr("transform", (d) => `translate(${d.x0},${d.y0})`)
		.attr("width", (d) => d.x1 - d.x0)
		.attr("height", (d) => d.y1 - d.y0)
		.attr("fill", (d) => colorScale(d.data.category))
		.attr("data-name", (d) => d.data.name)
		.attr("data-category", (d) => d.data.category)
		.attr("data-value", (d) => d.data.value)
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseleave", mouseleave);

	//create tooltip
	const tooltip = d3.select("#visHolder").append("div").attr("id", "tooltip");

	//event functions
	function mouseover(_e, d) {
		const tile = d3.select(this);
		tooltip
			.html(`${tile.attr("data-name")}: ${tile.attr("data-value")} pledges`)
			.style("opacity", 1)
			.attr("data-value", tile.attr("data-value"));
	}
	function mousemove(e) {
		tooltip
			.style("left", `${e.pageX + tooltipOffset.x}px`)
			.style("top", `${e.pageY + tooltipOffset.y}px`);
	}
	function mouseleave() {
		tooltip.style("opacity", 0);
	}
	//helper functions
	function getTotalDimensions(dimensions, padding) {
		return [
			dimensions.width + padding.left + padding.right,
			dimensions.height + padding.top + padding.bottom,
		];
	}
}
