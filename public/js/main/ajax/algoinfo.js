$(function(){

  // 각각의 케이스를 테스트시킬 버튼 생성
  create_testcase_remote = function(count){
    let $remote = $('div.single-testcase'),
        index = 1,
        end = count;

    $remote.empty();
    for(; index <= count; index++){
      let caseName = 'case-'+index;
      let tag = `<button class='test-event ${caseName} hidden' type='button' onClick='single_test("${caseName}")'>${caseName}</button>`
      $remote.append(tag);
    }
  }

  // 문제 상세 정보 가져오기
  ajax_get_algo_info = function($elements, data){
    $.ajax({
      url:`/ajax/question/${data.qNo}`,
      type:'GET',
      error:function(error){
        console.log(error);
      },
      success: function(result){
        if(result.result===true){
          let question = result.data;

          // 문제 정보
          // single-line data
          $elements.detail.no.text(question.no);
          $elements.detail.subject.text(question.subject);
          // $elements.detail.author.text(question.regno);
          $elements.detail.author.text(question.name);
          $elements.detail.date.text(question.date);

          // multi-line data
          $elements.detail.text.empty();
          $elements.detail.text.append(question.text);

          $elements.detail.input_info.empty();
          $elements.detail.input_info.append(question.input_info);

          $elements.detail.output_info.empty();
          $elements.detail.output_info.append(question.output_info);

          $elements.detail.testcase.empty();
          $elements.detail.testcase.append(question.testcase);

          // 대쉬보드
          // 대쉬보드 onClick 이벤트 셋팅
          $elements.score.challenger.attr({'onClick':`updateDashboardList.get('challenger', 1)`});
          $elements.score.perfect.attr({'onClick':`updateDashboardList.get('perfect', 1)`});
          $elements.score.persent.attr({'onClick':`updateDashboardList.get('persent', 1)`});
          $elements.score.c.attr({'onClick':`updateDashboardList.get('c', 1)`});
          $elements.score.java.attr({'onClick':`updateDashboardList.get('java', 1)`});
          $elements.score.python.attr({'onClick':`updateDashboardList.get('python', 1)`});

          // 데이터 셋팅
          $elements.score.challenger.find('div > a').text(question.challenger_count);
          $elements.score.perfect.find('div > a').text(question.perfect_count);
          $elements.score.persent.find('div > a').text(question.current_persent);
          $elements.score.c.find('div > a').text(question.lang_c_count);
          $elements.score.java.find('div > a').text(question.lang_java_count);
          $elements.score.python.find('div > a').text(question.lang_python_count);

          create_testcase_remote(question.testcase_count);
        }
      },
      complete: function(){
        
      },
    });
  };
  ajax_get_default_source = function(editor, language, qNo){
    $.ajax({
      url:'/ajax/questions/default',
      type:'GET',
      data: {
        'language': language,
      },
      success:function(result){
        if(result.result){
          // 성공
          // line이 10줄 미만이면 탭 에러남
          editor.set(result.data);
        } else {
          // 실패
          editor.set('');
        }
      },
      complete:function(){
        editor.editor.focus();
      }
    });
  }

  // 내가 푼 문제에 등록
  // 문제별로 폴더를 생성해주려고 만든건데,
  // 소스코드를 디비에 저장하면 이건 필요 없는 듯..?
  // ajax_put_algo = function(){
  //   $.ajax({
  //     url:"/ajax/solve/",
  //     type:"POST",
  //     data:{
  //       'algoNo':userState.state.data.algoNo,
  //       'algoName':userState.state.data.algoName,
  //     },
  //     error:function(error){
  //       console.log(error);
  //     },
  //     success:function(result){
  //       if(result.result){
  //         console.log("[success-my-algo]");
  //       } else{
  //         console.log("[fail-my-algo]");
  //       }
  //     },
  //     complete:function(){
  //
  //     }
  //   });
  // };
});
