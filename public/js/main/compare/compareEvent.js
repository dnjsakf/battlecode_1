$(function(){
  let editor = {
    'my': new codemirror_f($('textarea.my-source')),
    'other': new codemirror_f($('textarea.other-source'))
  }
  let readonly = true;
  editor.my.init(readonly);
  editor.other.init(readonly);

  // 팝업을 띄워줌.
  let elements = {
    'viewer':$('section.popup-source-code-detail'),
    'btn': $('input.layer-popup-btn.compare'),
    'select': $('select.source-code-selector'),
    'result': $('span.layer-popup-str.results')
  }

  // 비교하기 클릭 이벤트
  var myCodes;
  deatil_viewer = function(stateNo, questionNo){
    let data = {
      'stateNo':stateNo,
      'questionNo':questionNo
    }
    ajax_get_compare_code(elements, data, editor, function(error, _myCodes){
      if(!error){
        myCodes = _myCodes;
      }
    });
  };

  // layer-popup 비교하기 실행
  elements.btn.click(function(){
    let data = {
      'myStateNo':$(this).attr('myStateNo'),
      'otherStateNo': $(this).attr('otherStateNo')
    }
    ajax_do_compare(elements.result, data);

  });

  // 내 소스코드 변경
  elements.select.change(function(){
    let selected = elements.select.find('option:selected').val();
    elements.btn.attr({'myStateNo':myCodes[selected].no});
    editor.my.set(myCodes[selected].sourceCode);
  });

  // 팝업 주변 배경을 누르면 팝업 종료
  elements.viewer.find('div.layer-popup-bg, input.close').click(function(){
    elements.viewer.animate({opacity:0}, 200, function(){
      elements.viewer.css({'display':'none'});
      editor.my.set('');
      editor.other.set('');
    });
  });

});
