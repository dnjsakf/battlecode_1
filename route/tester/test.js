module.exports = function(){
  let router = reuiqre('express').Router();
  var app = require('express')(),
  mailer = require('express-mailer');

  mailer.extend(app, {
    from: '',
    host: 'localhost', // hostname 
    secureConnection: true, // use SSL 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
      user: 'dnjsakf@gmail.com',
      pass: 'wjddns123!@#'
    }
  });






  // var fs = require('fs-extra');
  // var route = require('express').Router();

  // route.get('/', function(req,res){
  //   res.send('THIS IS TEST PAGE');
  // });


  // var path = require('path');
  // var dataPath = path.join(__dirname, "../../data/users");
  // var userDirectories = fs.readdirSync(dataPath)
  //                     .filter(file => fs.lstatSync(path.join(dataPath, file)).isDirectory());
  // test = function(elements, index, array){
  //   console.log(`[^${121}] : ${elements}`);
  //   if(RegExp('^'+121+'.*').test(elements)){
  //     console.log('[find!!]',elements);
  //   }
  // }
  // console.log(userDirectories.find(test));
  // var algoNo = 37,
  // 		otherNo = 121,
  // 		myNo = 131,
  // 		filePath = RegExp('('+otherNo+'.*)'),
  // 		algoPath = RegExp('('+algoNo+'.*)');
  // 		// otherSourcePath = path.join(dataPath, filePath, algoPath);
  // console.log(filePath, algoPath);



  // // 실제로 적용할 때 삭제해야되는 부분
  // route.get('/notice', function(req, res){
  //   res.sendfile('./public/html/main/notice.html');
  // });

  // // 여기서부터 사용하면됨
  // // 리스트를 가져오는 이벤트
  // route.get('/ajax/notice/list', function(req, res){
  //   let conn = require('../../config/mysql.js').init('battlecode');
  //   let page = parseInt(req.query.page),
  //       rows = parseInt(req.query.rows),
  //       start = ((page-1)*rows);

  //   let sql = 'SELECT * FROM notice ORDER BY no DESC LIMIT ?, ?';
  //   conn.query(sql, [start, rows], function(error, result){
  //     if(error){
  //       console.log(error);
  //       res.send({result:false, data:error});
  //     } else {
  //       // 리스트 형태는 태그로 변형시켜서
  //       // javascript에서 바로 적용시키도록 함
  //       notice_list_convert(result, function(listTag){
  //         res.send({result:true, data:listTag});
  //       });
  //     }
  //   });
  // });
  // // 토픽 가져오는 이벤트
  // route.get('/ajax/notice/topic', function(req, res){
  //   let conn = require('../../config/mysql.js').init('battlecode');
  //   let sql = 'SELECT * FROM notice WHERE topic = 1 ORDER BY no DESC';
  //   conn.query(sql, function(error, result){
  //     if(error){
  //       console.log(error);
  //       res.send({result:false, data:error});
  //     } else {
  //       notice_topic_convert(result, function(topicTag){
  //         res.send({result:true, data:topicTag});
  //       });
  //     }
  //   });
  // });

  // // 공지사항 리스트 갯수
  // route.get('/ajax/notice/count', function(req, res){
  //   let conn = require('../../config/mysql.js').init('battlecode');
  //   let sql = 'SELECT count(no) as count FROM notice';
  //   conn.query(sql, function(error, result){
  //     if(error){
  //       res.send({result:false, data:error});
  //     } else {
  //       console.log(result[0]);
  //       res.send({result:true, data:result[0].count});
  //     }
  //   });
  // });

  // // 선택한 문제의 정보를 보여주는 이벤트
  // route.get('/ajax/notice', function(req, res){
  //   let conn = require('../../config/mysql.js').init('battlecode');
  //   let sql = 'SELECT * FROM notice WHERE ?',
  //       condition = req.query.condition;

  //   conn.query(sql, [condition], function(error, result){
  //     if(error){
  //       res.send({result:false, data:error});
  //     } else {
  //       res.send({result:true, data:result});
  //     }
  //   });
  // });
  return route;
};

notice_list_convert = function(data, callback){
  let index = 0;
      dataSize = data.length
      listTag = '';
  for(; index < dataSize; index++){
    let row = data[index];
    listTag += '<tr>'
    listTag += `  <td class='notice-no'>${row.no}</td>`;
    listTag += `  <td class='notice-subject' onClick='notice_viewer(${row.no})'>${row.subject}</td>`;
    listTag += `  <td class='notice-author'>${row.author}</td>`;
    listTag += `  <td class='notice-date'>${row.date}</td>`;
    listTag += '</tr>'
  }
  console.log('[notice-list-converted]',listTag);
  callback(listTag);
}
notice_topic_convert = function(data, callback){
  let index = 0;
      dataSize = data.length,
      topicTag = '';
  for(; index < dataSize; index++){
    let row = data[index];
    topicTag += `<input class='notice-topic-text' type="text" onClick='notice_viewer(${row.no})' value="${row.date}  ${row.subject}" readonly>`
  }
  console.log('[notice-notice-converted]',topicTag);
  callback(topicTag);
}
