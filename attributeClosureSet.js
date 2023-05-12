R = ['A','B','C','D','E','F']

F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

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

closure_of_A = calculateSingleAttributeClosure(['A'],F)
console.log('closure of A is ',closure_of_A,'\n')

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
        let isDuplicate = attributeClosureSet.some(
            ([alphaSet, alphaClosureSet]) =>
                alphaSet.join("") === alpha.join("") &&
                alphaClosureSet.join("") === result.join("")
        );
        if (!isDuplicate) {
            attributeClosureSet.push([alpha, result]);
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





