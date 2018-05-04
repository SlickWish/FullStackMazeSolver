angular.module('mazeSolverApp', [])
    .controller('MazeSolverController', function ($scope, $http) {
        var solver = this;
        solver.maze=[];
        solver.mazeText = "";
        solver.steps = 0;

        // yeah. its cut and paste code 
        solver.displayMaze = function () {
            solver.maze=[];
            var converted = solver.mazeText + '';
            var lines = converted.split(/\r?\n/)
            var txt = [];

            for(line in lines) {
                var array = lines[line].split('');
                txt.push(array);
            }
            solver.maze=txt;
        }

        // send the maze to the backend for solving.
        solver.solveMaze = function () {
            solver.maze=[];
            var converted = solver.mazeText + '';
            var lines = converted.split(/\r?\n/)
            var txt = [];

            for(line in lines) {
                var array = lines[line].split('');
                txt.push(array);
            }
            solver.maze=txt;

            $http.post('mazesolver',txt).
                then(function (response) {
                    solver.maze = response.data.route;
                    solver.steps = response.data.steps;
                });
        };


    });