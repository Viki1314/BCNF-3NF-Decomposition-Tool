"""
preparation.ipynb的py文件版
方便bcnf和3nf分解调用
"""

def calculate_single_attribute_closure(original_alpha, F):
    """
    此函数用于计算单个属性的属性闭包
    ex:
    输入:['A'], F
    输出:['A','B','C','D','E','F']
    """
    alpha = original_alpha.copy()
    if alpha == []:
        return []
    result = alpha.copy()
    while True:
        for alpha_i, beta_i in F:
            #for α_i-->β_i, if α_i ⊂ result
            if set(alpha_i).issubset(result):
                # result = result ∪ α_i
                result.extend([b for b in beta_i if b not in result])
        #if not changed after a loop, the calculation is finished
        # 结果不再改变，说明属性闭包计算完成
        if result == alpha:
            break
        #if not finished, update alpha and continue calculations and comparisons
        # 结果有所改变，继续计算和比较
        alpha = result
    return result

def calculate_attribute_closure_set( F ):
    """
    用来计算所有的属性闭包
    ex.
    输入:函数依赖集合F
    输出:
    ['A']  -->  ['A', 'B', 'C', 'D', 'E', 'F']
    ['B']  -->  ['B', 'C', 'D', 'E', 'F']
    ['D']  -->  ['D', 'E']
    ['C', 'E']  -->  ['C', 'E', 'F']
    """
    #to store all attribute closures 用与存储所有的属性闭包
    attribute_closure_set = []
    for alpha, beta in F:
        result = calculate_single_attribute_closure(alpha, F)
        #to eliminate duplicate attribute closure 若属性闭包未重复，则添加
        if [alpha,sorted(result)] not in attribute_closure_set:
            attribute_closure_set.append([alpha,sorted(result)])
    return attribute_closure_set

def calculate_function_dependency_closure_set(F):
    """
    此函数用来计算函数依赖集合闭包F+
    """
    function_closure_set = []
    attribute_closure_set = calculate_attribute_closure_set(F)
    for alpha, beta in attribute_closure_set:
        for attribute in beta:
            function_closure_set.append([alpha, [attribute]])
    return function_closure_set

def get_subsets(s):
    """
    此函数用来计算集合的子集
    ex.
    输入:['A','B']
    输出:[[],['A'],['B'],['A','B']]
    """
    if not s:
        return [[]]
    x = s.pop()
    subsets = get_subsets(s)
    return subsets + [subset + [x] for subset in subsets]

def get_proper_subsets(s):
    """
    此函数用来计算集合的真子集
    ex.
    输入:['A','B']
    输出:[[],['A'],['B']]
    """
    s_copy = s.copy()
    temp = s.copy()
    subsets = get_subsets(temp)
    subsets.remove(s_copy)
    return subsets

def determine_candidate_key(alpha,F):
    """
    此函数用来判断属性集合是否为候选码
    ex.
    输入:['A'],F
    输出:True
    输入:['B']
    输出:False
    输入:['A','B']
    输出:False(此为超码而不是候选码)
    """
    if(set(R).issubset(calculate_single_attribute_closure(alpha,F))):

        proper_subsets_of_alpha = get_proper_subsets(alpha)
        sorted_proper_subsets_of_alpha = sorted(proper_subsets_of_alpha, key=len, reverse=True)

        is_candidate_key = True
        for item in sorted_proper_subsets_of_alpha:
            result = calculate_single_attribute_closure(item,F)
            if set(R).issubset(result):
                is_candidate_key = False
                break
        return is_candidate_key
    return False

def select_candidate_key(F):
    """
    此函数用来算出候选码
    ex.
    输出:['A']
    """
    candidate_key_set = []
    for alpha, beta in F:
        temp = alpha.copy()
        if(determine_candidate_key(alpha,F)):
            candidate_key_set.append(temp)
    return candidate_key_set

def function_dependency_union(F):
    """
    此函数返回合并后的函数依赖集合
    ex.
    F 中有 A-->B, B-->C, A-->C
    返回 A-->(B,C) , B-->C
    即 [[['A'], ['B', 'C']], [['B'], ['C']]]
    """
    union_F = []
    for alpha, beta in F:
        union_beta = beta.copy()
        for alpha_i, beta_i in F:
            if alpha == alpha_i:
                union_beta.extend([b for b in beta_i if b not in union_beta])
        if [alpha,sorted(union_beta)] not in union_F:
            union_F.append([alpha,sorted(union_beta)])
    return union_F

def eliminate_left_extraneous(union_F):
    """
    此函数用来剔除依赖关系集合F中左侧的extraneous attribute
    """
    for i, (alpha, beta) in enumerate(union_F):
        replace = [alpha, beta]
        for subset in get_proper_subsets(alpha):
            if subset:
                new_closure = calculate_single_attribute_closure(subset, union_F)
                if set(beta).issubset(new_closure) and (len(subset) < len(replace[0])):
                    replace = [subset, beta]
        union_F[i] = replace
    return union_F

def eliminate_right_extraneous(union_F):
    """
    此函数用来剔除依赖关系集合F中右侧的extraneous attribute
    """
    for i, (alpha, beta) in enumerate(union_F):
        replace = [alpha, beta]
        for subset in get_proper_subsets(beta):
            if subset:
                temp_union_F = union_F.copy()
                temp_union_F[i] = [alpha, subset]
                new_closure = calculate_single_attribute_closure(alpha, temp_union_F)
                if set(beta).issubset(new_closure) and (len(subset) < len(replace[1])):
                    replace = [alpha, subset]
        union_F[i] = replace
    return union_F

def compute_canonical_cover_set(F):
    """
    此函数用来获得依赖关系集合F的正则覆盖集
    ex.
    输入:F
    输出:F的正则覆盖集
    """
    F = function_dependency_union(F)
    F = eliminate_left_extraneous(F)
    F = function_dependency_union(F)
    F = eliminate_right_extraneous(F)
    return F