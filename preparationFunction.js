/**
 * @description 此函数用来计算s的子集
 * @param {array} s - 需要计算子集的集合
 * @returns {array} 返回s的所有子集的集合
 */
function getSubsets(s){
  if (s.length === 0){
    return [[]];
  }
  s = s.slice();
  const x = s.pop();
  const subsets = getSubsets(s);
  subsetsWithX = subsets.map(subset => subset.concat(x));
  return [...subsets, ...subsetsWithX];
}

/**
 * @description 此函数用来计算s的真子集
 * @param {array} s - 需要计算子集的集合
 * @returns {array} 返回s的所有真子集的集合
 */
function getProperSubsets(s){
  s = s.slice();
  subsets = getSubsets(s);
  properSubsets = subsets.filter(subset => {return JSON.stringify(subset) !== JSON.stringify(s)});
  return properSubsets;
}

/**
 * @description 此函数用来判断['A']是不是['A','B']的子集
 * @param {array} listA - A list
 * @param {array} listB - B list
 * @returns {bool} 如果A为B的子集，返回true; 反之返回false 
 */
function isArraySubset(listA, listB) {
    if(listA.length===0){
      return true;
    }
    return listA.every(elem => listB.includes(elem));
  }


/**
 * @description 此函数用来判断例如[['A'],['B']]是不是[[['A'],['B']],[['B'],['C']]]的子集
 * @param {array} item - F中的item
 * @param {array} F - 函数依赖集合
 * @returns {bool} 如果为的子集，返回true; 反之返回false 
 */
function isNestArraySubset(item, F){
    return F.some(subArr => JSON.stringify(subArr) === JSON.stringify(item))

}

//测试nestArray子集判断
item = [['A','B'],['C']]
F = [[['A'],['B','C']],[['B'],['C']]]
console.log('test nestArray subset',isNestArraySubset(item, F));

//测试nestArray子集判断
item = [['B'],['C','D']]
F = [[['A'],['B']]]
console.log('test nestArray subset',isNestArraySubset(item, F));


/**
 * @description 此函数用来判断两个array是否相等
 * @param {array} arr1 - array1
 * @param {array} arr2 - array2
 * @returns {bool} 相等返回true，不相等返回false
 */
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }



