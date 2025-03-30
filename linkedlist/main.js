import { LinkedList } from "./linkedlist.js";

const list = new LinkedList();

list.append("dog");
list.append("cat");
list.append("parrot");
list.append("hamster");
list.append("snake");
list.append("turtle");

console.log(`empty: ${list.empty}`);
console.log(`size: ${list.size}`);
console.log(`head: ${list.head}`);
console.log(`tail: ${list.tail}`);
console.log(`list: ${list.toString()}`);

console.log('\n--- POP ONE ---\n');
list.pop();

console.log(`tail: ${list.tail}`);
console.log(`list: ${list.toString()}`);
console.log(`find: ${list.find('parrot')} - ${list.at(list.find('parrot'))}`);
console.log(`find: ${list.find('dog')} - ${list.at(list.find('dog'))}`);
console.log(`find: ${list.find('turtle')}`);

console.log('\n--- POP ALL ---\n');
list.pop();
list.pop();
list.pop();
list.pop();
list.pop();

console.log(`empty: ${list.empty}`);
console.log(`size: ${list.size}`);
console.log(`head: ${list.head}`);
console.log(`tail: ${list.tail}`);
console.log(`list: ${list.toString()}`);

console.log('\n--- INSERT AT INDEX 2 ---\n');

list.append("dog");
list.append("cat");
list.append("parrot");
list.append("hamster");
list.append("snake");
list.append("turtle");

console.log(`list: ${list.toString()}`);
list.insertAt('elephant', 2);
console.log(`list: ${list.toString()}`);

console.log('\n--- INSERT AT BEGINNING ---\n');

console.log(`list: ${list.toString()}`);
list.insertAt('mouse', 0);
console.log(`list: ${list.toString()}`);

console.log('\n--- INSERT AT END ---\n');

console.log(`list: ${list.toString()}`);
list.insertAt('bat', list.size);
console.log(`list: ${list.toString()}`);
console.log(`tail: ${list.tail}`);

console.log('\n--- INSERT AT OUT OF BOUNDS ---\n');

try {
    list.insertAt('bat', -1);
}
catch (error) {
    console.log(`error: ${error}`);
}

try {
    list.insertAt('bat', list.size + 1);
}
catch (error) {
    console.log(`error: ${error}`);
}

console.log('\n--- REMOVE AT INDEX 2 ---\n');

console.log(`list: ${list.toString()}`);
list.removeAt(2);
console.log(`list: ${list.toString()}`);

console.log('\n--- REMOVE AT BEGINNING ---\n');

console.log(`list: ${list.toString()}`);
list.removeAt(0);
console.log(`list: ${list.toString()}`);

console.log('\n--- REMOVE AT END ---\n');

console.log(`list: ${list.toString()}`);
list.removeAt(list.size - 1);
console.log(`list: ${list.toString()}`);
console.log(`tail: ${list.tail}`);

console.log('\n--- REMOVE AT OUT OF BOUNDS ---\n');

try {
    list.removeAt(-1);
}
catch (error) {
    console.log(`error: ${error}`);
}

try {
    list.removeAt(list.size);
}
catch (error) {
    console.log(`error: ${error}`);
}