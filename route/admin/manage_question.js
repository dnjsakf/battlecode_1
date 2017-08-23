module.exports = function(conn){
  const router = require('express').Router();
  
  // event setting
  const eventTags = {
    'content':
      '<button onClick="showDetail({{replace}})">detail</button>',
    'input_info':
      '<button onClick="showDetail({{replace}})">detail</button>',
    'output_info':
      '<button onClick="showDetail({{replace}})">detail</button>',
  };

  router.get('/list/questions', (req,res)=>{
    const page = req.query.page,
          rows = req.query.rows,
          count = (page - 1) * rows;

    const table = 'questions',
          join = 'member';
    
    const fieldNames = [
      `${table}.no as no`,
      `${table}.subject as subject`, 
      `${join}.name as name`, 
      `${table}.date as date`
    ];

    let selectSQL = '';
    let sql = {
      select: `SELECT ${fieldNames}`,
      from: `FROM ${table}`,
      join: `INNER JOIN ${join} ON ${table}.regno = ${join}.no`,
      where: '',
      order: `ORDER BY no DESC`,
      limit: ` LIMIT ${count}, ${rows}`
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
  const replaceNoRegex = /{{replace_point.no}}/img;

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
      } else if(replaceNoRegex.test(eventTags[fieldItem])){
        tableBodyTag += (eventTags[fieldItem]).replace(replaceNoRegex, `'${fieldItem}', ${dataItem.no}`);
      } else {
        tableBodyTag += eventTags[fieldItem];
      }
      tableBodyTag += '</td>';
    }
    tableBodyTag += '</tr>'
  }

  tableTag += tableHeaderTag;
  tableTag += tableBodyTag;

  return tableTag;
};