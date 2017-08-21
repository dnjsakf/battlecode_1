module.exports = function(conn){
  var path = require('path');
  var fs = require('fs-extra');
  var route = require('express').Router();

  // 소스코드 비교하기
  route.get('/sourcecode/compare', function(req, res){
    var myStateNo = req.query.myStateNo,
        otherStateNo = req.query.otherStateNo;
    var compare = require('../../config/source_code_compare.js');
    compare(conn, myStateNo, otherStateNo, function(error, result){
      let sendData = {
        'result':false,
        'data':result
      }
      if(error){
        console.error('[ajax-compare-error]', result);
      } else {
        // console.log('[ajax-compare-success]', result);
        sendData = {
          'result':true,
          'data':result
        }
      }
      res.send(sendData);
    });
  });

  // 소스코드 뿌려주기
  route.get('/sourcecode', function(req, res){
    // 멤버 번호, 문제 번호
    var stateNo = req.query.stateNo;
    var myNo = req.session.passport.user.info.no;
    var questionNo = req.query.questionNo;

    var myCodeSql = 'SELECT no, sourceCode, result FROM qState WHERE mNo = ? AND qNo = ? ORDER BY no DESC';
    conn.query(myCodeSql, [myNo, questionNo], function(error, myCode){
      if(error){
        console.error('[qState-my-error]',error);
        let sendData = {
          'result': false,
          'data':'[no my sourcecode]'
        }
        res.send(sendData);
      } else {
        // console.log('[qState-my-success]', result);
        console.log('[qState-my-success]');
        var otherCodesql = 'SELECT no, sourceCode, result FROM qState WHERE no = ?';   // myNo, otherNo
        conn.query(otherCodesql, [stateNo], function(error, otherCode){
          if(error){
            console.error('[qState-other-error]',error);
            let sendData = {
              'result': false,
              'data':'[no other sourcecode]'
            }
            res.send(sendData);
          } else {
            // console.log('[qState-other-success]', result);
            console.log('[qState-other-success]');
            let sendData = {
              'result': true,
              'data':{
                'myCode':myCode,
                'otherCode':otherCode
              }
            }
            res.send(sendData);
          }
        });
      }
    });
  });
  return route;
};
