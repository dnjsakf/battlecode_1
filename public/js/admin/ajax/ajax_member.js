$(function(){
	/*  AJAX
	 *  get list data
	 */
	ajaxGetSelectData = function(tableName, fieldNames, getDataInfo){
    return new Promise(function(resolve, reject){
      $.ajax({
  			url:'/admin/manage/select/data/'+tableName,
  			type:'GET',
  			dataType:'JSON',
  			data:{
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

	ajaxGetViewerData = function(tableName, fieldNames, getDataInfo){
		return new Promise(function(resolve, reject){
      $.ajax({
  			url:'/admin/manage/viewer/data/'+tableName,
  			type:'GET',
  			dataType:'JSON',
  			data:{
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