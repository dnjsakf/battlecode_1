// get database list
ajaxGetListData = function(type, $setElement, page, rows, callback){
  $.ajax({
    url:'/admin/manage/list/'+type,
    type:'GET',
    data: {
      page:page,
      rows:rows
    },
    error: function(error){
      console.error('[error]['+type+'-list-ajax]')
    },
    success: function(result){
      if(result.result){
        console.log('[success]['+type+'-list-ajax]')
        $setElement.empty();
        $setElement.append(result.data);
        callback(true, result.count);
      } else {
        console.log('[fail]['+type+'-list-ajax]', result.data)
        callback(false, 0);
      }
    }
  });
};

// create table page button.
createPageButton = function(type, $remote, lastPage, rows){
  $remote.empty();
  let page = 0;
  do {
    page += 1;
    onClickEvent = "getDataList('"+ type +"',"+ page +","+ rows +")";
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
  getDataList = function(type, page, rows){
    console.log('[get-list-type]', type)

    const $table = $element.viewer.simple.find('table'),
          $remote = $element.viewer.simple.find('div.page-buttons');
    ajaxGetListData(type, $table, page, rows, function(result, count){
      if(result){
        let lastPage = parseInt(count / rows) + 1;
        createPageButton(type, $remote, lastPage, rows);
      }
    });
  }
});