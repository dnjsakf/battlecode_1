module.exports = function(conn){
  let route = require('express').Router();
  let moment = require('moment');
  let date = moment().format('YYYY-MM-DD');
  /************************/
  /****** 문제 리스트 ******/
  /************************/
  /*
   *  left-tab에 문제 리스트 가져오거나
   *  right-tab에 문제 정보를 출력시켜주는 이벤트
   */
  route.get(['/question','/question/:no'], function(req, res){
    let sql = '';
    let _no = req.params.no;
    let _where;
    if(_no){
      // _where = {"q.regno" : "m.no", "m.no": _no};
      sql = 'SELECT q.*, m.name FROM questions as q INNER JOIN member as m WHERE q.regno = m.no AND q.no = ?';
      _where = _no;
    } else {
      sql = 'SELECT * from questions WHERE ?';
      _where = true;
    }
    conn.query(sql, [_where], function(error, result){
      if(error){
        console.error("[ajax fail] question",error);
        res.send({result:false, data:error});
      } else {
        // console.log("[ajax success] question", result);
        if(_where === true){
          let tags = {},
              key = '';
          for(key in result){
            let no = result[key].no,
                subject = result[key].subject;
            tags[key] = `<li class="algorithm ${no}" value="${subject}">${subject}</li>`;
          }
          res.send({result:true, data:tags});
        } else {
          let data = result[0];
          // console.log(data);
          data.text = textConvert(JSON.parse(data.text));
          data.input_info = textConvert(JSON.parse(data.input_info));
          data.output_info = textConvert(JSON.parse(data.output_info));

          data.input = ioConvert('input', JSON.parse(data.input));
          data.output = ioConvert('output', JSON.parse(data.output));

          data.testcase = testcaseConvert(data.input, data.output);
          data.testcase_count = Object.keys(data.input).length;

          res.send({result:true, data:data});
        }
      }
    });
  });
  return route;
};

let varinfoConvert = function(varinfo){
  let converted = '',
      index = 0;
  for(index in varinfo){
    converted += `<p>${varinfo[index]}</p>`
  }
  return converted;
}

let testcaseConvert = function(input, output){
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

let ioConvert = function(io, data){
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

let textConvert = function(text){
  let converted = '',
      index = 0;
  for(index in text){
    converted += text[index];
  }
  return converted;
}
