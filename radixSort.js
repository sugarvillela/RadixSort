const negIndexArray = () => {
    const data = new Array(19).fill(0);
    const offset = 9;
    const calcStartIndices = () => {
        for (let i = 1; i < data.length; i++){
            data[i] += data[i - 1];
        }
        //data[0] = 0;
    };
    const shiftRight = () => {
        for(let i = data.length - 1; i > 0; i--){
            data[i] = data[i - 1];
        }
        data[0] = 0;
    };
    return {
        set: (i, d) => data[i + offset] = d,
        get: (i) => data[i + offset],
        inc: (i) => data[i + offset]++,
        calcStartIndices: () => calcStartIndices(),
        shiftRight: () => shiftRight(),
        getData: () => data.map(d => d),
        disp: () => data.forEach((d, i) => console.log(i - offset, d))
    };
};

//const neg = negIndexArray();
//let v = -9;
//for (let i = 0; i < 19; i++) {
//    neg.set(v, v);
//    v++;
//}
//neg.disp();

const getIndexArr = (singles) => {  
    const counter = negIndexArray();

    // count occurrences
    for (let i = 0; i < singles.length; i++) {
        counter.inc(singles[i]);
    }

    // calc start pos
    counter.calcStartIndices();
    counter.shiftRight();
    //counter.disp();
    
    const indexArr = new Array(singles.length);

    // build output
    for (let i = 0; i < singles.length; i++) {
        indexArr[counter.get(singles[i])] = i;
        counter.inc(singles[i]);
    }

    return indexArr;
};

const countingSort = (source, singles) => {  
    const indexArr = getIndexArr(singles);
    
    return indexArr.map((i) => source[i]);
};
const radixSort = (source) => {
    const digitCount = (n) => (n === 0)? 1 : Math.floor(Math.log10(Math.abs(n))) + 1;
    const getDigit = (n, place) => Math.floor(Math.abs(n) / Math.pow(10, place)) % 10;
    const getMaxDepth = (src)=> {
        let max = digitCount(src[0]);
        for (let i = 1; i < src.length; i++){
            const currDigitCount = digitCount(src[i]);
            if(currDigitCount > max){
                max = currDigitCount;
            }
        }
        return max;
    };
    
    if (source?.length) {       
        // handle negative numbers
        let mults = source.map(n => (n < 0)? -1 : 1);
        
        const maxDepth = getMaxDepth(source);
        for (let k = 0; k < maxDepth; k++){
            const singles = source.map((n, i) => getDigit(n, k) * mults[i]);
            const indexArr = getIndexArr(singles);

            source = indexArr.map((i) => source[i]);
            mults = indexArr.map((i) => mults[i]);
        }
        
        return source;//.map((n, i) => n * mults[i]);
    }
    
    return [];
};

const eqArr = (a, b) => {
    return a.length === b.length && a.every((v, i) => v === b[i]);
};

// Example usage:
const source = [19,-49,26,400,-36,11,0,-1,-63,-241,77]; // [9,-9,6,4,-6,1,0,-1,-3,-4,7];// [4, 2, 2, 8, 3, 3, 1];//[1,0,3,1,3,1];//
//const singles = source;
const actual = radixSort(source);
 
const expected = [-241, -63, -49, -36, -1, 0, 11, 19, 26, 77, 400];//[-9,-6,-4,-3,-1,0,1,4,6,7,9];//[1, 2, 2, 3, 3, 4, 8];//[0,1,1,1,3,3];
console.log(actual); // Output: [1, 2, 2, 3, 3, 4, 8]
console.log(eqArr(expected, actual));


