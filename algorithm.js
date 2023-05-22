//算法文件

/* 基本函数——罗云扬*/

//attributeClosureSet.js----------------------------------------------------------------------------------------------------------------------------------------------------------
// R = ['A','B','C','D','E','F']
// F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

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

// closure_of_A = calculateSingleAttributeClosure(['A'],F)
// console.log('closure of A is ',closure_of_A,'\n')


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

// // calculate all attribute closures
// let attributeClosureSet = calculateAttributeClosureSet(F);

// // print all attribute closures
// console.log('all attribute closures are')
// for (let [alpha, alphaClosure] of attributeClosureSet) {
//     console.log(alpha, " --> ", alphaClosure);
// }
// console.log('\n')

// console.log('F is',F,'\n');


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

// F_closure_set = calculateFunctionDependencyClosureSetByAttributeClosureSet(F);
// console.log('F closure set is \n', F_closure_set,'\n');

//candidateKey.js

// R = ['A','B','C','D','E','F']
// F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

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
// subsets = getSubsets(['A','B']);
// console.log('Subset of [A,B] is ',subsets,'\n');

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
// properSubsets = getProperSubsets(['A','B']);
// console.log('Proper subset of [A,B] is ',properSubsets,'\n');


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
// console.log('determine if A is a candidate key',determineCandidateKey(['A'],R,F),'\n');
// console.log('determine if B is a candidate key',determineCandidateKey(['B'],R,F),'\n');


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
// candidateKeySet = calculateCandidateKeySet(R,F);
// console.log('candidate key set is ',candidateKeySet,'\n');

//canonicalCoverSet.js---------------------------------------------------------------------------------------------------------------------------------------------------------

// R = ['A','B','C','D','E','F']

// F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

/**
 * @description 此函数用来判断例如['A','B']和['A','B']是否相等
 * @param {array} arr1 - array1
 * @param {array} arr2 - array2
 * @returns {bool} 相等返回true，不相等返回false
 */
function alphaEqualsAlpha_i(arr1, arr2) {
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
 * @description 此函数用来判断例如[['A'],['B']]是不是[[['A'],['B']],[['B'],['C']]]的子集
 * @param {array} item - F中的item
 * @param {array} F - 函数依赖集合
 * @returns {bool} 如果为的子集，返回true; 反之返回false 
 */
function itemIsSubsetOfF(item, F){
    return F.some(subArr => JSON.stringify(subArr) === JSON.stringify(item))

}

/**
 * @description 此函数返回合并后的函数依赖集合,
 * Example: F 中有 A-->B, B-->C, A-->C
 * 返回 A-->(B,C) , B-->C
 * @param {array} F - 函数依赖集合F
 * @returns {array} 返回处理后的unionF
 */
function functionDependencyUnion(F){
    let unionF = [];
    for([alpha,beta] of F){
        let betaUnion = beta.slice();
        for([alpha_i, beta_i] of F){
            if(alphaEqualsAlpha_i(alpha,alpha_i)){
                for(elem of beta_i){
                    if(!betaUnion.includes(elem)){
                        betaUnion.push(elem);
                    }
                }
            }
        }
        let item = [alpha,betaUnion.sort()];
        if(!itemIsSubsetOfF(item,unionF)){
            unionF.push(item);
        }
    }
    return unionF;
}

//测试
// console.log('function dependency union test',functionDependencyUnion([[['A'],['B']],[['A'],['C']]]),'\n');

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
 * @description 此函数用来判断['A']是不是['A','B']的子集
 * @param {array} listA - A list
 * @param {array} listB - B list
 * @returns {bool} 如果A为B的子集，返回true; 反之返回false 
 */
function beta_is_subset_of_newClosure(listA, listB) {
    return listA.every(elem => listB.includes(elem));
  }


/**
 * @description 此函数用来去除左侧的extraneous attribute
 * @param {array} unionF - 经过union处理后的F
 * @returns {array} 返回去除左侧extraneous attribute后的F
 */
function eliminateLeftExtraneous(unionF){
    for(let i in unionF){
        replace = unionF[i];    //replace = [alpha,beta] 
        alpha = replace[0];
        beta = replace[1];
        alphaSubsets = getProperSubsets(alpha);
        for(subset of alphaSubsets){
            if(subset !== [] && (subset.length < alpha.length)){
                newClosure = calculateSingleAttributeClosure(subset, unionF);
                    if(beta_is_subset_of_newClosure(beta, newClosure)){
                        replace = [subset, beta];
                    }
            }
        }
        unionF[i] = replace;
    }
    return unionF;
}


//test
// unionF = [[['A'],['B']],[['B'],['C']],[['A','C'],['D']]];
// console.log('left extranuous elimination',eliminateLeftExtraneous(unionF),'\n');

/**
 * @description 此函数用来去除右侧的extraneous attribute
 * @param {array} unionF - 经过union处理后的F
 * @returns {array} 返回去除右侧extraneous attribute后的F
 */
function eliminateRightExtraneous(unionF){
    for(let i in unionF){
        replace = unionF[i]; //replace = [alpha, beta]
        alpha = replace[0];
        beta = replace[1];
        betaSubsets = getProperSubsets(beta);
        for(subset of betaSubsets){
            if(subset !== [] && (subset.length < beta.length)){
                tempUnionF = unionF.slice();
                tempUnionF[i] = [alpha, subset];
                newClosure = calculateSingleAttributeClosure(alpha, tempUnionF);
                if(beta_is_subset_of_newClosure(beta, newClosure)){
                    replace = [alpha, subset];
                }
            }
        }
        unionF[i] = replace;
    }
    return unionF;
}

//test
// unionF = [[['A'],['B']],[['B'],['C']],[['A'],['C','D']]];
// console.log('right extranuous elimination',eliminateRightExtraneous(unionF),'\n');


/**
 * @description 此函数用来计算canonical cover set
 * @param {array} F - 初始化的函数依赖集合F
 * @returns {array} 返回canonical cover set
 */
function computeCanonicalCoverSet(F){
    F = functionDependencyUnion(F);
    F = eliminateLeftExtraneous(F);
    F = functionDependencyUnion(F);
    F = eliminateRightExtraneous(F);
    return F;
  }

//test
// F = [[['A'], ['B','C']], [['B'], ['C']], [['A'], ['B']], [['A','B'], ['C']]]
// canonicalCoverF = computeCanonicalCoverSet(F);
// console.log('canonical cover set F is',canonicalCoverF,'\n');

//functionDependencyClosureSet.js---------------------------------------------------------------------------------------------------------------------------------------------------------

// R = ['A','B','C','D','E','F']

// F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

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
// subsets = getSubsets(['A','B']);
// console.log(subsets,'\n');


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
// F_new = reflexiveRule(R,F)
// console.log('F+ after reflexive rule',F_new,'\n')


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
// R = ['A','B','C']
// F = [[['A'],['B']]]
// F_new = augmentationRule(R,F)
// console.log('F+ after augmentation rule',F_new,'\n')


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
// R = ['A','B','C']
// F = [[['A'],['B']],[['B'],['C']]]
// F_new = transitivityRule(R,F)
// console.log('F+ after transitivity rule ',F_new,'\n')


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
// R = ['A','B','C','G','H','I']
// F = [[['A'],['B']], [['A'],['C']], [['C','G'],['H']], [['C','G'],['I']], [['B'],['H']]]
// F_new = calculateFunctionDependencyClosureSetByArmstrongAxioms(R,F)
// ////如果要输出F_new的全部，就用for循环
// // for (let i in F_new){
// //   console.log(F_new[i]);
// // }
// console.log(F_new,length);
// //否则输出会省略掉部分
// console.log(F_new);
  
  /*BCNF----李伟杰*/
//---------------------------------------------------BCNF-------------------------------------------------------------/**
/*
 * @description 判断超集
 * @param {Set} set 
 * @param {Set} subset 
 * @returns boolean
 */
function isSuperset(set, subset) {
    for (let elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
  }
/**
   * @description 求并集
   * @param {Set} setA 
   * @param {Set} setB 
   * @returns {Set} 并集
   */
function union(setA, setB) {
    let _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
  }
/**
   * @description 求交集
   * @param {Set} setA 
   * @param {Set} setB 
   * @returns {Set} 交集
   */
function intersection(setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
  }
/**
   * @description 求差集：A-B
   * @param {Set} setA 
   * @param {Set} setB 
   * @returns {Set} 差集
   */
function difference(setA, setB) {
    let _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
  }
/**
  * @description 判断alpha和beta交集为空
  * @param {Set} alpha_set 
  * @param {Set} beta_set 
  * @returns {Boolean} 
  */
function isdisjoint(alpha_set,beta_set){
      // console.log(intersection(alpha_set,beta_set).size);
      return intersection(alpha_set,beta_set).size==0? true:false;
  }
/**
 * @description 检查不常用（non-trivial）依赖s是否导致不符合BCNF
 * @param {Array(Array())} s:F中的一个在schemaR上的非平凡依赖，2-dimension Array;ex:[['A'],['B']]
 * @param {Array} schemaR:list,表的属性;ex:['A','B','C','D','E','F']
 * @param {Array(Array(Array()))} F :函数依赖集，3-dimension Array
 * @returns Boolean,True:符合BC范式；False：违背BC范式
 */
function check_NontrivialDependencyCaseViolationOfBCNF(s,schemaR,F){
      var s_plus_set = new Set(calculateSingleAttributeClosure(s[0],F));
      // console.log(s,'s+:',s_plus_set);
      var R_set = new Set(schemaR);
      // console.log('isSuperset(s_plus_set, R_set)---',isSuperset(s_plus_set, R_set));
      return isSuperset(s_plus_set, R_set);
  }
      
 /**
 *@description 检检查schena是否符合BC范式
 * @param {Array} schemaR:list,表的属性;ex:['A','B','C','D','E','F']
 * @param {Array(Array(Array()))} F :函数依赖集，3-dimension Array
 * @returns {Boolean}result:boolean,True:符合BC范式；False：违背BC范式
 *          {Array} vio:违背BC范式的函数依赖，2-dimension Array;ex:[['A'],['B']]
 */
function check_schemaInBCNF(schemaR,F){
      var result = true;
      var vio =[] ;
      for (i in F){
          var alpha_set = new Set(F[i][0]);
          var beta_set = new Set(F[i][1]);
          // 保证该依赖是非平凡依赖且在Ri中，可以被分解
          if (!(isSuperset(alpha_set,beta_set)) &&  isSuperset(new Set(schemaR),union(alpha_set,beta_set))){
              // console.log(i,'\t',F[i],'\t',!(check_NontrivialDependencyCaseViolationOfBCNF(F[i],schemaR,F)));
              if (!(check_NontrivialDependencyCaseViolationOfBCNF(F[i],schemaR,F))){
                  vio = F[i];
                  result = false;
                  break;
              }
          }
      }
      // console.log(result,'\t',vio);
      return [result,vio];
  
  }
  
  
  /**
   * description:BC范式分解
   * @param {Array} R-属性集 
   * @param {Array} F-依赖集
   * @param {Boolean} F_plus_need-需要计算F_plus 
   */
  function BCNF(R,F,F_plus_need=true){
      var result = [R];
      var done = false;
      var step = {'root':R};
      var decompose_times = 0;
      var F_plus =[];
      console.log('F_plus start');
      if (F_plus_need){
          // console.log('get F_plus');
          F_plus = calculateFunctionDependencyClosureSetByArmstrongAxioms(R,F);
          // console.log(F_plus);
      }
      else{
        var F_closure_set = calculateFunctionDependencyClosureSetByAttributeClosureSet(F);
        // var dic = new Map();
        for (var i = 0;i<F_closure_set.length;i++){
          var temp = true;
          for (var j = 0 ;j<F_plus.length;j++){
            if (F_plus[j][0]==F_closure_set[i][0]){
              F_plus[j][1].push(F_closure_set[i][1][0]);
              temp = false;
              break;
            }
          }
          if(temp){
            F_plus.push(F_closure_set[i]);
          }
        
        }
        // console.log(F_plus);
        // console.log('F closure set is \n', F_closure_set,'\n');
      }
      console.log('F_plus end');
      var out = 1;
      while(! done){
          var allBCNF = true;
          // if (out>5){
          //   break;
          // }
          // out++;
          for(var i = 0;i<result.length;i++){
              var temp_R = result[i]; //list
              var temp_R_set = new Set(temp_R);
              // console.log(temp_R,'\t',temp_R_set);
              // var temp_done = false;
              var temp = check_schemaInBCNF(temp_R,F);
              var bc = temp[0];
              var vio = temp[1];
              // console.log(bc,vio);
              if (!bc){
                  allBCNF = false;
                  var alpha = vio[0];
                  var beta = vio[1];
                  var alpha_set = new Set(alpha);
                  var beta_set = new Set(beta);
                  // console.log(isdisjoint(alpha_set,beta_set));
                  if (isdisjoint(alpha_set,beta_set)){
                      var decompose = true;
                      if(F_plus_need){
                          for (j in F_plus){
                              if( F_plus[j][0] == alpha && F_plus[j][1] == temp_R){
                                  decompose = false;
                                  break;
                              }
                          }
                      }
                      else{
                        for (j in F_plus){
                          if( F_plus[j][0] == alpha && isSuperset(new Set(F_plus[j][1]),temp_R_set )){
                              decompose = false;
                              break;
                          }
                        }
                      }
                      if(decompose){
                          var temp_step = step;
                          for(var j =0;j<decompose_times;j++){
                              temp_step = step['right'];
                          }
                          decompose_times++;
                          console.log(temp_step['decompose_dependency']);
                          temp_step['decompose_dependency'] = vio;
                          console.log(temp_step['decompose_dependency']);
                          del_index = result.findIndex(element =>element == temp_R);
                          // console.log(del_index);
                          result.splice(del_index,1);
                          result.push(Array.from(union(alpha_set,beta_set)));
                          temp_step['left'] = Array.from(union(alpha_set,beta_set));
                          result.push(Array.from(difference(temp_R_set,beta_set)));
                          temp_step['right']= {'root':Array.from(difference(temp_R_set,beta_set))};
                      }
                  }
              }
          }
          // console.log(allBCNF,'\t',out)
          if(allBCNF){
              done = true;
          }
      }
      // console.log(result,'\t',step);
      return [result,step];
  }
  

  /*3NF----全秦霄*/
  
  /**
  * --------------------------------------3NF-----------------------------------------------------------
  */
 
 //---------------------------------3NF判断-------------------------------------------
 
 /**
  * @description 此函数用来判断beta是否属于alpha
  * @param {array} alpha 
  * @param {array} beta
  * @returns {bool} 如果beta为alpha的子集，返回true; 反之返回false 
  */
 
 function beta_belong_alpha(alpha,beta){
     return isArraySubset(beta,alpha);
 }
 //test
 //console.log(betaBelongAlpha(['A','B','C'],['A','B']))
 
 /**
  * @description 此函数用来判断alpha是否为超码
  * @returns {bool}  
  */
 function alpha_is_superKey(alpha,F,R){
     alpha_closure=calculateSingleAttributeClosure(alpha,F);
     //console.log(alpha_closure);
     return isArraySubset(R,alpha_closure);
 }
 //test
 //console.log(alphaIsSuperkey(['B'],F,R))
 
 /**
  * @description 此函数用来实现集合减法
  * @returns {bool}  
  */
 function subs(A,B){
     let C=A.filter(a => !B.includes(a));
     return C
 }
 //console.log(subs([1,2,3,4,5],[1,2,7]))
 
 /**
  * @description 此函数用来判断beta-alpha是否包含于某个候选码中
  * @returns {bool}  
  */
 function b_minus_a_contain_candidatKey(alpha,beta,F,R){
     b_minus_a=subs(beta,alpha);
     //console.log(b_minus_a);
     candidateK=calculateCandidateKeySet(R,F);
     //console.log(candidateK);
     return itemIsSubsetOfF(b_minus_a,candidateK);
 }
 // alpha=[2]
 // beta=[1,2]
 // F=[[[1,2],[3,4]],[[2],[3]],[[1,3],[2]]]
 // R=[1,2,3,4]
 // console.log(b_minus_a_contain_candidatKey(alpha,beta,F,R))
 
 /**
  * @description 此函数用来测试表是否符合3NF
  * @returns {array}   破坏3NF的函数依赖关系;当输出为[]时，代表表符合3NF
  */
 function test3NF(F,R){
     let break_F=[];
     // console.log(F)
     for (j=0;j<F.length;++j){
         let alpha=F[j][0];
         // console.log("alpha")
         // console.log(alpha)
         let beta=F[j][1];
         if(!beta_belong_alpha(alpha,beta) && !alpha_is_superKey(alpha,F,R) && !b_minus_a_contain_candidatKey(alpha,beta,F,R)){
             break_F[break_F.length]=[alpha,beta];
         }
     }
     return break_F;
 }
 // console.log(test3NF(F,R))
 
 //--------------------------------------3NF分解----------------------------------------
 
 /**
  * @description 此函数用来按照元素的长度升序排序
  * @returns {array} 排序后的表
  */
 function sort_by_length(result){
     result.sort(function(a,b){
         return a.length-b.length;
     })
     return result
 }
 //console.log(sort_by_length([[1],[1,2],[1,2,3],[1,3,4],[1,4]]))
 
 /**
  * @description 此函数用来删除有重复元素的表
  * @returns {array} 删后的表
  */
 function del_element(result){
     sort_by_length(result);
     let del_index=0;
     while(del_index<result.length){
         let temp=result.slice(0);//浅拷贝
         // console.log("before");
         // console.log(temp);
         result.splice(del_index,1);
         let state=false;
         // console.log("after");
         // console.log(temp);
         for(subs_i=0;subs_i<result.length;++subs_i){
             // console.log("temp[del_index]");
             // console.log(temp[del_index]);
             // console.log("result[subs_i]");
             // console.log(result[subs_i]);
             if(isArraySubset(temp[del_index],result[subs_i])){
                 state=true;
             }
         }
         if(! state){
             result=temp;
             del_index+=1;
         }
         
     }
     return result;
 }
 //console.log(del_element([[1],[1,2],[1,2,3],[1,3,4],[1,4]]))
 
 /**
  * @description 此函数用来根据3NF拆表
  * @returns {array} 拆后的表
  */
 function decomposition3NF(F,R){
     let result_d=[];
     Fc=computeCanonicalCoverSet(F);
     // console.log("FC");
     // console.log(Fc)
     for(fc_i=0;fc_i<Fc.length;++fc_i){
         result_d[result_d.length]=Fc[fc_i][0].concat(Fc[fc_i][1]);
     }
     // console.log("result_d");
     // console.log(result_d)
     cKey=calculateCandidateKeySet(R,F);
     for(cand_i=0;cand_i<cKey.length;++cand_i){
         result_d[result_d.length]=cKey[cand_i];
     }
     // console.log("cKey");
     // console.log(cKey)
     result_d=del_element(result_d);
     return result_d;
 }
 // F=[[[1,2],[3,4]],[[2],[3]],[[1,3],[2]]]
 // R=[1,2,3,4]
 // console.log(decomposition3NF(F,R))
 
 
 //--------------------------汇总-----------------------------------------------------
 /**
  * @description 此函数整合3NF的函数，先检验，再生成符合3NF的表。输出是否破坏3NF，如果破坏，哪些函数依赖破坏3NF。
  * @returns {array} 符合3NF的表
  */
 function ThreeNF(F,R){
     let breakList=test3NF(F,R);
     if(breakList!=[]){
         console.log("存在函数依赖破坏3NF。破坏3NF的函数依赖：");
         console.log(breakList);
         return decomposition3NF(F,R);
     }
     else{
         console.log("该表符合3NF。");
         return R;
     }
 }
 // F=[[[1,2],[3,4]],[[2],[3]],[[1,3],[2]]]
 // R=[1,2,3,4]
 // console.log(ThreeNF(F,R) )

