$(function(){
  let $mainblock = $('section.report-popup');
  reportPopupInit = function(){
    $mainblock.removeClass('hidden');
    $mainblock.animate({'opacity':1}, 300);
  }
  reportSubmit = function(){
    let memberNo = userState.data.info.no,
        questionNo = userState.data.algorithm.no;
    let $form = $('form#report-form');

    let boolean = confirm('신고내용을 제출하시겠습니까?');
    if(boolean === true){
      $form.find('input.hidden-info[name=mNo]').attr({'value':memberNo});
      $form.find('input.hidden-info[name=qNo]').attr({'value':questionNo});
      $form.attr({'method':'post'});
      $form.attr({'action':'/user/report'});
      $form.submit();
    }
  };
  // 공지사항 닫기
  reportCancle = function(){
    $mainblock.animate({'opacity':0}, 300, function(){
      $mainblock.addClass('hidden');
    });
  };
});
