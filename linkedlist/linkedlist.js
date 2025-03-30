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

    insertAt(value, index) {
        if (index < 0) {
            throw RangeError('Index out of bounds');
        }

        if (index === 0) {
            this.prepend(value);
            return;
        }

        let cur = null;
        let count = 0;

        for (cur = this.#head; cur != null; cur = cur.next) {
            if (count === index - 1) {
                break;
            }

            count++;
        }

        if (cur === null) {
            throw RangeError('Index out of bounds');
        }

        const node = new Node(value);
        node.next = cur.next;
        cur .next = node;
        // Check if the item is the new tail.
        if (this.#tail === cur) {
            this.#tail = node;
        }
    }

    removeAt(index) {
        if (index < 0) {
            throw RangeError('Index out of bounds');
        }

        if (index == 0) {
            this.#head = this.#head.next;
            return;
        }

        let cur = null;
        let count = 0;

        for (cur = this.#head; cur != null; cur = cur.next) {
            if (count === index - 1) {
                break;
            }

            count++;
        }

        if (cur.next === null) {
            throw RangeError('Index out of bounds');
        }

        if (this.#tail === cur.next) {
            this.#tail = cur;
        }

        cur.next = cur.next?.next;
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