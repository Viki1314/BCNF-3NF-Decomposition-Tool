R = ['A','B','C','D','E','F']

F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

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

//测试，求['A','B']的子集
subsets = getSubsets(['A','B']);
console.log('Subset of [A,B] is ',subsets,'\n');

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

//测试，求['A','B']的真子集
properSubsets = getProperSubsets(['A','B']);
console.log('Proper subset of [A,B] is ',properSubsets,'\n');


/**
 * @description 此函数用来判断['A']是不是['A','B']的子集
 * @param {array} listA - A list
 * @param {array} listB - B list
 * @returns {bool} 如果A为B的子集，返回true; 反之返回false 
 */
function isSubset(listA, listB) {
  if(listA.length===0){
    return true;
  }
  return listA.every(elem => listB.includes(elem));
}

/**
 * @description 用于计算单个参数的属性闭包
 * @param {array} alpha - 需要计算闭包的alpha
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回属性闭包alpha+
 */
function calculateSingleAttributeClosure(alpha, F) {
  // 复制原始的 alpha 数组
  alpha = alpha.slice();
  if (alpha.length === 0) {
    return [];
  }
  // 初始化结果数组为 alpha
  let result = alpha.slice();
  while (true) {
    for (let [alpha_i, beta_i] of F) {
      // 如果 alpha_i 是 result 的子集
      if (isSubset(alpha_i,result)) {
        // 将 beta_i 中不在 result 中的元素加入 result
        for (let b of beta_i) {
          if (!result.includes(b)) {
            result.push(b);
          }
        }
      }
    }
    // 如果结果不再改变，说明计算完成
    if (isSubset(result,alpha)) {
      break;
    }
    // 否则更新 alpha，并继续计算和比较
    alpha = result.slice();
  }
  return result;
}


/**
 * @description 此函数用来判断list A是不是list B的子集
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
 * @description 此函数用来判断alpha是不是candidate key
 * @param {array} alpha - 需要判断的属性集合
 * @param {array} R - 关系模式
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回s的所有真子集的集合
 */
function determineCandidateKey(alpha, R, F){
    alphaClosure = calculateSingleAttributeClosure(alpha,F);
    for(item of alphaClosure){
      //如果alpha为super key
      if(isSubset(R, alphaClosure)){
          notCandidateKey = false;
          //判断子集是否为super key
          alphaProperSubsets = getProperSubsets(alpha);
          for(subset of alphaProperSubsets){
              subsetClosure = calculateSingleAttributeClosure(subset,F);
              //子集存在super key，alpha就不是candidate key
              if(isSubset(R,subsetClosure)){
                  notCandidateKey = ture;
              }
          }
          if(!notCandidateKey) 
              return true;
          return false;
      }
    }
    return false;
}

//测试candidate key的计算
console.log('determine if A is a candidate key',determineCandidateKey(['A'],R,F),'\n');
console.log('determine if B is a candidate key',determineCandidateKey(['B'],R,F),'\n');


/**
 * @description 此函数计算所有的candidate key
 * @param {array} R - 关系模式
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回candidate key set
 */
function calculateCandidateKeySet(R, F){
    let candidateKeySet = [];
    for([alpha,beta] of F){
        if(determineCandidateKey(alpha,R,F)){
            candidateKeySet.push(alpha);
        }
    }
    return candidateKeySet;
}

//测试求candidateKeySet
candidateKeySet = calculateCandidateKeySet(R,F);
console.log('candidate key set is ',candidateKeySet,'\n');


