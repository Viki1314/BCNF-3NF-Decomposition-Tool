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


//--------------------------上面的是一些可以用的函数


//---------计算属性闭包-----------------
//isSubset函数和calculateSingleAttributeClosure函数需一起使用

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
  

//-------------------------------


//---------------用armstrong axioms计算F+-----------------------
//下面的函数要一起使用

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

/**
 * @description 此函数通过reflexive rule来计算F+
 * @param {array} R - 关系模式
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回应用reflexive rule后的F+
 */
function reflexiveRule(R, F) {
    const newF = [...F];
    for (const attribute of R) {
      if (!newF.some(([alpha, beta]) => alpha.includes(attribute) && beta.includes(attribute))) {
        newF.push([[attribute], [attribute]]);
      }
    }
    return newF;
  }

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

/**
 * @description 此函数通过augmentation rule来计算F+
 * @param {array} R - 关系模式
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回应用augmentation rule后的F+
 */
function augmentationRule(R, F) {
    const RSubsets = getSubsets(R).filter(subset => subset.length > 0);
    const newF = F.slice();
    for (const [alpha, beta] of F) {
      for (const subset of RSubsets) {
        const augmentationAlpha = [...new Set([...subset, ...alpha])].sort();
        const augmentationBeta = [...new Set([...subset, ...beta])].sort();
        if (!newF.some(([a, b]) => arraysEqual(a, augmentationAlpha) && arraysEqual(b, augmentationBeta))) {
          newF.push([augmentationAlpha, augmentationBeta]);
        }
      }
    }
    return newF;
  }

/**
 * @description 此函数通过transitiviry rule来计算F+
 * @param {array} R - 关系模式
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回应用transitivity rule后的F+
 */
function transitivityRule(R, F) {
    const newF = [...F];
    for (const [alpha, beta] of F) {
      for (const [alpha_i, beta_i] of F) {
        if (beta.every((attr) => alpha_i.includes(attr)) && !newF.some(([a, b]) => a.join() === alpha.join() && b.join() === beta_i.join())) {
          newF.push([alpha, beta_i]);
        }
      }
    }
    return newF;
  }
  

/**
 * @description 此函数通过Armstrong Axiom来计算F+
 * @param {array} R - 关系模式
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回应用Armstrong Axioms后的F+
 */
function calculateFunctionDependencyClosureSetByArmstrongAxioms(R, F){
    F = reflexiveRule(R, F);
    F = augmentationRule(R, F);
    let FOriginal = [...F];
    while(true){
        F = transitivityRule(R, F);
        if (JSON.stringify(F) === JSON.stringify(FOriginal)) {
            break;
        } else {
            FOriginal = [...F];
        }
    }
    F.sort();
    return F;
    }

//---------------------------------------------------------------

