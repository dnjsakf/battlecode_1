module.exports = function(conn){
  const router = require('express').Router();
  // event setting
  const eventTags = {
    content:
      '<textarea>{{replace.content}}</textarea>'
  };
  router.get('/viewer/report', (req, res)=>{
    


    return res.status(200).json({
      result: true,
      data: ''
    });
  });
  
  router.get('/list/report', (req,res)=>{
    const page = req.query.page,
          rows = req.query.rows,
          count = (page - 1) * rows;

    const table = 'report',
          join = ['member','questions'];
    
    const fieldNames = [
      `${table}.no as no`,
      `${join[1]}.subject as question`,  // ~.no
      `${table}.type as type`,
      `${table}.detail as content`,
      `${join[0]}.name as author`,       // ~.no
      `${table}.date as date`
    ];

    let selectSQL = '';
    let sql = {
      select: `SELECT ${fieldNames}`,
      from: `FROM ${table}`,
      join1: `INNER JOIN ${join[0]} ON ${table}.mNo = ${join[0]}.no`,
      join2: `INNER JOIN ${join[1]} ON ${table}.qNo = ${join[1]}.no`,
      where: '',
      order: `ORDER BY no DESC`,
      limit: `LIMIT ${count}, ${rows}`
    }
    for(let key in sql){
      if(sql[key] !== ''){
        selectSQL += (sql[key] + ' ');
      }
    }
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
        const countSQL = `SELECT count(no) as count FROM ${table}`;
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
              data: questionsTableTagConvert(result, eventTags),
              count: countResult[0].count
            })
          }
        }); 
      }
    });
  });
  return router;
};

function questionsTableTagConvert(data, eventTags){
  const replaceContentRegex = /{{replace.content}}/img;
  
  let fieldNames = Object.keys(data[0]);
  
  const event = Object.keys(eventTags);
  for(let i=0; i < event.length; i++){
    if(fieldNames.indexOf(event[i]) === -1){
      fieldNames.splice(2+i, 0, event[i]);
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
      } else if(replaceContentRegex.test(eventTags[fieldItem])){
        tableBodyTag += (eventTags[fieldItem]).replace(replaceContentRegex, dataItem[fieldItem]);
      } else {
        tableBodyTag += (eventTags[fieldItem]);
      }
      tableBodyTag += '</td>';
    }
    tableBodyTag += '</tr>'
  }

  tableTag += tableHeaderTag;
  tableTag += tableBodyTag;

  return tableTag;
};