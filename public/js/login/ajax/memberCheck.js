$(function(){
  ajax_memberCheck = function($el, pressData){
    $.ajax({
      url:"/ajax/memberCheck",
      type:'GET',
      data:{email:pressData},
      error: function(error){
        console.error("[membercheck]",error);
      },
      success: function(result){
        // 존재하는 아이디 이면 false,
        // 존재하지 않는 아이디 이면 true
        if(!result.result){
          console.log('matched - email');
          $el.addClass('matched');
        } else {
          console.log('non-matched - email');
          $el.removeClass('matched');
        }
      }
    });
  }
});
