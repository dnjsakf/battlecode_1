$(function(){
  let $backjoon_crawler = $('form#backjoon_crawler');
  $backjoon_crawler.children('input[name=submit]').click(function(){
    let url = $backjoon_crawler.children('input[name=url]').val(),
        start = $backjoon_crawler.children('input[name=start]').val(),
        end = $backjoon_crawler.children('input[name=end]').val();
    $.ajax({
      url:'/crawler/backjoon',
      type:'post',
      data:{'url':url, 'start':start, 'end':end},
      success:function(data){
        console.log(data);
      }
    });
  });
});
