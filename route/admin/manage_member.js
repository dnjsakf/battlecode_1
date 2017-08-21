module.exports = function(conn){
  let route = require('express').Router();

  route.get('/member/:type', function(req, res){
    let type = req.params.type;

    let tableName = req.query.tableName,
        fieldNames = req.query.fieldNames,
        page = req.query.getDataInfo.page,
        rows = req.query.getDataInfo.rows,
        userKey = req.query.getDataInfo.userKey,
        count = (page-1)*rows,
        sql = '',
        condition = '';

    if( type === 'viewer'){
      tableName = ' qState ';
      condition = ' WHERE mNo = ' + userKey;
    }
    sql = 'SELECT '+ fieldNames +',(SELECT count(no) FROM ' + tableName + condition + ') as count'+
            ' FROM ' + tableName +
            condition +
            ' ORDER BY no DESC' +
            ' LIMIT '+ count + ',' + rows;
    conn.query(sql, function(error, result){
      if(error){
        console.log('[admin-select-error]', error);
        res.send({result:false, data:error, count:0});
      } else {
        console.log('[admin-select-success]', result.length);
        let tags = tableConvert(tableName, fieldNames, result),
            resultCount = result.length > 0 ? result[0].count : 0;
        res.send({result:true, data:tags, count:resultCount});
      }
    });
  });

  return route;
};

function tableConvert(tableName, fieldNames, selectResult){
  let tags = '',
      selectDataEnd = selectResult.length,
      selectDataIndex = 0,
      fieldEnd = fieldNames.length;
  for(;selectDataIndex < selectDataEnd; selectDataIndex++){
    let fieldIndex = 0,
        fieldName = '',
        data = '',
        userKey = selectResult[selectDataIndex].no,
        initPage = 1,
        onClickEvent = "handleManageSelect('viewer', 'member', "+initPage+", "+ userKey + ")";
    tags += '<tr onClick="' + onClickEvent + '">';
    for(; fieldIndex < fieldEnd; fieldIndex++){
      fieldName = fieldNames[fieldIndex];
      data = selectResult[selectDataIndex][fieldName];
      tags += '<td class='+fieldName+'>'+data+'</td>'
    }
    tags += '</tr>';
  }
  return tags;
};
