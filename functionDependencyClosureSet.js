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
console.log(subsets,'\n');

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

//测试reflexive rule
F_new = reflexiveRule(R,F)
console.log('F+ after reflexive rule',F_new,'\n')

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

//测试augmentation rule
R = ['A','B','C']
F = [[['A'],['B']]]
F_new = augmentationRule(R,F)
console.log('F+ after augmentation rule',F_new,'\n')

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
  
//测试transitivity rule
R = ['A','B','C']
F = [[['A'],['B']],[['B'],['C']]]
F_new = transitivityRule(R,F)
console.log('F+ after transitivity rule ',F_new,'\n')

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

//测试Armstrong axioms
R = ['A','B','C']
F = [[['A'],['B']],[['B'],['C']]]
F_new = calculateFunctionDependencyClosureSetByArmstrongAxioms(R,F)
console.log('F+ after ArmstrongAxioms ',F_new,'\n') 


