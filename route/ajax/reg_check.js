module.exports = function(conn){
  let route = require('express').Router();
  route.get('/memberCheck', function(req, res){
    let _email = req.query.email;
    let sql = 'SELECT * FROM member WHERE email = ?';
    conn.query(sql, [_email], function(error, result){
      if(error){
        res.send({result:false, text:error});
      } else {
        if(result.length > 0){
          res.send({result:false, text:'존재하는 아이디 입니다.'});
        } else{
          res.send({result:true, text:'사용가능한 아이디 입니다.'});
        }
      }
    });
  });
  return route;
};
