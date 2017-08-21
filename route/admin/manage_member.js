module.exports = function(conn){
  const route = require('express').Router();

  route.post('/member/restrict', function(req, res){
    const update = req.body.update,
          user = req.body.user;
    
    let sql = `UPDATE member SET ? WHERE ?`;
    conn.query(sql, [req.body.update, req.body.user], function(error, result){
      if(error){
        console.error(error)
        res.send({result:false, data:error});
      } else {
        res.send({result:true, data:'updated!!!'});
      }
    });
  });

  route.get('/list/member', function(req, res ){
    const page = req.query.page,
          rows = req.query.rows,
          count = (page - 1) * rows;

    const tableName = 'member',
          fieldNames = ['no','email', 'name', 'restrict_type',
                        'restrict_comment', 'date'];

    const selectSQL = `SELECT ${fieldNames} FROM member ORDER BY no DESC LIMIT ${count}, ${rows}`;
    conn.query(selectSQL, function(error, result){
      if(error){
        res.send({
          rseult: false,
          data: {
            type: 'select',
            error: error
          },
          count: 0    
        });
      } else {
        const countSQL = 'SELECT count(no) as count FROM member';
        conn.query(countSQL, function(countError, countResult){
          if(countError){
            res.send({
              rseult: false,
              data: {
                type: 'count',
                error: countError
              },
              count: 0
            });
          } else {
            res.send({
              result: true,
              data: tableTagConvert(fieldNames, result),
              count: countResult[0].count
            })
          }
        }); 
      }
    });
  });
  return route;
};


function tableTagConvert(fieldNames, data){
  // event setting
  const eventTags = {
    'restrict_event': 
      '<button class="restrict-save" value="{{replace_point}}">save</button>'+
      '<button class="restrict-init" value="{{replace_point}}">init</button>',
    'restrict_type': 
      '<select class="restrict-type" name="restrict_type">' +
      '   <option value=0>정상</option>' +
      '   <option value=1>영구정지</option>' +
      '   <option value=2>3일 정지</option>' +
      '   <option value=3>7일 정지</option>' +
      '</select>',
    'restrict_comment':
      '<textarea class="restrict-comment" name="restrict_comment">{{replace_point}}</textarea>'
  }
  const event = Object.keys(eventTags);
  for(let i=0; i < event.length; i++){
    if(fieldNames.indexOf(event[i]) === -1){
      fieldNames.push(event[i]);
    }
  }


  // valuable setting
  let fieldSize = fieldNames.length,
      fieldIndex = 0,
      fieldItem = '';

  let dataSize = data.length,
      dataIndex = 0,
      dataItem = ''; 

  let tableTag = '',
      tableHeaderTag = '<thead>',
      tableBodyTag = '<tbody>'; 



  // set table header
  for(fieldIndex; fieldIndex < fieldSize; fieldIndex++){
    fieldItem = fieldNames[fieldIndex];
    tableHeaderTag += '<th class='+ fieldItem +'>'+fieldItem+'</th>';
  }

  // set table body
  for(dataIndex; dataIndex < dataSize; dataIndex++){
    tableBodyTag += '<tr>'
    dataItem = data[dataIndex];
    
    fieldIndex = 0;
    for(fieldIndex; fieldIndex < fieldSize; fieldIndex++){
      fieldItem = fieldNames[fieldIndex];

      tableBodyTag += '<td class="'+ fieldItem +'">';
      if(event.indexOf(fieldItem) === -1){
        // 이벤트가 없는 태그
        tableBodyTag += dataItem[fieldItem];

        // 이벤트가 있는 태그
        // 제재 타입
      } else if(fieldItem === 'restrict_type'){
        let optionValue = parseInt(dataItem[fieldItem]);
        let replacePoint = `<option value=${optionValue}`;
        let replaceText = replacePoint + ' selected';

        tableBodyTag += (eventTags[fieldItem]).replace(replacePoint, replaceText);

        // 제재 설명
      } else if(fieldItem === 'restrict_comment'){
        tableBodyTag += (eventTags[fieldItem]).replace(/{{replace_point}}/img, dataItem[fieldItem]);

        // 기본 이벤트 && 새로운 필드 이벤트
      } else if(fieldItem === 'restrict_event'){
        tableBodyTag += (eventTags[fieldItem]).replace(/{{replace_point}}/img, dataItem.no);
      } else {
        tableBodyTag += eventTags[fieldItem]
      }
      tableBodyTag += '</td>';
    }
    tableBodyTag += '</tr>'
  }

  tableTag += tableHeaderTag;
  tableTag += tableBodyTag;

  return tableTag;
};