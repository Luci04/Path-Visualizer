import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../src/algorithms/dijkstra';
import { bfs } from './algorithms/bfs';
import './Pathfinding.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            allTime: [],
            mouseIsPressed: false,
            visited: []
        };
        this.Reset = this.Reset.bind(this);
    }

    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({ grid });
    }

    handleMouseDown(row, col) {
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid, mouseIsPressed: true });
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
    }

    handleMouseUp() {
        this.setState({ mouseIsPressed: false });
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    Reset() {
        const visitedNodesInOrder = this.state.visited.reverse();

        document.getElementById(`node-10-35`).style.backgroundColor = "red";

        let i;

        for (i = 0; i < visitedNodesInOrder.length; i++) {

            const node = visitedNodesInOrder[i];
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node';
            }, 5 * i);
        }

        setTimeout(() => {
            document.getElementById(`node-10-15`).style.backgroundColor = "green";
        }, i * 5);

    }

    colorAlgo(visitedNodesInOrder, nodesInShortestPathOrder) {

        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                this.colorShortestPath(nodesInShortestPathOrder);
                return;
            }
            const node = visitedNodesInOrder[i];

            if (node.isStart) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited-start-simple';
            }
            else if (node.isFinish) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited-finish-simple';
            }
            else if (node.isWeight) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited-weight-simple';
            }
            else {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited-simple';
            }
        }
    }

    colorShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {

            const node = nodesInShortestPathOrder[i];
            if (node.isStart) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path-start-simple';
            }
            else if (node.isFinish) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path-finish-simple';
            }
            else {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path-simple';
            }
        }
    }

    animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder) {

        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 5 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];

                if (node.isStart) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited-start';
                }
                else if (node.isFinish) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited-finish';
                }
                else if (node.isWeight) {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited-weight';
                }
                else {
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                        'node node-visited';
                }
            }, 5 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    visualizeDijkstra() {
        const { grid } = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        this.setState({ visited: visitedNodesInOrder });
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    visualizeBfs() {
        const grid = this.state.grid;
        var flag = 0;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = bfs(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        if (flag === 0) {
            this.animateAlgo(visitedNodesInOrder, nodesInShortestPathOrder);
            flag = 1;
        }
        else {
            this.colorAlgo(visitedNodesInOrder, nodesInShortestPathOrder);
        }
    }

    render() {
        const { grid, mouseIsPressed } = this.state;

        return (
            <div>
                <div>
                    <button className="btn draw-border" onClick={() => this.visualizeDijkstra()}>
                        Visualize Dijkstra's Algorithm
        </button>
                    <button className="btn draw-border" onClick={() => this.visualizeBfs()}>
                        Visualize BFS Algorithms
        </button>
                    <button className="btn draw-border" onClick={() => this.Reset()}>Click to reload!</button>
                </div>
                <div className="grid">
                    {grid.map((row, rowIdx) => {
                        return (
                            <div key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    const { row, col, isFinish, isStart, isWall } = node;
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            col={col}
                                            isFinish={isFinish}
                                            isStart={isStart}
                                            isWall={isWall}
                                            mouseIsPressed={mouseIsPressed}
                                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                            onMouseEnter={(row, col) =>
                                                this.handleMouseEnter(row, col)
                                            }
                                            onMouseUp={() => this.handleMouseUp()}
                                            row={row}></Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

        );
    }
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};

const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};