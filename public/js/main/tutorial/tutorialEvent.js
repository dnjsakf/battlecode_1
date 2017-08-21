$(function(){
  let $tutorialPopup = $('section.tutorial-popup'),
      $cursor = $('img#mouse-pointer'),
      $clickerPanel = $('section.tutorial-clicker-panel'),
      tutorialEvent,
      tutorialMyalgo;

  tutorialStart = function(){
    $tutorialPopup.removeClass('hidden');

    // let $tutorialProcess = {
    //   // 비회원
    //    0 : $('li.left-title.algo-list'),
    //    1 : $('li.algorithm').first(),         // <- 이게 동적으로 생성되서 타이밍잘 맞춰야됨
    //    2 : $('input.btn-algo-solve'),
    //    3 : $('div.CodeMirror'),
    //    4 : $('button.test-event.all'),
    //    5 : $('div.testcase-result'),
    // };
    // let defaultOptions = {
    //   'autoClick': true,
    //   'autoTyping': {
    //     'index':3,
    //     'editor':main_editor,
    //     'text': 'a, b = map(int, input().split());\nprint(a - b);',
    //   },
    // };
    // tutorialEvent = new MouseMove();
    // tutorialEvent.init($cursor, $clickerPanel, $tutorialProcess);
    // tutorialEvent.setOptions(defaultOptions);
    let $myalgo = {
      // 비회원
       0 : $('li.left-title.my-algo-list'),
       1 : $('li.algorithm.isMine').first(),
       2 : $('ul.dashboard').parents('nav'),
       3 : $('li#challenger-score'),
       4 : $('section.dashboard-info div.table-border'),
       5 : $('tbody.detail-dashboard.ajax-data > tr > td.compare').first(),
       6 : $('div.layer-popup-contents'),
       7 : $('section.source-code-area.left div.CodeMirror'),
       8 : $('section.source-code-area.right div.CodeMirror'),
       9 : $('input.layer-popup-btn.compare'),
    };
    let myalgoOptions = {
      'autoClick': true,
      'delay': 2000,
    };
    tutorialMyalgo = new MouseMove();
    tutorialMyalgo.init($cursor, $clickerPanel, $myalgo);
    tutorialMyalgo.setOptions(myalgoOptions);
    tutorialMyalgo.start();

  };
  tutorialSkip = function(){
    tutorialMyalgo.skip();
    $tutorialPopup.addClass('hidden');
    // document.location.href = '/';  // 튜토리얼 페이지를 routing 시켜야할듯..
    // tutorialMyalgo.start();
  };
});
