R = ['A','B','C','D','E','F']

F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

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

closure_of_A = calculateSingleAttributeClosure(['A'],F)
console.log('closure of A is ',closure_of_A,'\n')


/**
 * @description 此函数用来判断例如[['A'],['B']]是不是[[['A'],['B']],[['B'],['C']]]的子集
 * @param {array} item - F中的item
 * @param {array} F - 函数依赖集合
 * @returns {bool} 如果为的子集，返回true; 反之返回false 
 */
function isInAttributeClosureSet(item, attributeClosureSet){
  return attributeClosureSet.some(subArr => JSON.stringify(subArr) === JSON.stringify(item))
}


/**
 * @description 用来计算所有的属性闭包
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回属性闭包集合{alpha+}
 */
function calculateAttributeClosureSet(F) {
    // to store all attribute closures 用与存储所有的属性闭包
    let attributeClosureSet = [];
    for (let [alpha, beta] of F) {
        let result = calculateSingleAttributeClosure(alpha, F);
        // to eliminate duplicate attribute closure 若属性闭包未重复，则添加
        if (! isInAttributeClosureSet([alpha,result],attributeClosureSet)){
          attributeClosureSet.push([alpha,result]);
        }
    }
    return attributeClosureSet;
}

// calculate all attribute closures
let attributeClosureSet = calculateAttributeClosureSet(F);

// print all attribute closures
console.log('all attribute closures are')
for (let [alpha, alphaClosure] of attributeClosureSet) {
    console.log(alpha, " --> ", alphaClosure);
}
console.log('\n')

console.log('F is',F,'\n');


/**
 * @description 通过属性闭包集合间接地得到函数依赖闭包集合
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回函数依赖闭包集合{F+}
 */
function calculateFunctionDependencyClosureSetByAttributeClosureSet(F) {
  functionClosureSet = [];
  attributeClosureSet = calculateAttributeClosureSet(F);
  for (let [alpha, beta] of attributeClosureSet) {
      for (let attribute of beta) {
          functionClosureSet.push([alpha, [attribute]]);
      }
  }
  return functionClosureSet;
}

F_closure_set = calculateFunctionDependencyClosureSetByAttributeClosureSet(F);
console.log('F closure set is \n', F_closure_set,'\n');





