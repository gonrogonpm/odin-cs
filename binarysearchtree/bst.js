/**
 * Represents a single node in a Binary Search Tree.
 * @class Node
 */
class Node {
    /**
     * The data value stored in the node.
     * @type {*}
     */
    value = null;

    /**
     * Reference to the left child node.
     * @type {?Node}
     */
    left  = null;

    /**
     * Reference to the right child node.
     * @type {?Node}
     */
    right = null;

    /**
     * Creates an instance of a Node.
     * @param {*} value The data to store in the node.
     * @constructor
     */
    constructor(value) {
        this.value = value;
    }

    toString() {
        return this.value.toString();
    }
}

/**
 * Represents a Binary Search Tree (BST).
 * Provides methods for building, manipulating, and traversing the tree.
 * @class Tree
 */
export class Tree {
    /**
     * The root node of the tree.
     * @private
     * @type {?Node}
     */
    #root = null;

    /**
     * Gets the root node of the tree.
     * @returns {?Node} The root node, or null if the tree is empty.
     * @readonly
     */
    get root() {
        return this.#root;
    }

    /**
     * Creates an instance of a Tree.
     * If an array is provided, it builds a balanced BST from the array elements.
     * @param {?Array<*>} [array=null] An optional array of values to initialize the tree with.
     * Duplicates will be removed and the array sorted before building.
     * @constructor
     */
    constructor(array) {
        if (array != null) {
            this.#root = Tree.buildTree(array);
        }
    }

    /**
     * Inserts one or more values into the BST.
     * If a single value is provided, it's inserted.
     * If an array is provided, each element is inserted individually.
     * If multiple arguments are provided, they are treated as an array.
     * Does nothing if the value already exists in the tree.
     * Note: Insertion might unbalance the tree.
     * @param {*} value The value or array of values to insert.
     * @returns {void}
     */
    insert(value) {
        if (arguments.length > 1) {
            this.insert(Array.from(arguments));
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(element => {
                this.insert(element);
            });
            return;
        }

        if (this.#root == null) {
            this.#root = new Node(value);
        }

        let parent = null;
        let cur    = this.#root;
        // Find a leaf node where to insert the new value.
        while (cur != null) {
            // Value already exists, do nothing.
            if (Tree.compare(cur.value, value) == 0) {
                return;
            }
            parent = cur;
            cur    = Tree.compare(cur.value, value) > 0 ? cur.left : cur.right;
        }
        // Attach the new node to the correct parent's child (left or right). A parent node is guaranteed unless
        // the tree was initially empty (handled above).
        if (Tree.compare(parent.value, value) > 0) {
            parent.left  = new Node(value);
        } else {
            parent.right = new Node(value);
        }
    }

    /**
     * Removes a node with the given value from the BST.
     * Does nothing if the value is not found in the tree.
     * Note: Deletion might unbalance the tree.
     * @param {*} value The value to remove.
     */
    remove(value) {
        if (this.#root === null) {
            return;
        }

        let parent = null;
        let cur    = this.#root;
        // Find the node to remove and its parent
        while (cur != null) {
            if (Tree.compare(cur.value, value) == 0) {
                break;
            }

            parent = cur;
            cur    = Tree.compare(cur.value, value) > 0 ? cur.left : cur.right;
        }
        // Value not present in the tree.
        if (cur === null) {
            return;
        }
        // Node has 0 or 1 child.
        if (cur.left === null || cur.right === null) {
            const swap = cur.left ?? cur.right; // Get the child to replace current node or null.

            if (parent === null) {
                this.#root = swap;
            }
            else {
                if (parent.left === cur) {
                    parent.left  = swap; 
                }
                else {
                    parent.right = swap;
                }
            }
        }
        // Node has 2 children.
        else {
            // Find the in-order successor (minimum value in the right subtree).
            let minParent = cur;
            let min       = cur.right;
            while (min.left != null) {
                minParent = min;
                min       = min.left;
            }
            // Replace the current node's value with the successor's value.
            cur.value = min.value;
            // Remove the successor node (which has at most one right child).
            if (minParent.left === min) {
                minParent.left  = min.right;
            } else {
                minParent.right = min.right;
            }
        }
    }

    /**
     * Alias for the remove method.
     * Removes a node with the given value from the BST.
     * @param {*} value The value to remove.
     * @see {@link Tree#remove}
     */
    deleteItem(value) {
        this.remove(value);
    }

    /**
     * Finds and returns the node containing the given value.
     * @param {*} value The value to search for.
     * @returns {?Node} The node containing the value, or null if not found.
     */
    find(value) {
        for (let cur = this.#root; cur != null;) {
            if (cur.value == value) {
                return cur;
            }

            cur = Tree.compare(cur.value, value) > 0 ? cur.left : cur.right;
        }

        return null;
    }

    /**
     * Traverses the tree in level order (Breadth-First Search) and executes a callback for each node.
     * @param {(node: Node) => void} callback The function to execute for each node. It receives the node as an argument.
     * @throws {TypeError} If the callback is not a function.
     */
    levelOrder(callback) {
        if (callback == null || typeof callback !== 'function') {
            throw TypeError("callback must be a function");
        }

        if (this.#root === null) {
            return;
        }

        const queue = [this.#root];
        while (queue.length > 0) {
            const cur = queue.shift();

            if (cur.left  != null) { queue.push(cur.left) };
            if (cur.right != null) { queue.push(cur.right) };

            callback(cur);
        }
    }

    /**
     * Performs an in-order traversal (Left, Root, Right) of the tree using an iterative approach.
     * Executes the provided callback function for each node visited.
     * @param {(node: Node) => void} callback The function to execute for each node. It receives the node as an argument.
     * @throws {TypeError} If the callback is not a function.
     */
    inOrder(callback) {
        // Stack order to achieve In-Order: Push Right, Push Callback, Push Left.
        this.#traverseDepthFirst(['R', 'C', 'L'], callback);
    }

    /**
     * Performs a pre-order traversal (Root, Left, Right) of the tree using an iterative approach.
     * Executes the provided callback function for each node visited.
     * @param {(node: Node) => void} callback The function to execute for each node. It receives the node as an argument.
     * @throws {TypeError} If the callback is not a function.
     */
    preOrder(callback) { 
        // Stack order to achieve Pre-Order: Push Right, Push Left, Push Callback.
        this.#traverseDepthFirst(['R', 'L', 'C'], callback);
    }

    /**
     * Performs a post-order traversal (Left, Right, Root) of the tree using an iterative approach.
     * Executes the provided callback function for each node visited.
     * @param {(node: Node) => void} callback The function to execute for each node. It receives the node as an argument.
     * @throws {TypeError} If the callback is not a function.
     */
    postOrder(callback) { 
        // Stack order to achieve Post-Order: Push Callback, Push Right, Push Left.
        this.#traverseDepthFirst(['C', 'R', 'L'], callback);
    }

    /**
     * Performs an iterative depth-first traversal based on the specified stack push order.
     * This is a private helper method used by inOrder, preOrder, and postOrder.
     * The stack stores either Nodes to visit or [Node, callback] pairs to execute.
     * @private
     * @param {Array<'L'|'C'|'R'>} stackPushOrder Defines the order to push Left child ('L'), Callback action ('C'),
     * and Right child ('R') onto the stack for processing.
     * @param {(node: Node) => void} callback The function to execute when the 'C' action is processed.
     * @throws {TypeError} If the callback is not a function.
     */
    #traverseDepthFirst(stackPushOrder, callback) {
        if (callback == null || typeof callback !== 'function') {
            throw TypeError("callback must be a function");
        }

        if (this.#root === null) {
            return;
        }

        const stack = [this.#root];

        while (stack.length > 0) {
            const cur = stack.pop();
            // If it's an array, it's [node, callback] -> execute callback
            if (Array.isArray(cur)) {
                cur[1](cur[0]);
                continue;
            }
            // If it's a Node, push children and callback action based on stackPushOrder.
            // Note: Pushing order is reverse of processing order due to LIFO stack.
            stackPushOrder.forEach(letter => {
                switch (letter) {
                    case 'L': { if (cur.left  !== null) { stack.push(cur.left);  } } break;
                    case 'C': { stack.push([cur, callback]); } break;
                    case 'R': { if (cur.right !== null) { stack.push(cur.right); } } break;
                }
            });
        }
    }

    /**
     * Calculates the height of a given node.
     * Height is the number of edges in the longest path from the node to a leaf node.
     * If a value is provided instead of a Node object, it uses the value for searching.
     * @param {Node|*} nodeOrValue The node or the value of the node for which to calculate the height.
     * @returns {number} The height of the node (a leaf node has height 0).
     * @throws {Error} If the value is provided but not found in the tree.
     */
    height(nodeOrValue) {
        let node = nodeOrValue;
        // If input is not a Node instance, try to find it by value.
        if (!(node instanceof Node)) {
            node = this.find(nodeOrValue);
            if (node == null) {
                throw Error('unable to calculate height, value not found');
            }
        }
        // Use BFS (level order) to find the maximum depth relative to the starting node.
        let maxHeight = 0;
        const queue = [[0, node]];

        while (queue.length > 0) {
            const [height, cur] = queue.shift();
            maxHeight = Math.max(maxHeight, height);
            // If children exist, add them to the queue with incremented height.
            if (cur.left  != null) { queue.push([height + 1, cur.left])  };
            if (cur.right != null) { queue.push([height + 1, cur.right]) };
        }

        return maxHeight;
    }

    /**
     * Calculates the depth of a given node.
     * Depth is the number of edges in the path from the tree's root node to the given node.
     * If a value is provided instead of a Node object, it uses the value for searching.
     * @param {Node|*} nodeOrValue The node or the value of the node for which to calculate the depth.
     * @returns {number} The depth of the node (the root node has depth 0).
     * @throws {Error} If the value is not found in the tree.
     */
    depth(node) {
        // Get the value regardless of whether a Node or value was passed
        let value = node instanceof Node ? node.value : node;
        let depth = 0;

        for (let cur = this.#root; cur != null;) {
            if (cur.value == value) {
                return depth;
            }

            cur = Tree.compare(cur.value, value) > 0 ? cur.left : cur.right;
            depth++;
        }
        // If loop finishes without finding, the value wasn't in the tree.
        throw Error('unable to calculate depth, value not found');
    }

    /**
     * Checks if the tree is balanced.
     * A balanced tree is one where the difference between the heights of the left and right subtrees
     * of every node is not more than 1.
     * @param {iterative} True to use the iterative version of the isBalance algorithm; false (default) to use the
     * recursive version.
     * @returns {boolean} True if the tree is balanced, false otherwise.
     */
    isBalanced(iterative = false) {
        if (iterative) {
            return this.#isNodeBalancedIterative(this.root) >= 0;    
        }
        return this.#isNodeBalanced(this.#root) >= 0;
    }

    /**
     * Recursive helper function to check if a subtree rooted at `node` is balanced and calculate its height
     * simultaneously.
     * @private
     * @param {?Node} node The root of the subtree to check.
     * @returns {number} The height of the node if the subtree is balanced, or -1 if unbalanced.
     */
    #isNodeBalanced(node) {
        // Base case: An empty tree (null node) is balanced and has height 0.
        if (node === null) {
            return 0;
        }
        // Recursively get height/balanced status of left subtree.
        const lh = node.left  === null ? 0 : this.#isNodeBalanced(node.left);
        // If the left subtree is unbalanced, propagate the status.
        if (lh < 0) {
            return -1;
        }
        // Recursively get height/balanced status of right subtree
        const rh = node.right === null ? 0 : this.#isNodeBalanced(node.right);
        // If the right subtree is unbalanced, propagate the status.
        if (rh < 0) {
            return -1;
        }
        // Check if the current node is unbalanced.
        if (Math.abs(lh - rh) > 1) {
            return -1;
        }
        // If balanced, return the height of this subtree, the maximum height between left and right subtrees 
        // plus 1 for the current node.
        return Math.max(lh, rh) + 1;
    }

    /**
     * Iterative helper function to check if a subtree rooted at `node` is balanced.
     * NOTE: This method is implemented but currently NOT USED by the public `isBalanced` method.
     * It's more complex than the recursive version.
     * @private
     * @param {?Node} node The root node of the subtree to check.
     * @returns {number} The height of the node if the subtree is balanced, or -1 if unbalanced.
     */
    #isNodeBalancedIterative(node) {
        if (node === null) {
            return 0;
        }
        // Helper to create state objects for the stack.
        const CreateNodeData = function(node, visited, parentIndex) {
            return { 
                node, visited, parentIndex, leftHeight: 0, rightHeight: 0
            }
        }

        const stack = [CreateNodeData(node, false, -1)];
        let result = 0; // Stores the final height if balanced

        while (stack.length > 0) {
            const cur = stack.pop();

            if (cur.visited) {
                // Check balance at the current node.
                if (Math.abs(cur.leftHeight - cur.rightHeight) > 1) {
                    return -1;
                }
                // The height of child nodes is the maximum height between left and right subtrees plus 1 
                // if the current node is not a leaf node; otherwise, 0.
                let height = 0;
                if (cur.node.left !== null || cur.node.right !== null) {
                    height = Math.max(cur.leftHeight, cur.rightHeight) + 1;
                }
                // Propagate the result to the parent node data.
                if (cur.parentIndex >= 0) {
                    if (stack[cur.parentIndex].node.left == cur.node) { 
                        stack[cur.parentIndex].leftHeight  = height;
                    }
                    else {
                        stack[cur.parentIndex].rightHeight = height;
                    }
                }
                // No parent node so the current node was the root, store final height.
                else {
                    result = height;
                }
            }
            else {
                // First time visiting this node, mark as visited and push children (if any).
                cur.visited = true;
                const index = stack.length; // Index of the current node data (parent for children).
                
                stack.push(cur);
                // Push children onto stack for processing (right then left, so left is processed first)
                if (cur.node.right !== null) { stack.push(CreateNodeData(cur.node.right, false, index)); }
                if (cur.node.left  !== null) { stack.push(CreateNodeData(cur.node.left,  false, index)); }
            }
        }
        // If loop completes without returning -1, the tree is balanced so its height is returned.
        return result;
    }

    /**
     * Rebalances the current tree if it has become unbalanced.
     * It extracts all values in sorted order and rebuilds the tree into a balanced BST.
     */
    rebalance() {
        const values = [];
        this.inOrder(node => {
            values.push(node.value);
        })

        this.#root = Tree.buildTree(values);
    }

    /**
     * Builds a balanced Binary Search Tree from an array of values.
     * The method first sorts the array and removes duplicate values.
     * Then, it constructs the tree recursively (conceptually, implemented iteratively here) by repeatedly finding
     * the middle element to serve as the root of a subtree.
     * @static
     * @param {Array<*>} array The input array of data. Can contain duplicates and be unsorted.
     * @returns {?Node} The root node of the newly built balanced BST, or null if the input array is effectively
     * empty after filtering.
     * @throws {TypeError} If the input is not an array or if elements have different types or unsupported types
     * for comparison.
     */
    static buildTree(array) {
        if (!Array.isArray(array)) {
            throw TypeError('input must be an array');
        }
        // Handle empty array.
        if (array.length == 0) {
            return null;
        }
        // Sort and remove duplicates.
        array = array.sort((a, b) => Tree.compare(a, b)).filter((value, index, self) => {
            return index === 0 || self[index - 1] !== value;
        });
        // Create an object with the information about a step (parentNode,
        // directionToAttach ('left'/'right'/'root'), startIndex, endIndex).
        const CreateStep = function(parent, direction, start, end) {
            return { 
                parent, direction, start, end
            }
        }

        let root  = null;
        let stack = [CreateStep(null, 'root', 0, array.length - 1)];

        while (stack.length != 0) {
            const { parent, direction, start, end } = stack.pop();
            // Calculate the index of the middle and creates a new node for it.
            const middle = start + Math.trunc((end - start) / 2);
            const node   = new Node(array[middle]);
            // Attach the new node to its parent or set as root.
            if (parent == null) {
                root = node;
            }
            else {
                parent[direction] = node;
            }
            // Push subproblems (left and right subarrays) onto the stack if they exist.
            if (middle > start) { stack.push(CreateStep(node, 'left', start, middle - 1)); }
            if (middle < end)   { stack.push(CreateStep(node, 'right', middle + 1, end)); }
        }

        return root;
    }

    /**
     * Compares two values (supports numbers and strings).
     * Used for ordering nodes in the BST.
     * @static
     * @param {*} a The first value.
     * @param {*} b The second value.
     * @returns {number} Returns a negative number if a < b, zero if a === b, or a positive number if a > b.
     * @throws {TypeError} If the values have different types or are of an unsupported type.
     */
    static compare(a, b) {
        if (typeof a !== typeof b) {
            throw TypeError('unable to compare, elements have different types');
        }

        switch (typeof a) {
            case 'number': return a - b;
            case 'string': return a.localeCompare(b);
            default: {
                throw TypeError(`unable to compare, invalid type "${typeof a}"`);
            }
        }
    }

    /**
     * Utility function to print the tree structure to the console in a readable format.
     * @static
     * @param {Node|Tree} node The starting node (usually the root) or the Tree instance itself.
     * @param {string} [prefix=''] Internal use for formatting lines.
     * @param {boolean} [isLeft=true] Internal use for determining connector type.
     * @returns {void}
     */
    static prettyPrint(node, prefix = '', left = true) {
        if (node === null) {
            return;
        }

        if (node instanceof Tree) {
            this.prettyPrint(node.#root);
            return;
        }

        if (node.right !== null) {
            Tree.prettyPrint(node.right, `${prefix}${left ? '|   ' : '    '}`, false);
        }
        
        console.log(`${prefix}${left ? '└── ' : '┌── '}${node.value}`);

        if (node.left !== null) {
            Tree.prettyPrint(node.left,  `${prefix}${left ? '    ' : '|   '}`, true);
        }
    }
}