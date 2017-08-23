module.exports = function(conn){
  const router = require('express').Router();
  
  // event setting
  const eventTags = {
    subject:
      '<span onClick="{{replace.onClick}}">{{replace.subject}}</span>'
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

  router.get('/viewer/questions', (req, res)=>{
    let generalTag= `
      <section class="question-info">
      <div class="question-info contents">
        <h3>CONTENTS</h3>
        <div class='contents-data'>
          {{replace.content}}
        </div>
      </div>
      <div class="question-info input-info">
        <h3>INPUT INFO</h3>
        <div class='input-info-data'>
          {{replace.inputInfo}}
        </div>
      </div>
      <div class="question-info output-info">
        <h3>OUTPUT INFO</h3>
        <div class='output-info-data'>
          {{replace.outputInfo}}
        </div>
      </div>
      <div class="question-info testcase">
        {{replace.testcase}}
      </div>
      </section>
    `;
    const questionKey = req.query.questionKey;
    const selectSQL = `SELECT * FROM questions WHERE no = ${questionKey}`;
    conn.query(selectSQL, (error, result)=>{
      if(result.length === 0){
        return res.status(404).json({
          result:false,
          data:'Not found questions'
        });
      }
      
      let data = questionsViewrTagConvert(result[0], generalTag);
      console.log(data);
      return res.status(200).json({
        result: true,
        data: data
      });
    });
  });

  return router;
};

function ioConvert(io, data){
  let converted = {},
      index = 0;
  for(index in data){
    converted[index] = '';
    for(row in data[index]){
      let rowTag = `<tr class='${io}-data-row'>`;
          rowTag += ` <td class='${io} no'>${parseInt(row)+1}</td>`;
          rowTag += ` <td class='${io} data'>${data[index][row]}</td>`
          rowTag += `</tr>`
      converted[index] += rowTag;
    }
  }
  return converted;
}
function textConvert(text){
  let converted = '',
      index = 0;
  for(index in text){
    converted += text[index];
  }
  return converted;
}
function testcaseConvert(input, output){
  let converted = '',
      index = 0;
  // input index === ouput index
  let counter = 0;
  for(index in input){
    let key = 'case-'+index;
    converted +=
      `<div class="case-row ${key}">
        <div class="title">
          <strong>${key}</strong>
        </div>
        <div class="data">
          <div class="testcase input">
            <h3>input</h3>
            <table>
              <tbody class='input-body'>
                ${input[index]}
              </tbody>
            </table>
          </div>
          <div class="testcase output">
            <h3>output</h3>
            <table>
              <tbody class='output-body'>
                ${output[index]}
              </tbody>
            </table>
          </div>
          <div style='clear:both;'></div>
        </div>
      </div>
    </div>`
  }
  return converted;
}


function questionsViewrTagConvert(data, tag){
  let content = textConvert(JSON.parse(data.text));
  let input_info = textConvert(JSON.parse(data.input_info));
  let output_info = textConvert(JSON.parse(data.output_info));

  // content = textConvert(JSON.parse(data.text));
  // input_info = textConvert(JSON.parse(data.input_info));
  // output_info = textConvert(JSON.parse(data.output_info));
  let input = ioConvert('input', JSON.parse(data.input));
  let output = ioConvert('output', JSON.parse(data.output));
  let testcase = testcaseConvert(input, output);

  const replaceContentReg = /{{replace.content}}/img;
  const replaceInputInfoReg = /{{replace.inputInfo}}/img;
  const replaceOutputInfoReg = /{{replace.outputInfo}}/img;
  const replaceTestcaseReg = /{{replace.testcase}}/img;

  let fieldNames = Object.keys(data);
  // valuable setting
  
  if(replaceContentReg.test(tag)){
    // tag = tag.replace(replaceContentReg, '');
    tag = tag.replace(replaceContentReg, content);
  }
  if(replaceInputInfoReg.test(tag)){
    // tag = tag.replace(replaceInputInfoReg, '');
    tag = tag.replace(replaceInputInfoReg, input_info);
  }
  if(replaceOutputInfoReg.test(tag)){
    // tag = tag.replace(replaceOutputInfoReg, '');
    tag = tag.replace(replaceOutputInfoReg, output_info);
  }
  if(replaceTestcaseReg.test(tag)){
    // tag = tag.replace(replaceTestcaseReg, '');
    tag = tag.replace(replaceTestcaseReg, testcase);
  }

  console.log(tag);
  return tag;
};  

function questionsTableTagConvert(data, eventTags){
  const replaceNoRegex = /{{replace.no}}/img;
  const replaceSubjectRegex = /{{replace.subject}}/img;
  const replaceOnClickRegex = /{{replace.onClick}}/img;

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

      } else if(replaceSubjectRegex.test(eventTags[fieldItem])){
        let tags = eventTags[fieldItem];
      
        tags = tags.replace(replaceSubjectRegex, dataItem.subject);
        tags = tags.replace(replaceOnClickRegex, `showQuestionViewer(${dataItem.no})`);
        
        tableBodyTag += tags;
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