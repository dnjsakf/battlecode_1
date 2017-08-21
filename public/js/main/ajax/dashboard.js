$(function(){
  create_dashboard_remote = function(count, row){
    console.log(count, row);
    let $remote = $('nav.dashboard-remote > div.buttons'),
        tag = '';
    let pagesize = Math.ceil(count / row),
        page = 1;

    $remote.empty();
    for(; page <= pagesize; page++){
      tag = `<button type='button' onClick='dashboard_page(${page})'>${page}</button>`;
      $remote.append(tag);
    }
  }

  ajax_get_dashboard = function($elements, data, callback){
    console.log(data);
    $.ajax({
      url:'/ajax/qState/dashboard',
      type:'GET',
      data:data,
      error: function(error){
        console.log("[ajax dashboard error]",error);
      },
      success: function(result){
        if(result.result){
          // 성공
          let rows = result.data;
          $elements.tbody.empty();
          for(let i in rows){
            // console.log("[ajax dashboard success]", rows[i]);
            $elements.tbody.append(rows[i]);
          }
          create_dashboard_remote(result.count, data.rows);
          callback(true);
        } else{
          // 실패
          console.log("[ajax dashboard fail]");
          callback(false);
        }
      },
      complete: function(){
        console.log("[ajax complte dashboard]");
        let $compares = $elements.table.find('.compare');
        // console.log($compares);
        if(data.isMineAlgo){
          console.log('[ismine]');
          $compares.removeClass('hidden');
        } else {
          console.log('[is not mine]');
          $compares.addClass('hidden');
        }
      }
    });
  };
});
