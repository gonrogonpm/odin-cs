/**
 * Represents a 2D coordinate on the chessboard.
 */
class Coord {
    /**
     * Creates a coordinate instance from a two-element array.
     * @static
     * @param {number[]} array An array containing the x and y coordinates, e.g., [x, y].
     * @returns {Coord} A new Coord instance.
     */
    static FromArray(array) {
        if (!Array.isArray(array) || array.length < 2) {
            throw new Error("Input must be an array of at least two numbers [x, y].");
        }

        return new Coord(array[0], array[1]);
    }

    /**
     * Creates an instance of coordinate.
     * @param {number} x The x-coordinate (column).
     * @param {number} y The y-coordinate (row).
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds another coordinate to this coordinate.
     * @param {Coord} coord The coordinate to add.
     * @returns {Coord} A new coordinate with the result.
     */
    add(coord) {
        return new Coord(this.x + coord.x, this.y + coord.y);
    }

    /**
     * Checks if two coordinates are equal.
     * @param {Coord} coord The coordinate to compare with.
     * @returns {boolean} True if both coordinates are equal, false otherwise.
     */
    equals(coord) {
        return this.x === coord.x && this.y === coord.y;
    }

    toString() {
        return `[${this.x}, ${this.y}]`;
    }
}

/** @constant {number} The dimension (length/width) of the chessboard. */
const ChessboardLength = 8;

/**
 * Represents the chessboard and tracks visited squares.
 */
class Chessboard {
    /** @private @type {boolean[]} A flat array representing the board state (visited/not visited). */
    #board;

    /**
     * Creates an instance of Chessboarb and initializes all cells as not visited.
     */
    constructor() {
        this.#board = (new Array(ChessboardLength * ChessboardLength)).fill(false)
    }

    /**
     * Checks if a given coordinate is within the bounds of a chessboard.
     * @static
     * @param {Coord} coord The coordinate to check.
     * @returns {boolean} True if the coordinate is inside the board, false otherwise.
     */
    static inside(coord) {
        return coord.x >= 0 && coord.x < ChessboardLength && 
               coord.y >= 0 && coord.y < ChessboardLength;
    }

    /**
     * Checks if a cell on the board has been visited.
     * @param {Coord} coord The coordinate to check.
     * @returns {boolean} True if the square has been visited, false otherwise.
     * @throws {RangeError} If the coordinate is outside the chessboard.
     */
    isVisited(coord) {
        return this.#board[this.#getIndex(coord)];
    }

    /**
     * Marks a square on the board as visited.
     * @param {Coord} coord The coordinate to mark as visited.
     * @throws {RangeError} If the coordinate is outside the chessboard.
     */
    setVisited(coord) {
        this.#board[this.#getIndex(coord)] = true;
    }

    /**
     * Calculates the 1D array index corresponding to a 2D coordinate.
     * @private
     * @param {Coord} coord The coordinate to convert.
     * @returns {number} The calculated index in the flat board array.
     * @throws {RangeError} If the coordinate is outside the chessboard bounds.
     */
    #getIndex(coord) {
        if (!Chessboard.inside(coord)) {
            throw RangeError("coordinate is out of cheesboard");
        }

        return coord.y * ChessboardLength + coord.x;
    }
}

/**
 * @constant {Coord[]} An array containing all 8 possible L-shaped moves a knight can make, represented as coordinate offsets.
 */
const Jumps = [
    new Coord(-2,  1), new Coord(-1,  2), new Coord( 1,  2), new Coord( 2,  1),
    new Coord( 2, -1), new Coord( 1, -2), new Coord(-1, -2), new Coord(-2, -1)
];

/**
 * Calculates all valid knight moves from a given position on the chessboard.
 * A move is valid if it's one of the 8 standard knight jumps and lands within the board boundaries.
 * @param {Coord} position The starting coordinate for the moves.
 * @returns {Coord[]} An array of coordinates representing the valid landing squares.
 */
function getMovements(position) {
    return Jumps.map(jump => jump.add(position)).filter(jump => Chessboard.inside(jump));
}

/**
 * Finds the shortest sequence of moves a knight can make between two squares on a chessboard.
 * @param {number[]} origin The origin square coordinates as [x, y].
 * @param {number[]} target The target square coordinates as [x, y].
 * @returns {Coord[] | null} An array of coordinates representing the shortest path from origin to target (inclusive),
 * or null if the origin or target is invalid or no path is found (the latter is unlikely on a standard board).
 */
function knightsMove(origin, target) {
    origin = Coord.FromArray(origin);
    target = Coord.FromArray(target);

    if (!Chessboard.inside(origin)) {
        console.error("Origin coordinate is outside the board.");
        return null;
    }
    if (!Chessboard.inside(target)) {
        console.error("Target coordinate is outside the board.");
        return null;
    }
    // Utility function to create queue entries.
    function CreateEntry(coord, path) {
        return { coord, path };
    }
    // Create the chestboard and mark the origin as visited.
    const chestboard = new Chessboard();
    chestboard.setVisited(origin);
    // Initialze the queue with the orign.
    const queue  = [CreateEntry(origin, [])];
    let   result = null;
    // BFS (breadth first search) loop.
    while (queue.length > 0) {
        const { coord, path } = queue.shift();
        // Check if the target is reached.
        if (coord.equals(target)) {
            // Found! In BFS (breadth first search), the first time we reach the target, it is via a shortest path.
            // So we can exit the loop immediately, no need to search further.
            result = path.concat(coord);
            break;
        }
        // Get all valid movements from current coordinate.
        for (const movement of getMovements(coord)) {
            // Check if the movement has NOT been visited yet.
            if (!chestboard.isVisited(movement)) {
                // Mark the cell as visited before adding it to the queue. This prevent the cell to being added
                // multiple times if it is reachable from different paths at the same search depth.
                chestboard.setVisited(movement);
                // Enqueue the cell within its path.
                queue.push(CreateEntry(movement, path.concat(coord)));
            }
        }
    }

    return result;
}

function printSolution(result) {
    if (result === null || result.length === 0) {
        console.log('Solution not found!');
        return;
    }

    console.log(`Solucion for going from ${result[0]} to ${result[result.length - 1]}.`);
    console.log(`You made it in ${result.length - 1} moves! Here's your path:`);
    console.log(result.join(' -> '));
}

printSolution(knightsMove([0, 0], [3, 3]));
console.log();
printSolution(knightsMove([3, 3], [4, 3]));
console.log();
printSolution(knightsMove([0, 0], [7, 7]));
console.log();
printSolution(knightsMove([0, 0], [1, 2]));
console.log();
printSolution(knightsMove([0, 0], [0, 0])); // Start = End
console.log();
printSolution(knightsMove([8, 0], [0, 0])); // Invalid origin example