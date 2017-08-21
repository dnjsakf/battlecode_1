module.exports = function(conn){
  let route = require('express').Router();
  route.get('/questions/default', function(req, res){
    let qNo = req.query.qNo;
    let language = req.query.language;
    let sql = 'SELECT sourceCode '+
              'FROM default_source '+
              'WHERE qNo = ? '+
              'AND language= ?';
    conn.query(sql, [qNo, language], function(error, result){
      if(error){
        res.send({result:false, data:error});
      } else {
        if(result.length > 0){
          res.send({result:true, data:result[0].sourceCode});
        } else {
          res.send({result:false, data:'none'});
        }
      }
    });
  });
  return route;
}
