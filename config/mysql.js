module.exports.init = function(dbName){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"wjddns1",
    database: dbName
  });
  conn.connect(function(error){
    if(error){
      console.log(error);
      throw error;
    } else {
      console.log("Mysql Connection!!!");
    }
  });
  return conn;
};
