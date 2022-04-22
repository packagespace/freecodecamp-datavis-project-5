const KICKSTARTER_JSON =
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

const options = {
	title: "Kickstarter Pledges",
	description: "Top 100",
	dimensions: {
		width: 1000,
		height: 500,
	},
	padding: {
		top: 100,
		right: 50,
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
	}
) {
	//compute dimensions
	const [totalWidth, totalHeight] = getTotalDimensions(dimensions, padding);
	/*const [totalLegendWidth, totalLegendHeight] = getTotalDimensions(
		legendDimensions,
		legendPadding
	);*/

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
	console.log(dimensions.width);
	const treemap = d3
		.treemap()
		.size([dimensions.width, dimensions.height])
		.paddingInner(padding.inner);
	treemap(root);

	//create category - color scale
	const categories = data.children.map((child) => child.name);

	const color = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

	//create rectangles
	const tiles = chartArea
		.selectAll("rect")
		.data(root.leaves())
		.join("rect")
		.attr("class", "tile")
		.attr("transform", (d) => `translate(${d.x0},${d.y0})`)
		.attr("width", (d) => d.x1 - d.x0)
		.attr("height", (d) => d.y1 - d.y0)
		.attr("fill", (d) => color(d.data.category))
		.attr("data-name", (d) => d.data.name)
		.attr("data-category", (d) => d.data.category)
		.attr("data-value", (d) => d.data.value);
	/*
		.attr("xlink:href", link == null ? null : (d, i) => link(d.data, d))
		.attr("target", link == null ? null : linkTarget)
		.attr("transform", (d) => `translate(${d.x0},${d.y0})`);
	
  node.append("rect")
      .attr("fill", color ? (d, i) => color(G[i]) : fill)
      .attr("fill-opacity", fillOpacity)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);
	*/
	//helper functions
	function getTotalDimensions(dimensions, padding) {
		return [
			dimensions.width + padding.left + padding.right,
			dimensions.height + padding.top + padding.bottom,
		];
	}
}
