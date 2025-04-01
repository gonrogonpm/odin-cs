import { fnv1a32 } from "./hash.js"

const DefaultLoadFactor = 0.75;
const DefaultCapaity    = 16;

class Node {
    #key   = undefined;
    #next  = null;

    constructor(key) {
        this.#key = key;
    }

    get key() {
        return this.#key;
    }

    get next() { 
        return this.#next;
    }

    is(key) {
        return this.#key === key;
    }

    setNext(next) {
        this.#next = next;
    }
}

export class HashSet {
    /** Load factor threshold for resizing. */
    #loadFactor = DefaultLoadFactor;

    /** Array of linked list buckets. */
    #buckets = new Array(DefaultCapaity);

    /** Number of keys stored. */
    #count = 0;

    /**
     * Gets the current total number of buckets (slots) in the hash set.
     * 
     * @returns {number} The current capacity.
     */
    get capacity() {
        return this.#buckets.length;
    }

    /**
     * Gets the number of keys currently stored in the hash set.
     * 
     * @returns {number} The number of elements (size) in the map.
     */
    get length() {
        return this.#count;
    }

    /**
     * Calculates the 32-bit FNV1a hash for a given string key.
     *
     * @param {string} key The string key to hash.
     * @returns {number} The 32-bit unsigned integer hash value.
     * @throws {TypeError} If the provided key is not a string.
     */
    hash(key) {
        if (typeof key !== 'string') {
            throw new TypeError('keys must be strings');
        }

        return fnv1a32(key);
    }

    /**
     * Checks if a key exists within the hash set.
     * 
     * @param {string} key The string key to check for.
     * @returns {boolean} `true` if the key exists, `false` otherwise.
     * @throws {TypeError} If the key is not a string.
     */
    has(key) {
        return this.#getNode(key) !== null;
    }

    /**
     * Retrieves the internal Node object associated with the key, or null if not found.
     * 
     * @param {string} key The string key to find the node for.
     * @returns {Node|null} The Node object or null.
     * @throws {TypeError} If the key is not a string.
     */
    #getNode(key) {
        const i = this.#hashIndex(key);
        // Find the key.
        for (let node = this.#buckets[i]; node != null; node = node.next) {
            if (node.is(key)) {
                return node;
            }
        }
        // Key not found.
        return null;
    }
    
    /**
     * Adds the specified key in the hash set.
     * If the key does not exist, a new entry is added.
     * Automatically triggers a resize (#grow) if the load factor is exceeded after adding.
     * 
     * @param {string} key The string key for the entry.
     * @returns {this} The HashSet instance, allowing for method chaining.
     * @throws {TypeError} If the key is not a string.
     */
    add(key) { 
        this.set(key);
    }

    /**
     * Sets the specified key in the hash set.
     * If the key does not exist, a new entry is added.
     * Automatically triggers a resize (#grow) if the load factor is exceeded after adding.
     * 
     * @param {string} key The string key for the entry.
     * @returns {this} The HashSet instance, allowing for method chaining.
     * @throws {TypeError} If the key is not a string.
     */
    set(key) {
        // Calculate the index for the key.
        const i = this.#hashIndex(key);
        // Find the key.
        let prev = null;
        let node = this.#buckets[i];
        for (; node != null; prev = node, node = node.next) {
            if (node.is(key)) {
                break;
            }
        }
        // If the key is not found, a new node is inserted.
        if (node == null) {
            // If there is no previous node, the bucket is empty.
            if (prev === null) {
                this.#buckets[i] = new Node(key);
            }
            // Otherwise, the new node is inserted at the end of the bucket's linked list.
            else {
                prev.setNext(new Node(key));
            }
            this.#count++;
        }
        // Check if the hash set need to grow to insert a new item.
        if (this.#count > this.capacity * this.#loadFactor) {
            this.#grow();
        }

        return this;
    }

    /**
     * Removes the the specified key from the hash set.
     * 
     * @param {string} key The string key to remove.
     * @returns {boolean} `true` if an element was successfully removed, `false` otherwise (key not found).
     * @throws {TypeError} If the key is not a string.
     */
    remove(key) {
        // Calculate the index for the key.
        const i = this.#hashIndex(key);
        // Find the key.
        let prev = null;
        let node = this.#buckets[i];
        for (; node != null; prev = node, node = node.next) {
            if (node.is(key)) {
                break;
            }
        }

        if (node != null) {
            // If there is no previous node, the node is the head of the linked list.
            if (prev === null) {
                this.#buckets[i] = node.next;
            }
            // Otherwise, the new node is removed from the bucket's linked list.
            else {
                prev.setNext(node.next);
            }
            this.#count--;

            return true;
        }

        return false;
    }

    /**
     * Removes all keys from the hash set.
     * Resets the capacity to the default initial capacity.
     */
    clear() {
        this.#buckets = new Array(DefaultCapaity);
        this.#count   = 0;
    }

    /**
     * Returns a new array containing all keys in the hash set.
     * The order of keys is not guaranteed.
     * 
     * @returns {string[]} An array of string keys.
     */
    keys() {
        return Array.from(this.iterate());
    }

    /**
     * Returns a new array containing all keys in the hash set.
     * The order of keys is not guaranteed.
     * 
     * @returns {string[]} An array of string keys.
     */
    values() {
        return this.keys();
    }

    /**
     * Returns a new array containing all keys in the hash set as [key, key] arrays.
     * The order of entries is not guaranteed.
     * 
     * @returns {Array<[string, string]>} An array of [key, key] pairs.
     */
    entries() {
        return Array.from(this.iterate(), key => [key, key]);
    }

    /**
     * Creates an iterator that yields the key for each entry in the hash set.
     * The iteration order depends on the internal bucket structure and is not guaranteed.
     * 
     * @yields {string} The next key.
     * @returns {IterableIterator<[string]>} An iterable iterator over the set keys.
     */
    *iterate() {
        for (const bucket of this.#buckets) {
            for (let node = bucket; node != null; node = node.next) {
                yield node.key;
            }
        }
    }

    /**
     * Doubles the capacity of the hash set and rehashes all existing entries
     * into the new, larger array of buckets. Called automatically when the
     * load factor is exceeded.
     * 
     * @private
     */
    #grow() {
        const cap = this.capacity * 2;
        const old = this.#buckets;
        // Create a new array of buckets with the new capacity.
        this.#buckets = new Array(cap);
        this.#count   = 0;
        // Rehash.
        old.forEach(item => {
            for (let node = item; node != null; node = node.next) {
                this.set(node.key);
            }
        });
    }

    /**
     * Calculates the bucket index for a given key based on its hash and current capacity.
     * 
     * @param {string} key The string key.
     * @returns {number} The bucket index (0 to capacity - 1).
     * @throws {TypeError} If the key is not a string.
     * @private
     */
    #hashIndex(key) {
        return this.hash(key) % this.capacity;
    }
}