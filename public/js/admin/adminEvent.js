// get database list
ajaxGetData = function(detailType, getType, $setElement, getDataInfo, callback){
  $.ajax({
    url:'/admin/manage/'+detailType+'/'+getType,
    type:'GET',
    data: getDataInfo,
    dataType: 'JSON',
    error: function(error){
      console.error('[error]['+getType+'-'+detailType+'-ajax]')
    },
    success: function(result){
      if(result.result){
        console.log('[success]['+getType+'-'+detailType+'-ajax]')
        $setElement.empty();
        $setElement.append(result.data);
        callback(true, result.count);
      } else {
        console.log('[fail]['+getType+'-'+detailType+'-ajax]', result.data)
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

    $element.viewer.detail.hide();
    $element.viewer.simple.show();

    const $table = $element.viewer.simple.find('table'),
          $remote = $element.viewer.simple.find('div.page-buttons'),
          getDataInfo = {
            page,
            rows
          };
    ajaxGetData('list', type, $table, getDataInfo, function(result, count){
      if(result){
        let lastPage = parseInt(count / rows) + 1;
        createPageButton(type, $remote, lastPage, rows);
      }
    });
  }

  showQuestionViewer = function(questionKey){
    $element.viewer.detail.show();
    $element.viewer.simple.hide();
    
    const type = 'questions';
    const $display = $element.viewer.detail.find('div.data-display'),
          $remote = $element.viewer.simple.find('div.page-buttons'),
          getDataInfo = {
            questionKey
          };
    ajaxGetData('viewer', type, $display, getDataInfo,function(result, data){
      if(result){
        console.log('result', data)
      }
    });
  };
});