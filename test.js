const a = [1, 2, 3, 4, 5];
const b = [2, 3, 6];

const isSubset = b.every(item => a.includes(item));
console.log(isSubset); // In ra true, vì tất cả phần tử của b đều có trong a.