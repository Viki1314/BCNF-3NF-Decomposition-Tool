R = ['A','B','C','D','E','F']

F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

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
console.log('function dependency union test',functionDependencyUnion([[['A'],['B']],[['A'],['C']]]),'\n');

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
unionF = [[['A'],['B']],[['B'],['C']],[['A','C'],['D']]];
console.log('left extranuous elimination',eliminateLeftExtraneous(unionF),'\n');

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
unionF = [[['A'],['B']],[['B'],['C']],[['A'],['C','D']]];
console.log('right extranuous elimination',eliminateRightExtraneous(unionF),'\n');


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
F = [[['A'], ['B','C']], [['B'], ['C']], [['A'], ['B']], [['A','B'], ['C']]]
canonicalCoverF = computeCanonicalCoverSet(F);
console.log('canonical cover set F is',canonicalCoverF,'\n');

