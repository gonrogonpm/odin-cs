class Node {
    constructor(value = null) {
        this.next  = null;
        this.value = value;
    }
}

export class LinkedList {
    #head = null;
    #tail = null;

    get empty() {
        return this.#head === null;
    }

    get size() {
        let count = 0;
        for (let cur = this.#head; cur !== null; cur = cur.next) {
            count++;
        }

        return count;
    }

    get head() {
        return this.#head?.value;
    }

    get tail() {
        return this.#tail?.value;
    }

    constructor() {
    }

    append(value) {
        const node = new Node(value);

        if (this.empty) {
            this.#head = node;
            this.#tail = node;
            return;
        }

        this.#tail.next = node;
        this.#tail      = node;
    }

    prepend(value) {
        const node = new Node(value);

        if (this.empty) {
            this.#head = node;
            this.#tail = node;
            return;
        }

        node .next = this.#head;
        this.#head = node;
    }

    at(index) {
        let count = 0;
        for (let cur = this.#head; cur != null; cur = cur.next) {
            if (count == index) {
                return cur.value;
            }

            count++;
        }

        return undefined;
    }

    pop() {
        if (this.empty) {
            return;
        }

        if (this.#head === this.#tail) {
            this.#head = null;
            this.#tail = null;
            return;
        }

        let pre = null;
        let cur = this.#head;

        while (cur.next != null) {
            pre = cur;
            cur = cur.next;
        }

        pre.next = null;
        this.#tail = pre;
    }

    contains(value) {
        for (let cur = this.#head; cur != null; cur = cur.next) {
            if (cur.value === value) {
                return true;
            }
        }

        return false;
    }

    find(value) {
        let index = 0;
        for (let cur = this.#head; cur != null; cur = cur.next) {
            if (cur.value === value) {
                return index;
            }

            index++;
        }

        return null;
    }

    toString() {
        let str = '';
        for (let cur = this.#head; cur != null; cur = cur.next) {
            if (str.length > 0) {
                str += ' -> ';
            }

            str += `( ${cur.value } )`;
        }

        if (str.length > 0) {
            str += ' -> null';
        }
        else {
            str += 'null';
        }

        return str;
    }
}

// example uses class syntax - adjust as necessary
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