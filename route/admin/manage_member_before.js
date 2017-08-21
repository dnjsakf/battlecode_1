module.exports = function(conn){
  const route = require('express').Router();

  route.get('/select/data/:tableName', function(req, res){
    const tableName = req.params.tableName,
          fieldNames = req.query.fieldNames,
          page = req.query.getDataInfo.page,
          rows = req.query.getDataInfo.rows;

    console.log(page, rows);

    let resultData = {};
    let count = (page-1)*rows;
    let sql = 'SELECT '+ fieldNames +',(SELECT count(no) FROM ' + tableName + ') as count'+
          ' FROM ' + tableName +
          ' ORDER BY no DESC' +
          ' LIMIT '+ count + ',' + rows;

    conn.query(sql, function(error, result){
      if(error){
        console.log('[admin-select-error]', error);
        resultData = {
          result: false,
          data: error,
          count: 0
        };
        res.send(resultData);
      } else {
        console.log('[admin-select-success]', result.length);
        rseultData = {
          result: true, 
          data: tableTagConvert('select', tableName, fieldNames, result), 
          count: result.length > 0 ? result[0].count : 0
        }
        res.send(rseultData);
      }
    });
  });

  route.get('/viewer/data/:tableName', function(req, res){
    console.log(req.url)
    const tableName = req.params.tableName,
        fieldNames = req.query.fieldNames,
        userKey = req.query.userKey,
        page = req.query.getDataInfo.page,
        rows = req.query.getDataInfo.rows;

    let resultData = {};
    let count = (page-1) * rows;
    let condition = ` WHERE no = ${userKey}`;
    let sql = 'SELECT '+ fieldNames +', (SELECT count(no) FROM ' + tableName + condition +') as count'+
        ' FROM ' + tableName +
          condition +
        ' ORDER BY no DESC' +
        ' LIMIT '+ count + ',' + rows;

    conn.query(sql, function(error, result){
      if(error){
        console.error('[viewer-error]');
        resultData = {
          result: false,
          data: error,
          count: 0
        }
        res.send(resultData);
      } else {
        console.log('[viewer-success]');
        rseultData = {
          result: true, 
          data: tableTagConvert('viewer', tableName, fieldNames, result), 
          count: result.length > 0 ? result[0].count : 0
        }
        res.send(resultData);
      }
    });
  });
  return route;
};

function tableTagConvert(type, tableName, fieldNames, selectResult){
  let tags = '',
      selectDataEnd = selectResult.length,
      selectDataIndex = 0,
      fieldEnd = fieldNames.length;

  for(;selectDataIndex < selectDataEnd; selectDataIndex++){
    let fieldIndex = 0,
        fieldName = '',
        data = '',
        userKey = selectResult[selectDataIndex].no,
        initPage = 1;

    if(type === 'select'){
      let onClickEvent = "getManageViewer('"+ tableName +"', "+ initPage +", "+ userKey + ")";
      tags += '<tr onClick="' + onClickEvent + '">';
    } else {
      tags += '<tr>';
    }
    
    for(; fieldIndex < fieldEnd; fieldIndex++){
      fieldName = fieldNames[fieldIndex];
      data = selectResult[selectDataIndex][fieldName];
      tags += '<td class='+fieldName+'>'+data+'</td>'
    }
  }
  tags += '</tr>';
  return tags;
};

function viwerTagConvert(type, fieldNames, result){
  let tags = '',
      selectDataEnd = selectResult.length,
      selectDataIndex = 0,
      fieldEnd = fieldNames.length;

  for(;selectDataIndex < selectDataEnd; selectDataIndex++){
    let fieldIndex = 0,
        fieldName = '',
        data = '',
        userKey = selectResult[selectDataIndex].no,
        initPage = 1;
    for(; fieldIndex < fieldEnd; fieldIndex++){
      fieldName = fieldNames[fieldIndex];
      data = selectResult[selectDataIndex][fieldName];
      tags += '<span class='+fieldName+'>'+data+'</span>'
    }
  }
  return tags;
};