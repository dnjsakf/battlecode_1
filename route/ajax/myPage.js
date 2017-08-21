module.exports = function(conn){
  let route = require('express').Router(),
      myPageCon = require('../../config/myPage.js');

  // 조회
route.get('/mypage', function(req, res){;
    let no = req.session.passport.user.info.no;
    myPageCon.get(conn, no, function(error, result){
      if(error){
        res.send({result:false, data:error});
      } else {
        res.send({result:true, data:result});
      }
    });
  });

  // 수정
  route.post('/mypage', function(req, res){;
    let _data = req.body;
    myPageCon.post(conn, _data, function(error, result){
      if(error){
        res.send({result:false, data:error});
      } else {
        if(result){
          req.session.passport.user.info.name = _data.data.name;
          res.send({result:true, data:result});
        } else {
          res.send({result:false, data:error});
        }
      }
    });
  });

  // 삭제
  route.delete('/mypage', function(req, res){;
    let no = req.session.passport.user.info.no;
    myPageCon.delete(conn, no, function(error, result){
      if(error){
        res.send({result:false, data:error});
      } else {
        req.session.destroy(function(){
          console.log("[out-member] Bye...");
          res.send({result:true, data:result});
        });
      }
    });
  });

  // 삽입
  // route.put('/mypage', function(req, res){;
  //   let no = req.session.passport.user.no;
  //   let data = req.query.putData;
  //
  //   console.log('[mypage-put]', no, data);
  //   res.send({result:false, data:''});
  // });
  return route;
}
