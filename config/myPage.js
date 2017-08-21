module.exports.get = function(conn, myNo, callback){
  let sql = 'SELECT * FROM member WHERE no = ?';
  conn.query(sql, [myNo], function(error, myInfo){
    if(error){
      callback(error, null);
    } else {
      callback(null, myInfo[0]);
    }
  });
};

module.exports.post = function(conn, data, callback){
  let myf = require('./myFunctions.js');
  myf.password_checker(conn, data.no, data.password, function(error, result){
    if(error){
      callback(error, null);
    } else {
      if(result){
        let sql = 'UPDATE member SET ? WHERE no = ?';
        conn.query(sql, [data.data, data.no], function(error, result){
          if(error){
            callback(error, null);
          } else {
            callback(null, true);
          }
        });
      } else {
        callback(null, false);
      }
    }
  });
};

module.exports.delete = function(conn, myNo, callback){
  let sql = 'DELETE FROM member WHERE no = ?';
  conn.query(sql, [myNo], function(error, result){
    if(error){
      callback(error, null);
    } else {
      callback(null, true);
    }
  });
};
