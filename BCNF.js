// import *  as mymodule from "G:\SCUT2\github_project\DataBase\functionDependencyClosureSet.js";

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
  var subsetsWithX = subsets.map(subset => subset.concat(x));
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
  for (const attribute of R) {
    var reflexiveItem = [[attribute],[attribute]];
    if (! reflexiveItem_is_subset_of_newF(reflexiveItem,newF)) {
      newF.push([[attribute], [attribute]]);
    }
  }
  return newF;
}

// //测试reflexive rule
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

// //测试augmentation rule
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
  
// //测试transitivity rule
// varR = ['A','B','C']
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
      return listA.every((elem) => listB.includes(elem));
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
    
    
    
    
    
    
// //测试Armstrong axioms
// R = ['A','B','C','G','H','I']
// F = [[['A'],['B']], [['A'],['C']], [['C','G'],['H']], [['C','G'],['I']], [['B'],['H']]]
// F_new = calculateFunctionDependencyClosureSetByArmstrongAxioms(R,F)
// for (let i in F_new){
//   console.log(F_new[i]);
// }
//---------------------------------------------------BCNF-------------------------------------------------------------

function isSuperset(set, subset) {
  for (let elem of subset) {
      if (!set.has(elem)) {
          return false;
      }
  }
  return true;
}
function union(setA, setB) {
  let _union = new Set(setA);
  for (let elem of setB) {
      _union.add(elem);
  }
  return _union;
}

function intersection(setA, setB) {
  let _intersection = new Set();
  for (let elem of setB) {
      if (setA.has(elem)) {
          _intersection.add(elem);
      }
  }
  return _intersection;
}
function difference(setA, setB) {
  let _difference = new Set(setA);
  for (let elem of setB) {
      _difference.delete(elem);
  }
  return _difference;
}

function isdisjoint(alpha_set,beta_set){
    // console.log(intersection(alpha_set,beta_set).size);
    return intersection(alpha_set,beta_set).size==0? true:false;
}
function check_NontrivialDependencyCaseViolationOfBCNF(s,schemaR,F){
    /*
    description:检查不常用（non-trivial）依赖s是否导致不符合BCNF
    :param s:F中的一个在schemaR上的非平凡依赖;ex:[['A'],['B']]
        schemaR:list,表的属性;ex:['A','B','C','D','E','F']
    :return:boolean,True:符合BC范式；False：违背BC范式
    */
    var s_plus_set = new Set(calculateSingleAttributeClosure(s[0],F));
    // console.log(s,'s+:',s_plus_set);
    var R_set = new Set(schemaR);
    // console.log('isSuperset(s_plus_set, R_set)---',isSuperset(s_plus_set, R_set));
    return isSuperset(s_plus_set, R_set);
}
    
    
function check_schemaInBCNF(schemaR,F){
    /*
    decription:检查schena是否符合BC范式
        :param schemaR: list,表的属性;ex:['A','B','C','D','E','F']
        :return: result:boolean,True:符合BC范式；False：违背BC范式
                vio:array,违背BC范式的依赖
    */
    var result = true;
    var vio =[] ;
    for (i in F){
        // console.log(i);
        var alpha_set = new Set(F[i][0]);
        var beta_set = new Set(F[i][1]);
        // console.log('isSuperset(alpha_set,beta_set):',isSuperset(alpha_set,beta_set));
        // console.log('union(alpha_set,beta_set):',union(alpha_set,beta_set));
        // console.log('isSuperset(union(alpha_set,beta_set),set(schemaR)):',isSuperset(new Set(schemaR),union(alpha_set,beta_set)));
        // 保证该依赖是非平凡依赖且在Ri中，可以被分解
        if (!(isSuperset(alpha_set,beta_set)) &&  isSuperset(new Set(schemaR),union(alpha_set,beta_set))){
            // console.log(i,'\t',F[i],'\t',!(check_NontrivialDependencyCaseViolationOfBCNF(F[i],schemaR,F)));
            if (!(check_NontrivialDependencyCaseViolationOfBCNF(F[i],schemaR,F))){
                vio = F[i];
                result = false;
                // console.log(i);
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



var R = [];
var length = 4
var F = [[[1],[2]],[[2],[3]]];
// answer：[[2, 3], [1, 2]]
length = 12;
F = [[[1],[2,3,4]],[[8,9],[10]],[[1,5,6,7],[8,9,11]]];//#answer:[{1, 2, 3, 4}, {8, 9, 10}, {1, 5, 6, 7, 8, 9, 11}]
// length = 5;
// F = [[[2],[3]],[[2],[4]]]//[[2,3,4],[1,2]]
length = 6;
F = [[[1],[2,3]],[[3,4],[5]],[[2],[4]],[[5],[1]]];
// for (i in F){
//     console.log(i,F[i]);
// }
// console.log(R);
// console.log(F);

for (var i =1;i<length;i++){
    R.push(i);
}
var bcnf = BCNF(R,F,true);
var result = bcnf[0];
var step = bcnf[1];

console.log('\n\n result-----\n','BC分解结果：',result);
console.log('分解过程：\n',step);
// console.log(step.constructor);

console.log('------false-------');
var bcnf_1 = BCNF(R,F,false);
var result_1 = bcnf_1[0];
var step_1 = bcnf_1[1];
console.log('\n\n result_false-----\n','BC分解结果：',result_1);
console.log('分解过程：\n',step_1);
// console.log(step_1['right']['right']);
// console.log(step.constructor);
//
//测试transitivity rule
// R = ['A','B','C']
// F = [[['A'],['B']],[['B'],['C']]]
// F = [[[1],[2,3,4]],[[8,9],[10]],[[1,5,6,7],[8,9,11]]];
// F_closure_set = calculateFunctionDependencyClosureSetByAttributeClosureSet(F);
// console.log('F closure set is \n', F_closure_set,'\n');

// F_plus = calculateFunctionDependencyClosureSetByArmstrongAxioms(R,F);
// console.log('F closure set is \n', F_closure_set,'\n');