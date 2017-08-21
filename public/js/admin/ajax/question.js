$(function(){
  ajax_insert_question = function(data){
    $.ajax({
      url: '/admin/ajax/question/',
      type: 'PUT',
      data: {'data':data},
      error: function(error){
        console.error('[qusetion-insert-error]',error);
      },
      success: function(result){
        if(result.result){
          // 성공
          console.log('[qusetion-insert-success]', result.data);

        }else{
          // 실패
          console.log('[qusetion-insert-fail]', result.data);
        }
      },
      complete: function(){
        console.log('[qusetion-insert-completed]');
      }
    });
  };

});
