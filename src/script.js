const KICKSTARTER_JSON = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";

function Treemap(data, options){
    console.log(data);
};

const options = {

}

d3.json(KICKSTARTER_JSON).then(data => Treemap(data, options));