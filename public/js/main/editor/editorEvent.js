$(document).ready(function(){
  let $elements = {
    'language':{
      'select':$("select.languageSelector"),
    },
    'testcase':{
      'result': $('div.testcase-result'),
    }
  };

  // set editor lagnauge;
  $elements.language.select.change(function(){
    let language = $(this).children("option:selected").val().toLowerCase(),
        algoNo = userState.data.algorithm.no;

    userState.data.editor.language = language;

    ajax_get_default_source(main_editor, language);
  });

  // editor contents 하단에 보여지는 부분인데,
  // 딱히 쓸모가 없을 듯
  let option_title = $('dt.option-title');
  option_title.click(function(){
    const SHOW_OPTION_NAME = 1;
    let this_class = $(this).attr('class').split(" ");

    // click color setting
    option_title.removeClass('selected');
    $(this).addClass('selected');

    // all item add hidden
    let hidden_option_item_name = "dd.option-item";
    $(hidden_option_item_name).addClass('hidden');

    // this item remove hidden
    if(this_class[SHOW_OPTION_NAME]){
      let show_option_item_name = hidden_option_item_name+"."+this_class[SHOW_OPTION_NAME];
      $(show_option_item_name).removeClass('hidden');
    }
  });

  /******************************/
  /******** testcase.js *********/
  /******************************/
  all_test = function(){
    $elements.testcase.result.empty();
    let promise_compile = [],
        buttons = $('.single-testcase button'),
        index = 0,
        end = buttons.length;

    for(;index < end; index++){
      let pro_item = single_test(buttons.eq(index).text());
      promise_compile.push(pro_item);
    }

    // 최종결과 계산
    let current_res = 0;
    Promise.all(promise_compile).then(function(data){
      let total = 0

      for(let i in data){
        total += data[i].compile_result.persent;
      }

      current_res = total / Object.keys(data).length;

      let save_data = {
        'qNo': userState.data.algorithm.no,
        'mNo': userState.data.info.no,
        'language': userState.data.editor.language,
        'sourceCode': main_editor.editor.getValue(),
        'result': current_res,
      }

      console.log('[save-data]');
      console.log(save_data);

      let promise_save = ajax_compile_result_save(save_data);
      promise_save.done('save completed');
    });
  }

  single_test = function(compile_case){
    $elements.testcase.result.empty();
    // algono, algoName은 버튼에서 가져와도 될듯한데?
    let algoNo = userState.data.algorithm.no,
        algoName = userState.data.algorithm.name,
        compiler = userState.data.editor.language;

    let $testcase = $('ul.left-contents div.case-row.' + compile_case),
        $inputData = $testcase.find('td.input.data'),
        $outputData = $testcase.find('td.output.data');

    let compile_data = {},
        _inputData = {},
        _outputData = {};

    // input
    for(let i=0; i < $inputData.length; i++){
      _inputData[i+1] = $inputData.eq(i).text();
    }
    // output
    for(let j=0; j < $outputData.length; j++){
      _outputData[j+1] = $outputData.eq(j).text();
    }

    // set_data
    compile_data.testcase = compile_case;               // testcase 이름
    compile_data.algoNo = algoNo;                         // 풀고 있는 문제 번호
    compile_data.algoName = algoName;                     // 풀고 있는 문제 이름
    compile_data.input = _inputData;                      // test input
    compile_data.output = _outputData;                    // test output
    compile_data.compiler = compiler;                     // 현재 선택된 language
    compile_data.editor = main_editor.editor.getValue();    // source-code

    console.log('[compile_data]');
    console.log(compile_data);

    let promise = _ajax_compile(compile_data)
      .done(function(data){
        let res = data.compile_result;
        $elements.testcase.result.append('<p>' + compile_case+'-'+ res.persent +'</p>');
      });

    // console.log(`${compile_case} ajax - for end`);
    return promise;
  };
});
