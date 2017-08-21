$(document).ready(function(){
  const SHOW_CLASS = 2;
  let $elements = {
    'contents':{
      'left':{
        'selectedalgo':$('ul.left-contents.selected-algo-name'),
      },
      'right':{
        'all':$('ul.right-contents'),
        'scroll':$('section.scroll-contents'),
      },
    },
    'title':{
      'left':{
        'selectedalgo':$('.left-title.selected-algo-name'),
      },
      'right':{
        'all':$("li.right-title"),
        'editor':$('li.right-title.editor'),
      },
    },
    'questionInfo':{
      'score':{
        'challenger': $('li#challenger-score'),
        'perfect': $('li#perfect-score'),
        'persent': $('li#persent-score'),
        'c': $('li#lang-c-score'),
        'java': $('li#lang-java-score'),
        'python': $('li#lang-python-score'),
      },
      'detail':{
        'body':$('ul.right-contents.selected-algo-name section.question-info'),
        'no':$('p.simple-info.no'),
        'subject':$('p.simple-info.subject'),
        'author':$('p.simple-info.author'),
        'date':$('p.simple-info.date'),
        'text': $('div.contents-data'),
        'input_info':$('div.input-info-data'),
        'output_info':$('div.output-info-data'),
        'testcase':$('div.question-info.testcase'),
      },
    },
    'solve':$("input.btn-algo-solve"),
  }

  // 타이틀 && 콘텐츠 선택 이벤트
  $elements.title.right.all.on('click', function(event){
    event.preventDefault();
    let $this = $(this);

    // 보여줄 클래스
    let showClass = $this.attr('class').split(" ")[SHOW_CLASS];
    let $showContents = $('ul.right-contents.' + showClass);

    // 현재 오른쪽에 보여지는 아이템 저장
    userState.state.location.right = showClass;
    console.log('[userState-location-right]', userState.state.location);

    let isMineAlgo = userState.state.location.left === 'my-algo-list';
    let data = {
      'rows': userState.dashboard.rows, // 출력시킬 데이터 수
      'qNo': userState.data.algorithm.no,
      'mNo': isMineAlgo === true ? userState.data.info.no : 0,
      'isMineAlgo': isMineAlgo,
    };
    updateDashboardList.set(data);

    if($this.hasClass('selected-algo-name')){
      ajax_get_algo_info($elements.questionInfo, data); // 문제 정보 가져오기
      // ajax_get_dashboard($elements.dashboard, data);  // 대쉬보드 가져오기
      $elements.contents.right.scroll.scrollTop(0);
    }

    // 선택한 타이틀에 [selected] 속성 삽입
    $elements.title.right.all.removeClass('selected');
    $this.addClass('selected');

    // 현재 탭이 [hidden] 클래스를 가지고 있다면 제거하여 보여줌.
    if($this.hasClass('hidden')){
      $this.removeClass('hidden');
      $this.addClass('selected');
    }
    // 선택한 타이틀에 해당되는 콘텐츠를 보여줌
    if($showContents.hasClass('hidden')){
      $elements.contents.right.all.addClass('hidden');
      $showContents.removeClass('hidden');
      $showContents.scrollTop(0);
    }
  });

  // 문제 풀기 버튼 클릭 이벤트
  $elements.solve.click(function(){
    let language = userState.data.editor.language;
    ajax_get_default_source(main_editor, language);  // 에디터에 기본 소스코드 가져오기
    // ajax_put_algo();    // 내가 푼 문제에 등록

    // right-contents에 있던 문제 정보를
    // left-contents로 복사
    $elements.contents.left.selectedalgo.empty();
    $elements.questionInfo.detail.body.clone().appendTo($elements.contents.left.selectedalgo);

    // 탭이 변경되었다는 것을 알려줌
    $elements.title.left.selectedalgo.click();
    $elements.title.right.editor.click();
  });
});
