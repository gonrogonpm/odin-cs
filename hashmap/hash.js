/** 32 bit magic FNV1a32 prime. */
const Prime = 0x01000193;
/** FNV1a32 default basis. */
const Basis = 0x811C9DC5;
/** Text encoder to convert strings to UTF-8. */
const Encoder = new TextEncoder();

/**
 * Calculates the 32-bit Fowler-Noll-Vo (FNV1a) hash of a string.
 * 
  * This implementation adheres to the FNV1a standard by:
 * - Processing the UTF-8 byte representation of the input string.
 * - Using the standard 32-bit FNV1a prime and basis.
 * - Performing calculations using 32-bit integer arithmetic (via Math.imul and >>> 0).
 * @param {string} str The string to hash.
 * @param {number} [seed=0] An optional 32-bit integer value used to initialize the hash computation.
 *   The FNV basis is XORed with this seed before processing the first byte.
 *   A `seed` of 0 results in the standard FNV-1a initial state (Basis). Using different non-zero seeds produces
 *   variant FNV-1a hashes, which can be useful if different hash results are needed for the same input string in
 *   different contexts
 * @returns {number} The calculated 32-bit FNV1a hash as an unsigned integer.
 *   The result is guaranteed to be in the range [0, 2^32 - 1]
 * 
 * @example
 * // Standard hash (seed = 0).
 * const hash1 = fnv1a32("hello world");
 * console.log(hash1); // Output: 3582697383
 * console.log(hash1.toString(16)); // Output: 'd58b3fa7'
 * 
 * // Example using a non-default seed.
 * const hash2 = fnv1a32("hello world", 12345);
 * console.log(hash2); // Output: 3563689840
 * console.log(hash2.toString(16)); // Output: 'd4699770'
 * 
 * @see {@link http://www.isthe.com/chongo/tech/comp/fnv/} for more information on the FNV hash algorithm.
 */
export function fnv1a32(str, seed = 0) {
    // Convert string to UTF-8 bytes.
    const data = Encoder.encode(str); 
    // Initialize hash with Basis XORed with seed and ensure initial hash is 32 bits after XOR.
    let hash = (Basis ^ seed) >>> 0;

    for (let i = 0; i < data.length; i++) {
        hash ^= data[i];
        // Multiply by the FNV prime using 32-bit multiplication.
        hash  = Math.imul(hash, Prime);
    }
    // Ensure the final result is a 32-bit unsigned integer.
    return hash >>> 0;
}