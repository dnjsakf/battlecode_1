module.exports = function(conn, myNo, otherNo, callback){
  var path = require('path');
  // 1. 소스코드 가져오기.
  // 2. 각각의 소스에서 사용된 함수 걸러내기.
  // 3. 함수 사용 빈도 비교하기.

  // state는 두개가 존재하고,
  // state가 무조건 존재하는 것을 전재로 함.
  var sql = 'SELECT no, sourceCode FROM qState WHERE no IN (?, ?)';
  conn.query(sql, [myNo, otherNo], function(error, result){
    if(error){
      // 실패
      console.error('[compare-error]', error);
      callback(error, null);
    } else {
      // 성공
      let mySource,
          otherSource;
      if(result[0].no === myNo){
        var MY = 0,
            OTHER = 1;
      } else {
        var MY = 1,
            OTHER = 0;
      }

      // 1. 소스코드 가져오기
      mySource = result[MY].sourceCode;
      otherSource = result[OTHER].sourceCode;
      // console.log('[mysource]', mySource);
      // console.log('[othersource]', otherSource);

      // 2. 함수 걸러내기
      let results = {
        'my' : findFunctions(mySource),
        'other' : findFunctions(otherSource)
      };

      // 3. 비교하기
      results['result'] = compare(results);

      console.log('[finish-compare]');
      // console.log(results);

      callback(null, results);
    }
  });
}

// 2. 함수 걸러내기
let findFunctions = function(sourceCode){
  //  가. 줄 단위로 잘라내기
  let sourceSplit = sourceCode.split(/(?!<\\)\n/gm);

  let functions = {
    '^func-type-count$':0,    // 함수 종류
    '^func-exec-count$': 0,   // 실행된 함수의 총합
  }
  //   나~다.
  let findString =  /(([\'\"]).*?\2)/;    // 문자열 탐색 패턴
  let findFunction = /((?:\.?[a-zA-Z_]+[a-zA-Z0-9_]*)+) *(?=\()/gm; // 함수 탐색 패턴
  for(let sIndex in sourceSplit){
    //  나. 문자열 제거
    // console.log('[before]', sourceSplit[sIndex]);
    let row = sourceSplit[sIndex].replace(findString, '');
    // console.log('[affter]', row);

    // 다. 함수 찾아서 저장하기
    let foundFunc = row.match(findFunction);
    for(let fIndex in foundFunc){
      let func = foundFunc[fIndex];
      // functions Object 에 func가 존재하는지 체크
      if(Object.keys(functions).indexOf(func) > -1){
        // 존재하면, 1씩 증가
        functions[func] += 1;
      } else {
        // 존재하지 않으면, 0으로 초기화
        functions[func] = 1;
        functions['^func-type-count$'] += 1;
      }
      functions['^func-exec-count$'] += 1;
    }
  }
  // console.log(`[results]`);
  // console.log(functions);
  return functions;
}

let changer = function(big, small){
  let temp = 0;
  if(big > small){
    temp = big;
    big = small;
    small = temp;
  }
  return [big, small];
}

let compare = function(userFunctions){
  let myFuncs = userFunctions.my,
      otherFuncs = userFunctions.other;

  // 반환할 결과를 담을 변수
  let compareResult = {
    'total':0
  }
  // 계산을 제외할 키값
  let exceptFunc = ['^func-type-count$','^func-exec-count$'];

  let otherLength = Object.keys(otherFuncs).length;
  for(let otherKey in otherFuncs){
    // otherKey가 myKey에 있어야함.
    if(Object.keys(myFuncs).indexOf(otherKey) !== -1){
      let changed = changer(myFuncs[otherKey], otherFuncs[otherKey]); // 음수값 방지
      let myValue = changed[0],
          otherValue = changed[1];

      // 결과 저장
      compareResult[otherKey] = parseFloat((myValue / otherValue * 100).toPrecision(2));
    } else {
      //
      compareResult[otherKey] = 0;
    }
    compareResult['total'] += compareResult[otherKey] * (1/otherLength);
  }
  compareResult['total'] = parseFloat(compareResult['total'].toPrecision(2));
  return compareResult;
}
