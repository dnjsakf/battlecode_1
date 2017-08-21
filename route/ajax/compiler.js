module.exports = function(conn){
  /************************/
  /******** 컴파일러 *******/
  /************************/
  /*  손 많이 봐야됨
   *   1. 소스코드 저장은 계속 해줘야하나? 자바스크립트에서 저장하면 한번이긴 함.
   *   2.
   */
  let route = require('express').Router(),
      fs = require('fs-extra'),
      path = require('path'),
      myf = require('../../config/myFunctions.js');

  let rootFolder = path.join(__dirname,"../../data/users/");
  let filename = {
    'python':'python.py',
    'c':'c.c',
    'java':'java.java',
    'undefined':'error.txt'
  };
  let current_persent = 0;
  route.post('/compile', function(req, res){
    let runTime = myf.timer();
    let session = req.session.passport.user;
    let compile = {
      'compiler':req.body.compiler,
      'data':{
        'testcase':req.body.testcase,
        'inputs':req.body.input,
        'outputs':req.body.output,
        'sourceCode':req.body.editor,
      },
      'user':{
        'no': session.info.no,
        'path':session.info.path,
      },
      'algo':{
        'no': req.body.algoNo,
        'name': req.body.algoName,
      },
      'path':{},
    };
    compile.path.dir = path.join(rootFolder, compile.user.path, compile.compiler);
    compile.path.file = path.join(compile.path.dir, filename[compile.compiler]);

    if(compile.data.testcase === 'case-1'){
      console.log("savePath", compile.path.file);
      fs.writeFileSync(compile.path.file, compile.data.sourceCode, 'utf8');
      if(compile.compiler === 'java'){
        let javaChild = require('child_process').spawn('javac', [compile.path.file]);
        javaChild.on('close', function(){
          console.log('[java-class-file-created]');
        });
      }
    }

    /************************/
    /** input/output check **/
    /************************/
    console.log("find I/O",compile.data.sourceCode.match(/input\(\)|(print\(.*\))/g));
    let sequence = compile.data.sourceCode.match(/(input\(\))|(print\(.*\))/g),
        userInputCounter = 0,
        userOutputCounter = 0,
        sequenceIndex = 0;
    for(sequenceIndex in sequence){
      if((/print\(.*\)/g).test(sequence[sequenceIndex])){
        sequence[sequenceIndex] = 'print';
        userOutputCounter += 1;
      } else {
        sequence[sequenceIndex] = 'input';
        userInputCounter += 1;
      }
    }
    console.log('I/O 순서', sequence);

    console.log("\n*******************************");
    console.log(`********* ${compile.data.testcase} **********`);
    console.log("******** compile start ********");
    console.log("*******************************");
    /**********************************/
    /********* compiler config ********/
    /**********************************/
    compile_task = function(callback){
      let compileResult = {
        'input': compile.data.inputs,
        'output': compile.data.outputs,
        'stdout': [],
        'result':[],
        'persent':0,
      };
      if(userInputCounter > compile.data.inputs.length){
        console.log("\n\n삐빅!! 사용자가 인풋을 너무 많이 입력하였습니다.!!!\n\n");
        callback("Too much input");
      } else{
        // java는 class파일 생성 후 컴파일 진행,
        // c는 exe파일 생성 후 컴파일 진행.
        let spawn = require('child_process').spawn;
        new Promise(function(resolve, reject){
          if(compile.compiler === 'java'){
            let option = ['-classpath', compile.path.dir, 'INIT_JAVA'];
            child = spawn(compile.compiler, option);
            resolve(child);
          } else if(compile.compiler === 'c'){
            child = spawn(compile.compiler,[compile.path.file]);
            resolve(child);
          } else if(compile.compiler === 'python') {
            child = spawn(compile.compiler,[compile.path.file]);
            resolve(child);
          }
          else{
            reject('child-error');
          }
        }).then(function(child){
          runTime.start();

          child.stdout.setEncoding("utf8");
          child.stderr.setEncoding("utf8");
          // child.stdout.pipe(process.stdout);
          // child.stdin.pipe(process.stdin);

          /*******************************/
          /************ stdin ************/
          /*******************************/
          if(compile.data.inputs !== null){
            for(let i in compile.data.inputs){
              console.log(`input[${parseInt(i)+1}] <${compile.data.inputs[i]}>`);
              child.stdin.write(`${compile.data.inputs[i]}\r\n`);
            }
          }
          child.stdin.end(function(){
            console.log('stdin.end()');
          });

          /*******************************/
          /************ stdout ***********/
          /*******************************/
          let stdoutCounter = 0;
          child.stdout.on('data', function(data){
            let splited = data.toString().split(/(\r?\n)/gm),
                splitedIndex = splited.length - 1;
            for(; splitedIndex >= 0; splitedIndex--){
              if((/(\r?\n)/gm).test(splited[splitedIndex]) || splited[splitedIndex] === ''){
                splited.splice(splitedIndex, 1);
              }
            }
            console.log("/*******************************/");
            console.log(`input(${stdoutCounter+1}/${compile.data.inputs.length})`);
            console.log("stdout:", splited);
            console.log("user_output <",splited[0],"> <", typeof splited[0],">");
            console.log("check_output <", compile.data.outputs[stdoutCounter],"> <", typeof compile.data.outputs[stdoutCounter],">");
            let stdoutIndex = 0;
            for(stdoutIndex in splited){
              compileResult.stdout.push(splited[stdoutIndex]);
            }
            stdoutCounter += 1;
          });
          child.stdout.on('end', function(){
            console.log("/*******************************/");
          });

          /*******************************/
          /************ stderr ***********/
          /*******************************/
          child.stderr.on('data', function(data){
            // 에러별로 리턴값 지정
            console.log("spawn.stderr:", data.toString());
          });

          /*******************************/
          /*********** child.on **********/
          /*******************************/
          child.on('error',function(error){
            callback(error, null);
            console.log('spawn.error', error);
          });
          child.on('exit', function(code){
            // console.log('spawn.exit', code);
          });
          child.on('close', function(code){
            // 컴파일 결과 : 런타임
            compileResult.runtime = runTime.end()+"ms";
            let outputResult = [],
                successCounter = 0,
                outputCheckerKey = '';
            for(outputCheckerKey in compile.data.outputs){
              console.log(`[${outputCheckerKey}] 컴파일 결과 => ${compile.data.outputs[outputCheckerKey]} === ${compileResult['stdout'][outputCheckerKey]}`);
              if(compile.data.outputs[outputCheckerKey] === compileResult.stdout[outputCheckerKey]){
                outputResult.push('success');
                successCounter += 1;
                console.log("정답\n");
              } else{
                outputResult.push('failed');
                console.log("오답\n");
              }
            }
            // 컴파일 결과 : output 확인 결과  ? success || failed
            compileResult.result = outputResult;
            compileResult.persent = ((successCounter / compileResult.result.length ) * 100);

            console.log("*******************************");
            console.log("********* compile end **********");
            console.log("*******************************");
            console.log("컴파일 결과");
            console.log(compileResult);
            callback(null, compileResult);
          });
        });
      }
    };

    // 컴파일 종료 후 이벤트 작성
    compile_task(function(error, result){
      if(error){
        res.send({compile_result:error, save:"fail"});
      } else {
        res.send({compile_result:result, save:"success"});
      }
    });
  });


  route.post('/compile/save', function(req, res){
    let saveData = req.body;
    saveData.date = require('moment')().format('YYYY-MM-DD');

    let splitedSource = saveData.sourceCode.split(/(?!<\\)\r?\n/gm),
        parseSource = {},
        sourceIndex = 0;
    for(sourceIndex in splitedSource){
      parseSource[parseInt(sourceIndex)+1] = splitedSource[sourceIndex];
    }
    saveData.sourceCode = JSON.stringify(parseSource);

    myf.myInsert(conn, 'qState', saveData, function(error, result){
      if(error){
        res.send({result:false, data:error});
      } else {
        question_dashbaord_update(conn, saveData.qNo, saveData.language, saveData.result);
        res.send({result:true, data:result});
      }
    });
  });
  return route;
}

let question_dashbaord_update = function(conn, questionNo, language, persent){
  let dbCounter = require('../../config/question_counter.js');
  let fields = {
    'total': 'challenger_count',
    'perfect': 'perfect_count',
    'language': {
      'c':'lang_c_count',
      'java':'lang_java_count',
      'python':'lang_python_count',
    },
    'persent': 'current_persent',
  }
  // total
  dbCounter.counter(conn, questionNo, fields.total, function(error, result){
    if(error){
      console.log('[counter-total-error]', error);
    } else {
      console.log('[counter-total-success]', result);
    }
  });
  // language-counter
  dbCounter.counter(conn, questionNo, fields.language[language], function(error, result){
    if(error){
      console.log(`[counter-${language}-error]`, error);
    } else {
      console.log(`[counter-${language}-success]`, result);
    }
  });
  if(parseInt(persent) === 100){
    // perfect-count
    dbCounter.counter(conn, questionNo, fields.perfect, function(error, result){
      if(error){
        console.log(`[counter-perfect-error]`, error);
      } else {
        console.log(`[counter-perfect-success]`, result);
      }
    });
  }
  // current_persent
  dbCounter.persent(conn, questionNo, fields.persent, function(error, result){
    if(error){
      console.log('[counter-persent-error]', error);
    } else {
      console.log('[counter-persent-success]', result);
    }
  });
}
