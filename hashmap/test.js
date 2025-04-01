import { HashMap } from "./hashmap.js";
import { HashSet } from "./hashset.js";
import { assertEqual, assertTrue, assertFalse, assertThrows } from "./testing.js";

let map = null;

console.log("*********************");
console.log("* HashMap Test Suit *");
console.log("*********************");

console.log("\n--- 0. Assignment Tests ---");
map = new HashMap();
map.set('apple', 'red');
map.set('banana', 'yellow');
map.set('carrot', 'orange');
map.set('dog', 'brown');
map.set('elephant', 'gray');
map.set('frog', 'green');
map.set('grape', 'purple');
map.set('hat', 'black');
map.set('ice cream', 'white');
map.set('jacket', 'blue');
map.set('kite', 'pink');
map.set('lion', 'golden');

assertEqual(map.length, 12, "Initial map: length should be 12");
assertEqual(map.capacity, 16, "Initial map: capacity should be 16 (DefaultCapacity)");

map.set('carrot', 'light orange');
map.set('dog', 'yellow');
map.set('elephant', 'clear gray');
map.set('frog', 'dark green');

assertEqual(map.length, 12, "Modified map: length should be 12");
assertEqual(map.capacity, 16, "Modified map: capacity should be 16 (DefaultCapacity)");

map.set('moon', 'silver');

assertEqual(map.length, 13, "Grow: length should be 13");
assertEqual(map.capacity, 32, "Grow: capacity should be 32 (DefaultCapacity * 2)");

// 1. Initialization Tests
console.log("\n--- 1. Initialization Tests ---");
map = new HashMap();
assertEqual(map.length, 0, "Initialization: length should be 0");
assertEqual(map.capacity, 16, "Initialization: capacity should be 16 (DefaultCapacity)");

// 2. Basic set, get, has, length Tests
console.log("\n--- 2. Basic Tests (set, get, has, length) ---");
map.set("name", "Alice");
assertEqual(map.length, 1, "Set: length should be 1 after adding 1 element");
assertEqual(map.get("name"), "Alice", "Get: should return the correct value for an existing key");
assertTrue(map.has("name"), "Has: should return true for an existing key");
assertEqual(map.get("age"), null, "Get: should return null for a non-existent key");
assertFalse(map.has("age"), "Has: should return false for a non-existent key");

// 3. Update Test (set on existing key)
console.log("\n--- 3. Update Test ---");
map.set("name", "Bob"); // Update value
assertEqual(map.length, 1, "Update: length should not change when updating");
assertEqual(map.get("name"), "Bob", "Update: get should return the new value");

// 4. Multiple Elements Test (and possible internal collision)
console.log("\n--- 4. Multiple Elements Test ---");
map.set("city", "Madrid");
map.set("country", "Spain");
assertEqual(map.length, 3, "Multiple: length should be 3");
assertEqual(map.get("name"), "Bob", "Multiple: get 'name' still works");
assertEqual(map.get("city"), "Madrid", "Multiple: get 'city' works");
assertEqual(map.get("country"), "Spain", "Multiple: get 'country' works");

// 5. Remove Tests
console.log("\n--- 5. Remove Tests ---");
let removeResult1 = map.remove("city");
assertTrue(removeResult1, "Remove: should return true when removing an existing key");
assertEqual(map.length, 2, "Remove: length should decrease after removal");
assertFalse(map.has("city"), "Remove: has should be false for removed key");
assertEqual(map.get("city"), null, "Remove: get should be null for removed key");
let removeResult2 = map.remove("city"); // Try removing again
assertFalse(removeResult2, "Remove: should return false when trying to remove non-existent key");
assertEqual(map.length, 2, "Remove: length should not change if key does not exist");

// 6. Clear Tests
console.log("\n--- 6. Clear Tests ---");
map.set("temporary", "value");
assertEqual(map.length, 3, "Clear: Pre-clear length check");
map.clear();
assertEqual(map.length, 0, "Clear: length should be 0 after clear");
assertEqual(map.capacity, 16, "Clear: capacity should reset to default capacity (16)");
assertFalse(map.has("name"), "Clear: has should be false for previous keys");
assertFalse(map.has("country"), "Clear: has should be false for previous keys");
assertFalse(map.has("temporary"), "Clear: has should be false for previous keys");

// 7. keys, values, entries Tests
console.log("\n--- 7. keys, values, entries Tests ---");
map.set("a", 1);
map.set("b", 2);
map.set("c", 3);

let keys = map.keys().sort(); // Sort for consistent comparison
assertEqual(keys, ["a", "b", "c"], "Keys: should return an array with the correct keys");

let values = map.values().sort((a, b) => a - b); // Sort numbers
assertEqual(values, [1, 2, 3], "Values: should return an array with the correct values");

let entries = map.entries().sort((pairA, pairB) => pairA[0].localeCompare(pairB[0])); // Sort by key
assertEqual(entries, [["a", 1], ["b", 2], ["c", 3]], "Entries: should return an array with the correct [key, value] pairs");

// 8. Growth (Grow) Test
console.log("\n--- 8. Growth (Grow) Test ---");
map.clear(); // Start clean
let initialCapacity = map.capacity; // 16
let threshold = Math.floor(initialCapacity * 0.75); // 12

// Add elements up to the threshold (should not grow yet)
for (let i = 0; i < threshold; i++) {
    map.set(`key${i}`, i);
}
assertEqual(map.length, threshold, `Grow: length should be ${threshold} just before threshold`);
assertEqual(map.capacity, initialCapacity, `Grow: capacity should not change before threshold`);

// Add one more element to exceed the threshold
map.set(`key${threshold}`, threshold);
assertEqual(map.length, threshold + 1, `Grow: length should be ${threshold + 1} after exceeding threshold`);
assertEqual(map.capacity, initialCapacity * 2, `Grow: capacity should double after exceeding threshold`);

// Verify all elements still exist after growth
assertTrue(map.has("key0"), "Grow: element 'key0' should exist after grow");
assertEqual(map.get("key5"), 5, "Grow: element 'key5' should have correct value after grow");
assertTrue(map.has(`key${threshold}`), `Grow: last added element ('key${threshold}') should exist`);

// 9. Invalid Key Type Tests (Should throw)
console.log("\n--- 9. Invalid Key Type Tests ---");
assertThrows(() => map.set(123, "value"), TypeError, "Set: should throw TypeError if key is not a string");
assertThrows(() => map.get(123), TypeError, "Get: should throw TypeError if key is not a string");
assertThrows(() => map.has(false), TypeError, "Has: should throw TypeError if key is not a string");
assertThrows(() => map.remove(null), TypeError, "Remove: should throw TypeError if key is not a string");

// 10. Tests with null and undefined values
console.log("\n--- 10. Tests with null/undefined Values ---");
map.set("keyNull", null);
assertEqual(map.get("keyNull"), null, "Value: get should return null if stored value is null");
assertTrue(map.has("keyNull"), "Value: has should be true if value is null");

map.set("keyUndefined", undefined);
assertEqual(map.get("keyUndefined"), null, "Value: get should return null if stored value is undefined (due to ?? null)");
assertTrue(map.has("keyUndefined"), "Value: has should be true if value is undefined");

console.log();
console.log("*********************");
console.log("* HashSet Test Suit *");
console.log("*********************");

// 1. Initialization Tests
console.log("\n--- 1. Initialization Tests ---");
let set = new HashSet();
assertEqual(set.length, 0, "Initialization: length should be 0");
assertEqual(set.capacity, 16, "Initialization: capacity should be 16 (DefaultCapacity)");

// 2. Basic add, has, length Tests
console.log("\n--- 2. Basic Tests (add, has, length) ---");
set.add("apple");
assertEqual(set.length, 1, "Add: length should be 1 after adding 1 element");
assertTrue(set.has("apple"), "Has: should return true for an existing key");
assertFalse(set.has("banana"), "Has: should return false for a non-existent key");

// 3. Add Duplicate Test
console.log("\n--- 3. Add Duplicate Test ---");
set.add("apple"); // Add duplicate
assertEqual(set.length, 1, "Add Duplicate: length should not change when adding duplicate");
assertTrue(set.has("apple"), "Add Duplicate: has should still be true for the key");

// 4. Multiple Elements Test
console.log("\n--- 4. Multiple Elements Test ---");
set.add("banana");
set.add("cherry");
assertEqual(set.length, 3, "Multiple: length should be 3");
assertTrue(set.has("apple"), "Multiple: has 'apple' still works");
assertTrue(set.has("banana"), "Multiple: has 'banana' works");
assertTrue(set.has("cherry"), "Multiple: has 'cherry' works");

// 5. Remove Tests
console.log("\n--- 5. Remove Tests ---");
let setRemoveResult1 = set.remove("banana");
assertTrue(setRemoveResult1, "Remove: should return true when removing an existing key");
assertEqual(set.length, 2, "Remove: length should decrease after removal");
assertFalse(set.has("banana"), "Remove: has should be false for removed key");

let setRemoveResult2 = set.remove("banana"); // Try removing again
assertFalse(setRemoveResult2, "Remove: should return false when trying to remove non-existent key");
assertEqual(set.length, 2, "Remove: length should not change if key does not exist");

// 6. Clear Tests
console.log("\n--- 6. Clear Tests ---");
set.add("date");
assertEqual(set.length, 3, "Clear: Pre-clear length check");
set.clear();
assertEqual(set.length, 0, "Clear: length should be 0 after clear");
assertEqual(set.capacity, 16, "Clear: capacity should reset to 16");
assertFalse(set.has("apple"), "Clear: has should be false for previous keys");
assertFalse(set.has("cherry"), "Clear: has should be false for previous keys");
assertFalse(set.has("date"), "Clear: has should be false for previous keys");

// 7. keys, values, entries Tests
console.log("\n--- 7. keys, values, entries Tests ---");
set.add("fig");
set.add("grape");
set.add("honeydew");

let setKeys = set.keys().sort(); // Sort for consistent comparison
assertEqual(setKeys, ["fig", "grape", "honeydew"], "Keys: should return an array with the correct keys");

let setValues = set.values().sort(); // Sort for consistent comparison
assertEqual(setValues, ["fig", "grape", "honeydew"], "Values: should return an array with the correct values (same as keys)");

let setEntries = set.entries().sort((pairA, pairB) => pairA[0].localeCompare(pairB[0])); // Sort by the key (first element)
assertEqual(setEntries, [["fig", "fig"], ["grape", "grape"], ["honeydew", "honeydew"]], "Entries: should return an array with the correct [key, key] pairs");

// 8. Growth (Grow) Test
console.log("\n--- 8. Growth (Grow) Test ---");
set.clear(); // Start clean
let setInitialCapacity = set.capacity; // 16
let setThreshold = Math.floor(setInitialCapacity * 0.75); // 12

// Add elements up to the threshold (should not grow yet)
for (let i = 0; i < setThreshold; i++) {
    set.add(`item${i}`);
}
assertEqual(set.length, setThreshold, `Grow: length should be ${setThreshold} just before threshold`);
assertEqual(set.capacity, setInitialCapacity, `Grow: capacity should not change before threshold`);

// Add one more element to exceed the threshold
set.add(`item${setThreshold}`);
assertEqual(set.length, setThreshold + 1, `Grow: length should be ${setThreshold + 1} after exceeding threshold`);
assertEqual(set.capacity, initialCapacity * 2, `Grow: capacity should double after exceeding threshold`);

// Verify all elements still exist after growth
assertTrue(set.has("item0"), "Grow: element 'item0' should exist after grow");
assertTrue(set.has("item5"), "Grow: element 'item5' should exist after grow");
assertTrue(set.has(`item${setThreshold}`), `Grow: last added element ('item${setThreshold}') should exist`);

// 9. Invalid Key Type Tests (Should throw)
console.log("\n--- 9. Invalid Key Type Tests ---");
assertThrows(() => set.add(123), TypeError, "Add: should throw TypeError if key is not a string");
assertThrows(() => set.has(false), TypeError, "Has: should throw TypeError if key is not a string");
assertThrows(() => set.remove(null), TypeError, "Remove: should throw TypeError if key is not a string");