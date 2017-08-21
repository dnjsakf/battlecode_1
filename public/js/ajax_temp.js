$.ajax({
  url: '/ajax/mypage/getInfo',
  type: 'GET',
  data: {myInfo},
  error: function(error){
    console.error('[my-page-get-error]',error);
  },
  success: function(result){
    if(result.result){
      // 성공
      console.log('[my-page-success]', result.data);

    }else{
      // 실패
      console.log('[my-page-fail]', result.data);
    }
  },
  complete: function(){
    console.log('[my-page-completed]');
  }
});
