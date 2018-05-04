/* Maze Solver for Lead Engineer Role
*/
var express = require("express");
var bodyParser = require("body-parser");
var _ = require('lodash');
var app = express();

// Graph 'class' for storing and working with a graph.
function Graph() {
    this.nodes = [];
    this.edges = [];
}

// Add a node to the graph.
Graph.prototype.addNode = function (node) {
    this.nodes.push(node);
}

// Add an edge to the graph. 
Graph.prototype.addEdge = function (nodea, nodeb) {
    if (this.edges[nodea] === undefined) {
        this.edges[nodea] = [];
    }
    if (this.edges[nodeb] === undefined) {
        this.edges[nodeb] = [];
    }
    this.edges[nodea].push(nodeb);
    this.edges[nodeb].push(nodea);
}

// Use BFS to find the shortest route from A to B
Graph.prototype.findRoute = function (nodea, nodeb) {
    var work = [];
    work.push(nodea);
    var done = [];
    done[nodea] = true;
    var routes = [];

    while (work.length > 0) {
        // take a node to work on it.
        var current = work.shift();
        // go through this nodes connections
        _.each(this.edges[current], (nextNode) => {
            if (!done[nextNode]) {
                done[nextNode] = true;
                //load the work list with this level of node
                work.push(nextNode);
                //keep track of the path used to get to each node
                routes[nextNode] = current;
            }
        });
        // we found our target node so we can bail. this is a dumb bail because it has to finish the whole level first.
        if (done[nodeb]) {
            work = [];
        }
    }

    //make a list of our route
    var route = []
    for (var node = nodeb; node != nodea; node = routes[node]) {
        route.push(node);
    }

    //flip it so its not a backtrack route
    route.reverse();

    return route;
}

//get the maze, convert it and package for the browser
function MazeSolver() {
    this.txt = []
    this.graph = new Graph();
    this.startNode = '';
    this.endNode = '';
    this.route = undefined;
}

// get a json object with the maze from the browser
MazeSolver.prototype.setMaze = function (maze) {
    this.txt = maze;
}

// solve and find the route
MazeSolver.prototype.solveMaze = function () {
    var x = -1;
    var y = -1;

    // for each row
    _.each(this.txt, (line) => {
        x++;
        y = -1;
        // each column
        _.each(line, (char) => {
            y++;
            // if we aren't a wall then we are a node
            if (this.txt[x][y] !== '#') {
                this.graph.addNode(x + '_' + y);
                // remember our starting point
                if (this.txt[x][y] === 'A') {
                    this.startNode = x + '_' + y;
                }
                // remember our ending point
                if (this.txt[x][y] === 'B') {
                    this.endNode = x + '_' + y;
                }
                // look forward, if its empty then connect it. we don't have to look back because the previous node looked forward to connect us
                if (this.txt[x].length > y + 1) {
                    if (this.txt[x][y + 1] !== '#') {
                        this.graph.addEdge(x + '_' + y, x + '_' + (y + 1));
                    }
                }
                // look down, if its empty then connect it. we don't have to look up because the previous node look down to connect us
                if (this.txt.length > x + 1) {
                    if (this.txt[x + 1][y] !== '#') {
                        this.graph.addEdge(x + '_' + y, (x + 1) + '_' + y)
                    }
                }
            }
        });
    })
    //then find the route
    this.route = this.graph.findRoute(this.startNode, this.endNode);

    return this.route;
}

// package the result for return to the browser
MazeSolver.prototype.printSolvedMaze = function () {
    var maze = []
    _.each(this.route, (step) => {
        var coord = step.split('_');
        this.txt[parseInt(coord[0])][parseInt(coord[1])] = 'X';
    });

    return { route: this.txt, steps: this.route.length };
}

// set up our static content view for our web page.
app.use('/', express.static('src/web'))

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// register our post endpoint for maze submissions
app.post('/mazesolver', function (req, res) {
    var mazesolver = new MazeSolver();

    // take the data from the browser and solve it.
    mazesolver.setMaze(req.body);
    mazesolver.solveMaze();

    var result = mazesolver.printSolvedMaze();

    res.end(JSON.stringify(result));
});

app.listen(3000, function () {
    console.log("Started on PORT 3000 http://localhost:3000");
})
