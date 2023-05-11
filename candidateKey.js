R = ['A','B','C','D','E','F']

F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

/**
 * @description 此函数用来计算s的子集
 * @param {array} s - 需要计算子集的集合
 * @returns {array} 返回s的所有子集的集合
 */
function getSubsets(s) {
    s = s.slice(); // 创建原数组的一个浅拷贝
    if (!s.length) {
      return [[]];
    }
    const x = s.pop();
    const subsets = getSubsets(s);
    return [...subsets, ...subsets.map(subset => subset.concat(x))];
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
    elementToRemove = s.slice();
    s = s.slice();
    subsets = getSubsets(s);
    properSubset = subsets.filter(item => {return JSON.stringify(item) !== JSON.stringify(elementToRemove)});
    return properSubset;
}

//测试，求['A','B']的真子集
properSubsets = getProperSubsets(['A','B']);
console.log('Proper subset of [A,B] is ',properSubsets,'\n');


/**
 * @description 用于计算单个参数的属性闭包
 * @param {array} originalAlpha - 需要计算闭包的alpha
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回属性闭包alpha+
 */
function calculateSingleAttributeClosure(originalAlpha, F) {
    // 复制原始的 alpha 数组
    let alpha = originalAlpha.slice();
    if (alpha.length === 0) {
      return [];
    }
    // 初始化结果数组为 alpha
    let result = alpha.slice();
    while (true) {
      for (let [alpha_i, beta_i] of F) {
        // 如果 alpha_i 是 result 的子集
        if (alpha_i.every((value) => result.includes(value))) {
          // 将 beta_i 中不在 result 中的元素加入 result
          for (let b of beta_i) {
            if (!result.includes(b)) {
              result.push(b);
            }
          }
        }
      }
      // 如果结果不再改变，说明计算完成
      if (result.every((value) => alpha.includes(value))) {
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

// /**
//  * @description 此函数用来判断nestArray A是不是nestArray B的子集
//  * @param {array} nestArrayA - 嵌套数组A
//  * @param {array} nestArrayB - 嵌套数组B
//  * @returns {bool} 如果A为B的子集，返回true; 反之返回false 
//  */
// function isNestArraySubset(nestArrayA, nestArrayB){
//   flag1 = true;
//   for(Aitem of nestArrayA){
//     flag2 = false;
//     for (Bitem of nestArrayB){
//       if(isArraySubset(Aitem,Bitem)){
//         flag2 = true;
//       }
//     }
//     if(!flag2){
//       flag1 = false;
//     }
//   }
//   return flag1;
// }

// //测试nestArray子集判断
// console.log(isNestArraySubset());


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
        if(isArraySubset(R, alphaClosure)){
            notCandidateKey = false;
            alphaProperSubsets = getProperSubsets(alpha);
            for(subset of alphaProperSubsets){
                subsetClosure = calculateSingleAttributeClosure(subset,F);
                if(isArraySubset(R,subsetClosure)){
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

