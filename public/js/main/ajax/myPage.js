$(function(){
  // INSERT
  ajax_put_my_info = function(myInfo, putData ,callback){
    $.ajax({
      url: '/ajax/mypage/',
      type: 'PUT',
      data: {'myNo': myInfo},
      error: function(error){
        console.error('[my-page-get-error]',error);
      },
      success: function(result){
        if(result.result){
          // 성공
          console.log('[my-page-success]', result.data);

          callback(null, result);
        }else{
          // 실패
          console.log('[my-page-fail]', result.data);

          callback(result.data, null);
        }
      },
      complete: function(){
        console.log('[my-page-completed]');
      }
    });
  };

  // SELECT
  ajax_get_my_info = function(myInfo, callback){
    $.ajax({
      url: '/ajax/mypage/',
      type: 'GET',
      data: myInfo,
      error: function(error){
        console.error('[my-page-get-error]',error);
      },
      success: function(result){
        if(result.result){
          // 성공
          console.log('[my-page-success]', result.data);

          callback(null, result.data);
        }else{
          // 실패
          console.log('[my-page-fail]', result.data);

          callback(result.data, null);
        }
      },
      complete: function(){
        console.log('[my-page-completed]');
      }
    });
  };

  // UPDATE
  ajax_post_my_info = function(myInfo, callback){
    $.ajax({
      url: '/ajax/mypage/',
      type: 'POST',
      data: myInfo,
      error: function(error){
        console.error('[my-page-get-error]',error);
      },
      success: function(result){
        if(result.result){
          // 성공
          console.log('[my-page-success]', result.data);

          callback(null, result);
        }else{
          // 실패
          console.log('[my-page-fail]', result.data);

          callback(result.data, null);
        }
      },
      complete: function(){
        console.log('[my-page-completed]');
      }
    });
  }

  // DELETE
  ajax_del_my_info = function(myInfo, callback){
    $.ajax({
      url: '/ajax/mypage/',
      type: 'DELETE',
      data: myInfo,
      error: function(error){
        console.error('[my-page-get-error]',error);
      },
      success: function(result){
        if(result.result){
          // 성공
          console.log('[my-page-success]', result.data);

          callback(null, result);
        }else{
          // 실패
          console.log('[my-page-fail]', result.data);

          callback(result.data, null);
        }
      },
      complete: function(){
        console.log('[my-page-completed]');
      }
    });
  };
});
