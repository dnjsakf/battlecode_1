$(function(){
  let $connectForm = $("form#connectForm");
  let $logBtn = $("input.log-btn");

  $logBtn.click(function(){
    if($(this).hasClass('login')){
      $connectForm.attr('action', '/auth/login');
      $connectForm.attr('method', 'get');
    }else if($(this).hasClass('logout')){
      $connectForm.attr('action', '/auth/logout');
      $connectForm.attr('method', 'post');
    } else{
      $connectForm.attr('action', '/admin');
      $connectForm.attr('method', 'get');
    }
    $connectForm.submit();
  });
});
