R = ['A','B','C','D','E','F']

F = [[['A'],['B']],[['B'],['C','D']],[['D'],['E']],[['C','E'],['F']]]

/**
 * @description ���ڼ��㵥�����������Ահ�
 * @param {array} originalAlpha - ��Ҫ����հ���alpha
 * @param {array} F - ������������
 * @returns {array} �������Ահ�alpha+
 */
function calculateSingleAttributeClosure(originalAlpha, F) {
    // ����ԭʼ�� alpha ����
    let alpha = originalAlpha.slice();
    if (alpha.length === 0) {
      return [];
    }
    // ��ʼ���������Ϊ alpha
    let result = alpha.slice();
    while (true) {
      for (let [alpha_i, beta_i] of F) {
        // ��� alpha_i �� result ���Ӽ�
        if (alpha_i.every((value) => result.includes(value))) {
          // �� beta_i �в��� result �е�Ԫ�ؼ��� result
          for (let b of beta_i) {
            if (!result.includes(b)) {
              result.push(b);
            }
          }
        }
      }
      // ���������ٸı䣬˵���������
      if (result.every((value) => alpha.includes(value))) {
        break;
      }
      // ������� alpha������������ͱȽ�
      alpha = result.slice();
    }
    return result;
  }

closure_of_A = calculateSingleAttributeClosure(['A'],F)
console.log('closure of A is ',closure_of_A,'\n')

/**
 * @description �����������е����Ահ�
 * @param {array} F - ������������
 * @returns {array} �������Ահ�����{alpha+}
 */
function calculateAttributeClosureSet(F) {
    // to store all attribute closures ����洢���е����Ահ�
    let attributeClosureSet = [];
    for (let [alpha, beta] of F) {
        let result = calculateSingleAttributeClosure(alpha, F);
        // to eliminate duplicate attribute closure �����Ահ�δ�ظ��������
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

// calculate all attribute closures
let attributeClosureSet = calculateAttributeClosureSet(F);

// print all attribute closures
console.log('all attribute closures are')
for (let [alpha, alphaClosure] of attributeClosureSet) {
    console.log(alpha, " --> ", alphaClosure);
}
console.log('\n')


/**
 * @description ͨ�����Ահ����ϼ�ӵصõ����������հ�����
 * @param {array} F - ������������
 * @returns {array} ���غ��������հ�����{F+}
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

F_closure_set = calculateFunctionDependencyClosureSetByAttributeClosureSet(F);
console.log('F closure set is \n', F_closure_set,'\n');





