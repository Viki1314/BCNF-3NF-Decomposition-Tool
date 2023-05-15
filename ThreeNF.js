R = ['A','B','C','D','E','F']

F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]


/**
 * ----------------------------preparation----------------------------------------------------------------------------------------
 */
//--------------------------attributeClosure------------------------------------
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

//-----------------------------candidateKey---------------------------------------
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
 * @description 此函数用来判断list A是不是list B的子集
 * @param {array} listA - A list
 * @param {array} listB - B list
 * @returns {bool} 如果A为B的子集，返回true; 反之返回false 
 */
function isArraySubset(listA, listB) {
  if(listA.length===0){
    return true;
  }
  for(i=0;i<listA.length;++i){
    if(! listB.includes(listA[i])){
        //console.log(listA[i]);
        return false;
    }
  }
  return true;
//   console.log()
//   return listA.every(elem => listB.includes(elem));
}

// console.log(" PPPPP"+isArraySubset([[1,2],[3]],[[1,2],[3],[4]]))
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


//--------------------------Fc--------------------------------------
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
// console.log("QQQQ")
// console.log(alphaEqualsAlpha_i([['A'],['B']], [['A'],['B']]))//二维不行

/**
 * @description 此函数用来判断例如[['A'],['B']]是不是[[['A'],['B']],[['B'],['C']]]的元素
 * @param {array} item - F中的item
 * @param {array} F - 函数依赖集合
 * @returns {bool} 如果为的子集，返回true; 反之返回false 
 */
function itemIsSubsetOfF(item, F){
    return F.some(subArr => JSON.stringify(subArr) === JSON.stringify(item))

}

// //qqx写的一版
// function itemIsSubsetOfF(item,F){
//     for(i=0;i<F.length;++i){
//         if(item.toString()==F[i].toString()){
//             return true;
//         }
//     }
//     return false;
// }
//test
// console.log("AAAAAA")
// console.log(itemIsSubsetOfF([['A'],['B']],[ [ [ 'A' ], [ 'B' ] ] ,[ [ 'A' ], [ 'C' ] ] ]))


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
// console.log("IIIIII")
// console.log(functionDependencyUnion([[[1],[2]],[[2],[3]],[[1],[3]]]))

/**
 * 这个函数应该和前面那个isArraySubset重复了。可以删掉。后面有几个引用都是在求Fc这一块的
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