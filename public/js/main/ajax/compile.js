$(function(){
  _ajax_compile = function(compile_data){
    let promise = $.ajax({
      type: "POST",
      url: "/ajax/compile",
      asnyc: true,
      data: compile_data,
    });
    return promise;
  };

  ajax_compile_result_save = function(save_data){
    let promise = $.ajax({
      url:'/ajax/compile/save',
      type:'POST',
      data: save_data,
    });
    return promise;
  };
});
