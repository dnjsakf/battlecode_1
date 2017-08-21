// get database list
ajaxGetListData = function($setElement, page, rows, callback){
  $.ajax({
    url:'/admin/manage/list/member',
    type:'GET',
    data: {
      page:page,
      rows:rows
    },
    error: function(error){
      console.error('[error][memeber-list-ajax]')
    },
    success: function(result){
      if(result.result){
        console.log('[success][memeber-list-ajax]')
        $setElement.empty();
        $setElement.append(result.data);
        callback(true, result.count);
      } else {
        console.log('[fail][memeber-list-ajax]', result.data)
        callback(false, 0);
      }
    }
  });
};

// create table page button.
createPageButton = function($remote, lastPage, rows){
  $remote.empty();
  let page = 0;
  do {
    page += 1;
    onClickEvent = "getMemberList("+ page +","+ rows +")";
    let tag = '<button type="button" onClick="'+ onClickEvent +'">'+ page +'</button>'
    $remote.append(tag);
  } while (page < lastPage);
};


$(function(){
  const $element = {
    viewer:{
      simple: $('section#data-simple-viewer'),
      detail: $('section#data-detail-viewer')
    }
  };
  getMemberList = function(page, rows){
    const $table = $element.viewer.simple.find('table'),
          $remote = $element.viewer.simple.find('div.page-buttons');
    ajaxGetListData($table, page, rows, function(result, count){
      if(result){
        let lastPage = parseInt(count / rows) + 1;
        createPageButton($remote, lastPage, rows);
      }
    });
  }
});