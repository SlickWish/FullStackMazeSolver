# Simple Full Stack Maze Solver

An almost full stack maze solver written entirely in javascript and html.

Utilizes npm, node.js, express, AngularJS

## Prerequisites

node 8.x (including associated version of NPM)

# Running The Application

```
npm install
npm start
```

Then point your browser to http://localhost:3000

# Package Structure

/src/index.js is the source for the entire backend. 
/src/web/**/* contains the client / browser side of the solution

# REST endpoint

A single endpoint post method is exposed (/mazesolver). I though about creating a split system where you'd submit a maze and the app would store it and then work on it in the background. It'd then notify the browser that a solution was ready.

The restraint given was that the maze be solved in under a minute. This app solves it in just a couple seconds on an i5 so I figured the above idea was an overly complex solution.

# Maze Solve Methodology Used

The maze in converted into an undirected graph.

Simple BFS is used to calculate the route. Given more time I would have optimized the graph to elmininate connections that are in "straight lines" with a single edge and weight replacing the steps and then using A* or Dijstrka.

#Frontend

The front end is a crude text area for input, a button form submission and a table for the maze display.

It's not pretty.








