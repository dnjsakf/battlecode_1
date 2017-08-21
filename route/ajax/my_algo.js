module.exports = function(conn){
  let route = require('express').Router();
  let myf = require('../../config/myFunctions.js');

  // 문제 풀기 선택 이벤트
  // 문제 폴더 생성
  // 소스코드가 어짜피 디비에 저장되니까 사용 안해도될듯
  // route.post('/solve', function(req, res){
  //   let algoNo = req.body.algoNo,
  //       algoName = req.body.algoName;
  //
  //   // 문제 풀기를 선택하면 session에 현재 문제 등록
  //   req.session.algoinfo = {
  //     "no" : algoNo,
  //     "name" : algoName
  //   };
  //   let userFolderName = req.session.passport.user.path;
  //   let myAlgoName = `${algoNo}_${algoName}`;
  //   myf.copyUserFolder(userFolderName, myAlgoName, function(error, result){
  //     if(error){
  //       console.log("[my-algo-insert-error]", error);
  //       res.send({result:false, text:error});
  //     } else {
  //       console.log("[my-algo-insert-success]");
  //       res.send({result:true, text:result});
  //     }
  //   });
  // });

  // 내가 푼 문제 리스트 가져오기
  route.get('/myAlgoList', function(req, res){
    let session = req.session,
        userNo = session.passport.user.info.no;

    let sql = 'SELECT * FROM qState WHERE mNo = ?';
    conn.query(sql, [userNo], function(error, myAlgoNo){
      if(error){
        // 실패
        res.send({result:false, data:''});
      } else {
        if(myAlgoNo.length > 0){
          // 성공
          // 내가 푼 문제들 qNo
          let numbers = [];
          for(let i in myAlgoNo){
            let no = myAlgoNo[i].qNo;
            if(numbers.indexOf(no) === -1){
              numbers.push(no);
            }
          }
          console.log(numbers);
          // 가져올 문제 번호 만큼 조건 걸어줘야됨;
          let conditions = "?";
          for(let j=0; j < numbers.length-1; j++){ conditions += ", ?" }
          let sql = `SELECT * FROM questions WHERE no IN (${conditions})`;
          conn.query(sql, numbers, function(error, myAlgoInfo){
            if(error){
              console.log("[my-algo-error]", error);
              res.send({result:false, data:''});
            } else {
              let tags = {};
              for(let i in myAlgoInfo){
                let no = myAlgoInfo[i].no;
                let subject = myAlgoInfo[i].subject;
                console.log('[my-algo]', no, subject);
                tags[i] = `<li class="algorithm ${no} isMine" value="${subject}">${subject}</li>`;
              }
              // console.log(tags);
              console.log(tags);
              res.send({result:true, data:tags});
            }
          });
        } else {
          res.send({result:false, data:''});
        }
      }
    });
  });
  return route;
};
