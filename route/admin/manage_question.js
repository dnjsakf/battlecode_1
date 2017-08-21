module.exports = function(conn){
  let route = require('express').Router();
  let myf = require('../../config/myFunctions.js');
  let moment = require('moment');

  route.post('/manage/question/insert', function(req, res){
    let converted = convert(req.body, req.session.passport.user.no);
    converted.date = moment().format('YYYY-MM-DD');
    console.log('[converted]');
    console.log(converted);

    myf.myInsert(conn, 'questions', converted, function(error, result){
      if(error){
        res.redirect('/admin/manage/question?error=SQL');
      } else {
        res.redirect('/admin/manage/question?success=true');
      }
    });
  });
  return route;
}

// 줄 단위로 쪼개줌
convert = function(datas, regno){
  let converted = {},
      textarea = ['text', 'input_info','output_info', 'input', 'output'];
  for(let key in datas){
    data = datas[key];
    if(key === 'author'){
      key = 'regno';
      data = regno;
    }
    converted[key] = {};

    if(textarea.indexOf(key) > -1){
      if(typeof data === 'object'){
        for(let index in data){
          converted[key][parseInt(index)+1] = data[index].split(/(?!<\\)\r?\n/gm);
        }
      } else {
        let rows =  data.toString().split(/(?!<\\)\r?\n/gm);
        for(let i in rows){
          converted[key][parseInt(i)+1] = `<p>${rows[i]}</p>`;
        }
      }
      converted[key] = JSON.stringify(converted[key]);
    } else {
      converted[key] = data.toString();
    }
  }
  return converted
}
