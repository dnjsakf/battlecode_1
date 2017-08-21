$(function(){
	/*  AJAX
	 *  get list data
	 */
	ajax_get_data = function(type, tableName, fieldNames, getDataInfo){
    return new Promise(function(resolve, reject){
      $.ajax({
  			url:'/admin/manage/member/' + type,
  			type:'GET',
  			dataType:'JSON',
  			data:{
  				'tableName' : tableName,
  				'fieldNames' : fieldNames,
  				'getDataInfo' : getDataInfo,
  			},
  			error: function(error){
          reject(error);
  			},
  			success: function(result){
          resolve(result);
  			},
  		});
    });
	};
});
