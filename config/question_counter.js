module.exports.counter = function(conn, questionNo, fieldName ,callback){
  let sql = `UPDATE questions SET ${fieldName} = ${fieldName} + 1 WHERE ?`,
      where = {'no' : questionNo};
  conn.query(sql, [where], function(error, result){
    if(error){
      callback(error, null);
    } else {
      callback(null, true);
    }
  });
};

module.exports.persent = function(conn, questionNo, fieldName, callback){
  let sql = `UPDATE questions SET ${fieldName} = ` +
            `(SELECT avg(result) FROM qState WHERE ?) ` +
            `WHERE ?`,
      where = [{'qNo':questionNo}, {'no':questionNo}];
  conn.query(sql, where, function(error, result){
    if(error){
      callback(error, null);
    } else {
      console.log(result);
      callback(null, true);
    }
  });
};

// 전체적으로 계산하여 값을 초기화 시키는 방법
// module.exports.perfect = function(conn, questionNo, fieldName, callback){
//   let sql = `UPDATE questions SET ${fieldName} = ` +
//             `(SELECT count(result) FROM qState WHERE ? AND result = 100) ` +
//             `WHERE ?`,
//       where = [{'qNo':questionNo}, {'no':questionNo}];
//   conn.query(sql, where, function(error, result){
//     if(error){
//       callback(error, null);
//     } else {
//       callback(null, true);
//     }
//   });
// };
