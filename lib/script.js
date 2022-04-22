"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var KICKSTARTER_JSON = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
var options = {
  title: "Kickstarter Pledges",
  description: "Top 100",
  dimensions: {
    width: 1000,
    height: 500
  },
  padding: {
    top: 100,
    right: 50,
    bottom: 150,
    left: 50,
    inner: 1
  },
  titlePosition: {
    x: 15,
    y: 15
  },
  descriptionPosition: {
    x: 15,
    y: 40
  }
};
d3.json(KICKSTARTER_JSON).then(function (data) {
  return Treemap(data, options);
})["catch"](function (err) {
  return console.error(err.message, err.lineNumber, err.fileName);
});

function Treemap(data, _ref) {
  var title = _ref.title,
      description = _ref.description,
      dimensions = _ref.dimensions,
      padding = _ref.padding,
      titlePosition = _ref.titlePosition,
      descriptionPosition = _ref.descriptionPosition;

  //compute dimensions
  var _getTotalDimensions = getTotalDimensions(dimensions, padding),
      _getTotalDimensions2 = _slicedToArray(_getTotalDimensions, 2),
      totalWidth = _getTotalDimensions2[0],
      totalHeight = _getTotalDimensions2[1];
  /*const [totalLegendWidth, totalLegendHeight] = getTotalDimensions(
  	legendDimensions,
  	legendPadding
  );*/
  //create svg


  var svg = d3.select("#visHolder").append("svg").attr("id", "vis").attr("width", totalWidth).attr("height", totalHeight).attr("viewBox", [0, 0, totalWidth, totalHeight]).attr("style", "width: 100%; height: auto; height: intrinsic;"); //create title

  var titleElement = svg.append("text").attr("id", "title").text(title).attr("x", titlePosition.x).attr("y", titlePosition.y); //create description

  var descriptionElement = svg.append("text").attr("id", "description").text(description).attr("x", descriptionPosition.x).attr("y", descriptionPosition.y); //create chart area

  var chartArea = svg.append("svg").attr("id", "chartArea").attr("width", dimensions.width).attr("height", dimensions.height).attr("transform", "translate(".concat(padding.left, ", ").concat(padding.top, ")")); //compute treemap

  var root = d3.hierarchy(data).sum(function (d) {
    return d.value;
  }).sort(function (a, b) {
    return d3.descending(a.value, b.value);
  });
  console.log(dimensions.width);
  var treemap = d3.treemap().size([dimensions.width, dimensions.height]).paddingInner(padding.inner);
  treemap(root); //create category - color scale

  var categories = data.children.map(function (child) {
    return child.name;
  });
  var color = d3.scaleOrdinal(d3.schemeCategory10).domain(categories); //create rectangles

  var tiles = chartArea.selectAll("rect").data(root.leaves()).join("rect").attr("class", "tile").attr("transform", function (d) {
    return "translate(".concat(d.x0, ",").concat(d.y0, ")");
  }).attr("width", function (d) {
    return d.x1 - d.x0;
  }).attr("height", function (d) {
    return d.y1 - d.y0;
  }).attr("fill", function (d) {
    return color(d.data.category);
  }).attr("data-name", function (d) {
    return d.data.name;
  }).attr("data-category", function (d) {
    return d.data.category;
  }).attr("data-value", function (d) {
    return d.data.value;
  });
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
    return [dimensions.width + padding.left + padding.right, dimensions.height + padding.top + padding.bottom];
  }
}