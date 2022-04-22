"use strict";

var KICKSTARTER_JSON = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

function Treemap(data, options) {
  console.log(data);
}

;
var options = {};
d3.json(KICKSTARTER_JSON).then(function (data) {
  return Treemap(data, options);
});