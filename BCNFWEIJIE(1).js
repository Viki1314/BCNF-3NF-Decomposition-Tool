function check_NontrivialDependencyCaseViolationOfBCNF(s, schemaR, F) {
    /*
      检查不常用（non-trivial）依赖s是否导致不符合BCNF
      :param s: F中的一个在schemaR上的非平凡依赖;ex:[['A'],['B']]
      schemaR: list,表的属性;ex:['A','B','C','D','E','F']
      :return:boolean,Truvare:符合BC范式；False：违背BC范式
    */
  
    var s_plus_set = new Set(calculate_single_attribute_closure(s[0], F));
    var R_set = new Set(schemaR);
  
    return R_set.issubset(s_plus_set);
  }


  function check_schemaInBCNF(schemaR) {
    let result = true;
    let vio = null;
    for (let i = 0; i < this.F.length; i++) {
        let alpha_set = new Set(this.F[i][0]);
        let beta_set = new Set(this.F[i][1]);
        if (!beta_set.isSubset(alpha_set) && alpha_set.union(beta_set).isSubset(new Set(schemaR))) {
            if (!this.check_NontrivialDependencyCaseViolationOfBCNF(this.F[i], schemaR)) {
                vio = this.F[i];
                result = false;
                break;
            }
        }
    }
    return [result, vio];
}


function get_nontrival(dependency) {
    /*
    去除dependency中的平凡依赖，保存非平凡依赖
    :param dependency: 函数依赖集（3-dimension list）
    :return: 非平凡依赖集，3-dimension list
    */
    var result = [];
    for (let i of dependency) {
      if (!new Set(i[1]).issubset(new Set(i[0]))) {
        result.push(i);
      }
    }
    return result;
  }


  function BCNF() {
    var result = [this.R];
    var done = false;
    let test = 0;
    let step = { 'root': this.R };
    let decompose_times = 0;
    let F_plus = calculate_function_dependency_closure_set_by_armstrong_axioms(this.R, this.F);
    
    while (!done) {
      let allBCNF = true;
      for (let i = 0; i < result.length; i++) {
        let temp_R = result[i];
        let temp_R_set = new Set(temp_R);
        let temp_done = false;
        let [bc, vio] = this.check_schemaInBCNF(temp_R);
        if (!bc) {
          allBCNF = false;
          let alpha = vio[0];
          let beta = vio[1];
          let alpha_set = new Set(alpha);
          let beta_set = new Set(beta);
          if (alpha_set.has(beta_set)) {
            let decompose = true;
            for (let j = 0; j < F_plus.length; j++) {
              if (F_plus[j][0] === alpha && F_plus[j][1] === temp_R) {
                decompose = false;
                break;
              }
            }
            if (decompose) {
              let temp_step = step;
              for (let i = 0; i < decompose_times; i++) {
                temp_step = step['right'];
              }
              decompose_times += 1;
              temp_step['decompose_dependency'] = vio;
              result.splice(i, 1);
              result.push(Array.from(alpha_set.union(beta_set)));
              temp_step['left'] = Array.from(alpha_set.union(beta_set));
              result.push(Array.from(temp_R_set.difference(beta_set)));
              temp_step['right'] = { 'root': Array.from(temp_R_set.difference(beta_set)) };
            }
          }
        }
      }
      console.log(allBCNF, '\t', result, '\t', test, '\t', step, '\t', '\n');
      if (allBCNF) {
        done = true;
      }
    }
    return [result, step];
  }
  var R = [];
  var length = 4
  for (var i =1;i<length;i++){
      R.push(i);
  }
  var F = [[[1],[2]],[[2],[3]]];
  // answer：[[2, 3], [1, 2]]
  // for (i in F){
  //     console.log(i,F[i]);
  // }
  // console.log(R);
  // console.log(F);
  
  var bcnf = BCNF(R,F,true);
  var result = bcnf[0];
  var step = bcnf[1];
  console.log(result);
  console.log(step);