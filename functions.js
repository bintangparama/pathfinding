/**
 * PathFinding Node
 * 
 * Note: "Node" was taken
 */
class PFNode {
    x = 0;
    y = 0;
    edge = false;
    evaluated = false;
    type = 'WALKABLE';
    neighbour = false;
    /** @type {PFNode[]} */
    neighbours = [];
    gcost = 0;
    hcost = 0;
    fcost = 0;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {HTMLDivElement} element 
     * @param {boolean} edge 
     */
    constructor(x, y, element, edge) {
        if (!x && !y && !element && !edge) return;

        this.walkable = true;
        this.x = x;
        this.y = y;
        this.element = element;
        this.edge = edge;
    }

    Update() {
        if (this.type == 'WALKABLE') this.element.style.backgroundColor = 'white';

        if (this.evaluated) {
            this.element.style.backgroundColor = 'red';
            this.neighbour = false;
        }

        if (this.neighbour) {
            this.element.style.backgroundColor = 'lightgreen';
        }

        if (this.type == 'TARGET') this.element.style.backgroundColor = 'darkgreen';
        if (this.type == 'START') this.element.style.backgroundColor = 'darkblue';
        if (this.type == 'UNWALKABLE') this.element.style.backgroundColor = 'black';
    }
    
    FindNeighbour() {
        this.neighbours = [];
        if (this.edge) {
            /*
            this.CheckNeighbour( this.x + 1, this.y + 1 );
            this.CheckNeighbour( this.x + 1, this.y - 1 );
            this.CheckNeighbour( this.x - 1, this.y + 1 );
            this.CheckNeighbour( this.x - 1, this.y - 1 );
*/
            this.CheckNeighbour( this.x, this.y + 1 );
            this.CheckNeighbour( this.x, this.y - 1 );
            this.CheckNeighbour( this.x + 1, this.y );
            this.CheckNeighbour( this.x - 1, this.y );

        } else if (!this.edge) {/*
            this.neighbours.push( grid[ this.x - 1 ][ this.y - 1 ] );
            this.neighbours.push( grid[ this.x - 1 ][ this.y + 1 ] );
            this.neighbours.push( grid[ this.x + 1 ][ this.y - 1 ] );
            this.neighbours.push( grid[ this.x + 1 ][ this.y + 1 ] );*/
            this.neighbours.push( grid[ this.x ][ this.y + 1 ] );
            this.neighbours.push( grid[ this.x ][ this.y - 1 ] );
            this.neighbours.push( grid[ this.x + 1 ][ this.y ] );
            this.neighbours.push( grid[ this.x - 1 ][ this.y ] );
        }
    }
    CheckNeighbour(x, y) {
        var n = grid[x];
        if (n) n = grid[x][y];
        if (n) this.neighbours.push(n) 
    }

    /**
     * 
     * @param {PFNode} start 
     * @param {PFNode} target 
     */
    CalculateCosts(start, target) {

        // FINDING G COST
        var diff = {
            x: Math.abs( this.x  - start.x ),
            y: Math.abs( this.y  - start.y )
        }
        this.gcost = Math.round(
            Math.sqrt(
                (diff.x ** 2) + (diff.y ** 2)
            ) * 10
        )

        // FINDING H COST
        diff = {
            x: Math.abs( this.x  - target.x ),
            y: Math.abs( this.y  - target.y )
        }
        this.hcost = Math.round(
            Math.sqrt(
                (diff.x ** 2) + (diff.y ** 2)
            ) * 10
        )

        this.fcost = this.hcost + this.gcost
    } 
}

/** @type {PFNode} */
var start;
/** @type {PFNode} */
var target;
var mouseIsDown = false;

document.addEventListener('mousedown',() => {
    mouseIsDown = true;
});
document.addEventListener('mouseup',() => mouseIsDown = false);

/**
 * Creates and fills grid
 * @param {number} width 
 */
function InitializeGrid(width) {
    // Create grid
    var element = document.createElement('div');

    element.id = 'grid';
    element.style.gridTemplateRows = `repeat(${width}, 1fr)`;
    element.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

    document.body.appendChild(element);

    // Fill grid
    grid = [];
    for (let x = 0; x < width; x++) {
        var column = [];
        for (let y = 0; y < width; y++) {
            var node = document.createElement('div');

            node.id = 'node';
            node.addEventListener('mouseenter', e => {
                if (mouseIsDown && start && target) {
                    var node = new PFNode();
                    for (let x = 0; x < width; x++) {
                        for (let y = 0; y < width; y++) {
                            if (grid[y][x].element == e.target) {
                                node = grid[y][x];
                                break;
                            }
                        }
                    }
                    if (node.type != 'TARGET' && node.type != 'START' && !node.edge){
                        if (paint.isOn) node.type = 'UNWALKABLE';
                        if (!paint.isOn) {
                            node.type = 'WALKABLE';
                        }
                    }
                    UpdateGrid()
                }
            });
            node.addEventListener('mousedown', e => {
                var node = new PFNode();
                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < width; y++) {
                        if (grid[y][x].element == e.target) {
                            node = grid[y][x];
                            break;
                        }
                    }
                }
                if (!start) {
                    SetStart(node);
                } else if (start && !target) {
                    SetTarget(node)
                }
            })

            element.appendChild(node);
            
            var isEdge = x == 0 || x == (width - 1) || y == 0 || y == (width - 1);

            column.push( new PFNode(x, y, node, isEdge) );
        }
        grid.push(column);
    }
}

function UpdateGrid() {
    grid.forEach(c => {
        c.forEach(n => {
            n.Update();
        })
    })
}

function FindNeigbours() {
    grid.forEach(c => {
        c.forEach(n => {
            n.FindNeighbour();
        })
    })
}

/**
 * 
 * @param {PFNode} node 
 */
function SetStart(node) {
    if (start) start.type = 'WALKABLE';
    node.type = 'START';
    start = node;
    UpdateGrid()
}

/**
 * 
 * @param {PFNode} node 
 */
function SetTarget(node) {
    if (target) target.type = 'WALKABLE';
    node.type = 'TARGET';
    target = node;
    UpdateGrid()
}

function ResetGrid() {
    grid.forEach(c => {
        c.forEach(n => {
            n.type = 'WALKABLE';
            n.evaluated = false;
            n.neighbour = false;
        })
    });
    UpdateGrid()
    start = undefined;
    target = undefined;

}

/**
 * 
 * @param {number} speed in ms
 */
function Eval() {
    grid.forEach(c => {
        c.forEach(n => {
            n.evaluated = false;
            n.CalculateCosts(start, target);
            n.FindNeighbour();
            n.neighbour = false;
        })
    });

    var nodeToProcess = [start];

    var done = false;
    var interval = setInterval(() => {
        if (done) {
            clearInterval(interval);
            console.log('FINISHED');
            return;
        }

        UpdateGrid();

        if (nodeToProcess.length > 1) nodeToProcess.sort((a, b) => {
            return a.fcost - b.fcost;
        })
        var current = nodeToProcess[0];
        if (current != start) current.evaluated = true;
        nodeToProcess.splice(
            nodeToProcess.findIndex(n => {
                return n == current;
            }), 1
        )

        if (current.type == 'TARGET') {
            done = true;
            return;
        }

        var neighbours = current.neighbours;

        for (let i = 0; i < neighbours.length; i++) {
            var neighbour = neighbours[i];
            if (neighbour.type == 'UNWALKABLE' || neighbour.evaluated) {
                continue;
            } else {
                neighbour.neighbour = true;
                if (!nodeToProcess.includes(neighbour)) {
                    nodeToProcess.push(neighbour);
                }
            }
        }
    }, document.querySelector('input').value)
}