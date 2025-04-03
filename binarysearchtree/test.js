import { Tree } from './bst.js';
import { assertEqual, assertTrue, assertFalse, assertNull, assertNotNull, assertThrows } from './testing.js';

function getRandomNumbers(amount, min = 0, max = 1000) {
    const array = [];

    for (let i = 0; i < amount; i++) {
        const number = Math.floor(min + Math.random() * (max - min));
        array.push(number);
    }

    return array;
}

let tree;
let nums;
const sampleArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

console.log('********************************');
console.log('* Binary Search Tree Test Suit *');
console.log('********************************');

console.log('\n--- 0. Assignment Tests ---');
tree = new Tree(getRandomNumbers(30));
assertTrue(tree.isBalanced(), 'Initial tree should be balanced');
nums = [];
tree.levelOrder(node => nums.push(node.value));
console.log(`level-order: [${nums.join(', ')}]`);
nums = [];
tree.preOrder(node => nums.push(node.value));
console.log(`pre-order:   [${nums.join(', ')}]`);
nums = [];
tree.postOrder(node => nums.push(node.value));
console.log(`post-order:  [${nums.join(', ')}]`);
nums = [];
tree.inOrder(node => nums.push(node.value));
console.log(`in-order:    [${nums.join(', ')}]`);
tree.insert(getRandomNumbers(30));
assertFalse(tree.isBalanced(), 'Tree should be unbalanced after inserting new values');
tree.rebalance();
assertTrue(tree.isBalanced(), 'Tree should be balanced after a rebalance');
nums = [];
tree.levelOrder(node => nums.push(node.value));
console.log(`level-order: [${nums.join(', ')}]`);
nums = [];
tree.preOrder(node => nums.push(node.value));
console.log(`pre-order:   [${nums.join(', ')}]`);
nums = [];
tree.postOrder(node => nums.push(node.value));
console.log(`post-order:  [${nums.join(', ')}]`);
nums = [];
tree.inOrder(node => nums.push(node.value));
console.log(`in-order:    [${nums.join(', ')}]`);

// 3. Find Tests
console.log("\n--- 1. Find Tests ---");
tree = new Tree(sampleArray); // Use the initial complex tree
let foundNode = tree.find(8); // Find root
assertNotNull(foundNode, "Find: Root node should be found");

foundNode = tree.find(67); // Find internal node
assertNotNull(foundNode, "Find: Internal node (67) should be found");
assertEqual(foundNode.value, 67, "Find: Found internal node value check");

foundNode = tree.find(999); // Find non-existent node
assertNull(foundNode, "Find: Non-existent node should return null");

let emptyTree = new Tree();
assertNull(emptyTree.find(10), "Find: Should return null in empty tree");

// 4. Delete Tests
console.log("\n--- 2. Delete Tests ---");
tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
// Tree is:   4
//          /   \
//         2     6
//        / \   / \
//       1   3 5   7
console.log("Initial Tree for Delete Tests:");
Tree.prettyPrint(tree);

// Case 1: Delete Leaf (e.g., 1)
tree.deleteItem(1);
console.log("After Deleting Leaf (1):");
Tree.prettyPrint(tree);
assertNull(tree.find(1), "Delete Leaf: Node 1 should not be found");
assertNotNull(tree.find(2), "Delete Leaf: Neighbour node 2 should still exist");

// Case 2: Delete Node with One Child (e.g., 6 which has 5 and 7. Let's delete 7 first, then 6)
tree.deleteItem(7);
console.log("After Deleting Leaf (7):");
Tree.prettyPrint(tree);
assertNull(tree.find(7), "Delete One Child Prep: Node 7 should not be found");
assertEqual(tree.root.right.right, null, "Delete One Child Prep: Node 6's right child is null");
assertNotNull(tree.root.right.left, "Delete One Child Prep: Node 6's left child (5) still exists");
tree.deleteItem(6); // Node 6 now has only left 
console.log("After Deleting Node with One Child (6):");
Tree.prettyPrint(tree);
assertNull(tree.find(6), "Delete One Child: Node 6 should not be found");
assertEqual(tree.root.right.value, 5, "Delete One Child: Root's right child should now be 5");
assertNull(tree.root.right.left, "Delete One Child: Node 5 should have no left child");
assertNull(tree.root.right.right, "Delete One Child: Node 5 should have no right child");

// Case 3: Delete Node with Two Children (e.g., Root 4)
tree.deleteItem(4);
console.log("After Deleting Node with Two Children (Root 4):");
Tree.prettyPrint(tree);
assertNull(tree.find(4), "Delete Two Children: Node 4 should not be found");
assertEqual(tree.root.value, 5, "Delete Two Children: Root value should be successor (5)");
assertEqual(tree.root.left.value, 2, "Delete Two Children: Root's left child (2) should remain");
assertNull(tree.root.right, "Delete Two Children: Root's right child should be null (original successor's right)");
assertNotNull(tree.find(2), "Delete Two Children: find(2) still works");
assertNotNull(tree.find(3), "Delete Two Children: find(3) still works");
tree.deleteItem(999); // Delete non-existent
console.log("After Deleting Non-existent (999) - Should be unchanged:");
Tree.prettyPrint(tree); // Should be same as previous print
assertEqual(tree.root.value, 5, "Delete Non-existent: Root value still 5");

// 6. Height & Depth Tests
console.log("\n--- 3. Height & Depth Tests ---");
tree = new Tree([1, 2, 3, 4, 5, 6, 7]);
// Tree is:   4
//          /   \
//         2     6
//        / \   / \
//       1   3 5   7
assertEqual(tree.height(tree.root), 2, "Height: Height of root node (4)");
assertEqual(tree.height(tree.find(6)), 1, "Height: Height of internal node (6)");
assertEqual(tree.height(tree.find(7)), 0, "Height: Height of leaf node (7)");
assertEqual(tree.height(7), 0, "Height: Height using value lookup (leaf 7)");
assertEqual(tree.depth(tree.root), 0, "Depth: Depth of root node (4)");
assertEqual(tree.depth(tree.find(6)), 1, "Depth: Depth of node (6)");
assertEqual(tree.depth(tree.find(7)), 2, "Depth: Depth of node (7)");
assertEqual(tree.depth(1), 2, "Depth: Depth using value lookup (leaf 1)");
assertThrows(() => tree.height(99), Error, "Height: Throws error for non-existent value");
assertThrows(() => tree.depth(99), Error, "Depth: Throws error for non-existent value");
emptyTree = new Tree();
assertThrows(() => emptyTree.height(1), Error, "Height: Throws error on empty tree");
assertThrows(() => emptyTree.depth(1), Error, "Depth: Throws error on empty tree");

// 8. Edge Case Tests
console.log("\n--- 4. Edge Case Tests ---");
tree = new Tree([5]); // Single node tree
assertEqual(tree.root.value, 5, "Edge Case: Single node tree root value");
assertNull(tree.root.left, "Edge Case: Single node tree left is null");
assertNull(tree.root.right, "Edge Case: Single node tree right is null");
assertTrue(tree.isBalanced(), "Edge Case: Single node tree is balanced");
assertEqual(tree.height(5), 0, "Edge Case: Single node tree height is 0");
assertEqual(tree.depth(5), 0, "Edge Case: Single node tree depth is 0");
tree.deleteItem(5);
assertNull(tree.root, "Edge Case: Deleting single node makes root null");
assertTrue(tree.isBalanced(), "Edge Case: Empty tree after delete is balanced");