$(function(){

  // 공지사항 리스트 가져오기
  ajax_get_notice_list = function(target, $elements, data, callback){
    $.ajax({
      url:'/ajax/notice/'+target,   // remove '/test'
      type:'GET',
      data:data,
      error:function(error){
        console.log('[notice-ajax-error]', error);
      },
      success:function(result){
        if(result.result){
          $elements.empty();
          $elements.append(result.data);
          if(target === 'topic'){
            callback(true, $elements);
          } else {
            callback(true, null);
          }
        } else {
          callback(false, 'none');
          console.log('[notice-ajax-fail]', result.data);
        }
      },
    });
  }

  ajax_get_notice_count = function(callback){
    $.ajax({
      url:'/ajax/notice/count',   // remove '/test'
      type:'GET',
      error:function(error){
        console.log('[notice-ajax-error]', error);
      },
      success:function(result){
        if(result.result){
          console.log(result.data);
          callback(true, result.data);
        } else {
          callback(false, 0);
        }
      },
    });
  };


  // 공지사항 상세정보 가져오기
  ajax_get_notice_detail = function($elements, noticeData, callback){
    $.ajax({
      url:'/ajax/notice',   // remove '/test'
      type:'GET',
      data:{
        'condition':noticeData
      },
      error: function(error){
        console.log('[notice-viewer-ajax-error]');
      },
      success: function(result){
        if(result.result){
          let data = result.data[0];
          $elements.info.eq(0).text(data.no);
          $elements.info.eq(1).text(data.subject);
          $elements.info.eq(2).text(data.author);
          $elements.info.eq(3).text(data.date);
          $elements.contents.val(data.content);
          callback(true);
        } else {
          console.log('[notice-viewer-ajax-faile]', result.data);
          callback(false);
        }
      },
    });
  };
});
