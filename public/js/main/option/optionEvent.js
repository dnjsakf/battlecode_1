$(function(){
  let $mainblock = $('section.option-setting');
  setting_init = function(){
    $mainblock.removeClass('hidden');
    $mainblock.animate({'opacity':1}, 300);
  }
  settingSave = function(){
    let form = document.getElementById('setting-form');
    let boolean = confirm('새로고침 후 적용됩니다');
    if(boolean === true){
      form.method = 'post';
      form.action = '/user/setting/'
      form.submit();
    }
  };
  // 공지사항 닫기
  settingCancle = function(){
    $mainblock.animate({'opacity':0}, 300, function(){
      $mainblock.addClass('hidden');
    });
  };
});
