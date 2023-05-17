function check_NontrivialDependencyCaseViolationOfBCNF(s,schemaR,F)
    /*
    description:检查不常用（non-trivial）依赖s是否导致不符合BCNF
    :param s:F中的一个在schemaR上的非平凡依赖;ex:[['A'],['B']]
        schemaR:list,表的属性;ex:['A','B','C','D','E','F']
    :return:boolean,True:符合BC范式；False：违背BC范式
    */
    var s_plus_set = Set(calculateSingleAttributeClosure(s[0],F));
    var R_set = Set(schemaR)
    return isSuperset(s_plus_set, R_set);
    
function check_schemaInBCNF(schemaR,F)
    /*
    decription:检查schena是否符合BC范式
        :param schemaR: list,表的属性;ex:['A','B','C','D','E','F']
        :return: result:boolean,True:符合BC范式；False：违背BC范式
                vio:array,违背BC范式的依赖
    */
    var j;
    var reuslt = true;
    var vio ;
    for (i in F){
        alpha_set = Set(i[0]);
        beta_set = Set(i[1]);
        if (!(isSuperset(alpha_set,beta_set)) &&  (isSuperset(union(alpha_set,beta_set),set(schemaR)))){
            if (!(check_NontrivialDependencyCaseViolationOfBCNF(i,schemaR,F))){
                vio = i;
                result = false;
                break;
            }
        }
    }
    return [result,vio];

function get_nontrival()