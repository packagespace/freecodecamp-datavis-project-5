const KICKSTARTER_JSON =
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

const options = {
	title: "Kickstarter Pledges",
	description: "idk",
	dimensions: {
		width: 1250,
		height: 500,
	},
	padding: {
		top: 100,
		right: 50,
		bottom: 150,
		left: 50,
		inner: 5,
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

	//treemap stuff
	const root = d3
		.hierarchy(data)
		.sum((d) => d.value)
		.sort((a, b) => d3.descending(a.value, b.value));
	const treemap = d3.treemap(root);

	//helper functions
	function getTotalDimensions(dimensions, padding) {
		return [
			dimensions.width + padding.left + padding.right,
			dimensions.height + padding.top + padding.bottom,
		];
	}
}
