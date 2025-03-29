function fibs(n) {
    if (typeof n !== 'number' ||  n <= 0) {
        return [];
    }

    const result = [];
    for (let i = 0; i < n; i++) {
        if (i == 0) {
            result.push(0);
        }
        else if (i == 1) {
            result.push(1);
        }
        else {
            result.push(result[i - 1] + result[i - 2]);
        }
    }

    return result;
}

function fibsRec(n) {
    if (typeof n !== 'number') {
        return [];
    }
    
    return fibsRecAux(n, []);
}

function fibsRecAux(n, result) {
    if (result.length >= n) {
        return result;
    }

    if (result.length == 0) {
        if (n == 1) {
            result.push(0);
        }
        else {
            result.push(0, 1); 
        }
    }
    else {
        result.push(result.at(-1) + result.at(-2));
    }

    return fibsRecAux(n, result);
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

console.log(`fibs(-1): ${fibs(-1)}`);
console.log(checkEquals(fibs(-1), fibsRec(-1)));
console.log(`fibs(0): ${fibs(0)}`);
console.log(checkEquals(fibs(0), fibsRec( 0)));
console.log(`fibs(8): ${fibs(8)}`);
console.log(checkEquals(fibs(8), fibsRec( 8)));
console.log(`fibs(12): ${fibs(12)}`);
console.log(checkEquals(fibs(12), fibsRec(12)));