$(function(){
  let $testcase = $('div.testcase');

  addCase = function(){
    console.log('add');
    let testcaseCount = $testcase.find('.case-row').length,
        nextCase = testcaseCount + 1,
        $before = $testcase.find('.case-row').last(),
        $clone = $before.clone()

    replaceAttr($clone, nextCase);

    $clone.find('div.input > textarea').val('');
    $clone.find('div.output > textarea').val('');

    $clone.appendTo($testcase);
  };
  removeCase = function(removeId){
    let $caseRow = $testcase.find('.case-row');
    if($caseRow.length === 1){
      $caseRow.first().removeAttr('onClick');
    } else {
      removeId = parseInt(removeId);
      $caseRow.eq(removeId-1).remove();
      replaceIndex(removeId-1);
    }
  }

  replaceIndex = function(start){

    let $caseRow = $testcase.find('.case-row'),
        index = start,
        end = $caseRow.length;
    console.log('rename', index, end-1);
    for( ; index < end; index++){
      let replace = parseInt(index)+1,
          $el = $caseRow.eq(index);

      replaceAttr($el, replace);
    }
  }
  replaceAttr = function($el, value){
    $el.attr({'value': value });
    $el.find('.case-title > strong').text('CASE-' + value);
    $el.find('.case-title > button').attr({'onClick':'removeCase('+value+')'})
  }

  // insert qusetions
  let $saveBtn = $('#btn_save');
  $saveBtn.click(function(){
    let $caseRow = $testcase.find('.case-row'),
        index = 0,
        end = $caseRow.length,
        data = {};

    for(;index < end; index++){
      let key = 'case-'+(index+1),
          inputText = $caseRow.eq(index).find('textarea[name=input]').val().split(/(?!<\\)\r?\n/gm),
          outputText = $caseRow.eq(index).find('textarea[name=output]').val().split(/(?!<\\)\r?\n/gm);
      data[key] = {
        'input':inputText,
        'output':outputText
      };
    }
    let $form = $('form.new-question');
    $form.attr({'method':'post'});
    $form.attr({'action':'/admin/question/insert'});
    $form.submit();
  });
});
