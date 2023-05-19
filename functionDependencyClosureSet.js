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
console.log(subsets,'\n');


/**
 * @description 此函数用来判断例如[['A'],['B']]是不是[[['A'],['B']],[['B'],['C']]]的子集
 * @param {array} item - F中的item
 * @param {array} F - 函数依赖集合
 * @returns {bool} 如果为的子集，返回true; 反之返回false 
 */
function reflexiveItem_is_subset_of_newF(item, F){
  return F.some(subArr => JSON.stringify(subArr) === JSON.stringify(item))

}


/**
 * @description 此函数通过reflexive rule来计算F+
 * @param {array} R - 关系模式
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回应用reflexive rule后的F+
 */
function reflexiveRule(R, F) {
  const newF = [...F];
  for(const [alpha,beta] of F){
    alphaSubsets = getSubsets(alpha);
    for (subset of alphaSubsets){
      //判断非空
      if (subset.length !== 0){
          const reflexiveItem = [alpha,subset];
          if(! reflexiveItem_is_subset_of_newF(reflexiveItem,newF)){
          newF.push(reflexiveItem);
        }
      }
    }
  }
  return newF;
}

//测试reflexive rule
F_new = reflexiveRule(R,F)
console.log('F+ after reflexive rule',F_new,'\n')


/**
 * @description 此函数用来判断例如[['A'],['B']]是不是[[['A'],['B']],[['B'],['C']]]的子集
 * @param {array} item - F中的item
 * @param {array} F - 函数依赖集合
 * @returns {bool} 如果为的子集，返回true; 反之返回false 
 */
function augmentItem_is_subset_of_newF(item, F){
  return F.some(subArr => JSON.stringify(subArr) === JSON.stringify(item))

}

/**
 * @description 此函数通过augmentation rule来计算F+
 * @param {array} R - 关系模式
 * @param {array} F - 函数依赖集合
 * @returns {array} 返回应用augmentation rule后的F+
 */
function augmentationRule(R, F) {
    //求R的非空子集
    const RSubsets = getSubsets(R).filter(subset => subset.length > 0);
    const newF = F.slice();
    for (const [alpha, beta] of F) {
      for (const subset of RSubsets) {
        const augmentationAlpha = [...new Set([...subset, ...alpha])].sort();
        const augmentationBeta = [...new Set([...subset, ...beta])].sort();
        const augmentItem = [augmentationAlpha, augmentationBeta];
        //如果augmentItem不在newF中
        if (!augmentItem_is_subset_of_newF(augmentItem,newF)){
          newF.push(augmentItem);
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
function transitiveItem_is_subset_of_newF(item, F){
  return F.some(subArr => JSON.stringify(subArr) === JSON.stringify(item))

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
        if (isArraySubset(beta,alpha_i) && isArraySubset(alpha_i,beta)){
          const transitiveItem = [alpha, beta_i];
          if (! transitiveItem_is_subset_of_newF(transitiveItem, newF)){
            newF.push(transitiveItem);
          }
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
    let FOriginal = [...F];
    while(true){
      F = reflexiveRule(R, F);
      F = augmentationRule(R, F);
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
R = ['A','B','C','G','H','I']
F = [[['A'],['B']], [['A'],['C']], [['C','G'],['H']], [['C','G'],['I']], [['B'],['H']]]
F_new = calculateFunctionDependencyClosureSetByArmstrongAxioms(R,F)
////如果要输出F_new的全部，就用for循环
// for (let i in F_new){
//   console.log(F_new[i]);
// }
console.log(F_new,length);
//否则输出会省略掉部分
console.log(F_new);


