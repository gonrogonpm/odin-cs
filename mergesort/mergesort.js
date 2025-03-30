function mergeSort(array) {
    if (!Array.isArray(array)) {
        throw TypeError("input should be an array");
    }

    return mergeSortAux(array, 0, array.length - 1);
}

function mergeSortAux(array, beg, end) {
    const len = end - beg + 1;
    if (len <= 0) { return []; }
    if (len == 1) { return array.slice(beg, end + 1); }

    const middle = Math.floor(beg + len / 2);
    const lhs = mergeSortAux(array, beg, middle - 1);
    const rhs = mergeSortAux(array, middle, end);

    let i = 0;
    let j = 0;
    const result = [];

    while (i < lhs.length && j < rhs.length) {
        if (lhs[i] <= rhs[j]) {
            result.push(lhs[i]);
            i++;
        }
        else {
            result.push(rhs[j]);
            j++;
        }
    }

    if (i < lhs.length) { result.push(...lhs.slice(i)); }
    if (j < rhs.length) { result.push(...rhs.slice(j)); }

    return result;
}


function checkEquals(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
        return false;
    }

    if (a.length != b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }

    return true;
}

console.log(checkEquals(mergeSort([]), []));
console.log(checkEquals(mergeSort([21]), [21]));
console.log(checkEquals(mergeSort([2, 1]), [1, 2]));
console.log(checkEquals(mergeSort([-1, 2, -2, -5, -5, 0, 1]), [-5, -5, -2, -1, 0, 1, 2]));
console.log(checkEquals(mergeSort([3, 2, 1, 13, 8, 5, 0, 1]), [0, 1, 1, 2, 3, 5, 8, 13]));
console.log(checkEquals(mergeSort([105, 79, 100, 110]), [79, 100, 105, 110]));