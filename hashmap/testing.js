export function assertEqual(current, expected, testName) {
    const currentStr  = JSON.stringify(current);
    const expectedStr = JSON.stringify(expected);
    
    if (currentStr === expectedStr) {
        console.log(`✅ PASS: ${testName}`);
    } else {
        console.error(`❌ FAIL: ${testName}`);
        console.error(`    Expected: ${expectedStr}`);
        console.error(`    Current:  ${currentStr}`);
    }
}

export function assertTrue(condition, testName) {
    if (condition === true) {
        console.log(`✅ PASS: ${testName}`);
    } else {
        console.error(`❌ FAIL: ${testName} (Expected true, got ${condition})`);
    }
}

export function assertFalse(condition, testName) {
     if (condition === false) {
        console.log(`✅ PASS: ${testName}`);
    } else {
        console.error(`❌ FAIL: ${testName} (Expected false, got ${condition})`);
    }
}

export function assertThrows(func, errorType, testName) {
    let didThrow = false;
    let thrownError = null;

    try {
        func();
    }
    catch (e) {
        thrownError = e;
        didThrow = true;
    }

    if (didThrow && thrownError instanceof errorType) {
         console.log(`✅ PASS: ${testName} (Threw expected ${errorType.name})`);
    } 
    else if (didThrow) {
        console.error(`❌ FAIL: ${testName} (Threw unexpected error: ${thrownError})`);
    }
    else {
         console.error(`❌ FAIL: ${testName} (Did not throw an error)`);
    }
}