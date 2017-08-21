let TABLE_NAME = 'member';
let myf = require('./myFunctions.js');
module.exports.userRegister = function(conn, data, callback){
  // 사용자 가입여부 판단
  let sql = 'SELECT * FROM member WHERE email = ?';
  conn.query(sql, [data.email], function(error, search_data){
    if(error){
      console.error('[user-reg]', error);
      callback(error, null);
    } else {
      if(search_data.length > 0 ){
        console.log("[userRegister] 이미 가입된 사용자 입니다.");
        callback(search_data, null);
      } else {
        console.log("[userRegister] 새로운 사용자 입니다.");
        // 미가입 사용자 가입 진행
        myf.myInsert(conn, TABLE_NAME, data, function(error, result){
          if(error){
            callback(error, null);
          } else {
            if(result.insertId > 0){
              let userNo = result.insertId;
              let userEmail = data.email;
              let folderName = `${userNo}_${userEmail.match(/^.{0,5}/gm)}`;
              console.log("[userRegister-success] ", userNo, userEmail, folderName);
              // 사용자 폴더 성생
              myf.copyUserFolder('', folderName, function(error, userFolderPath){
                if(error){
                  console.log('폴더 생성 에러', error);
                  callback(error, null);
                } else {
                  let set = {"path":folderName};
                  let target = {"no":userNo};
                  // 사용자 폴더 경로 저장
                  let sql = 'UPDATE member SET ? WHERE ?';
                  conn.query(sql, [set, target], function(error, result){
                    if(error){
                      callback(error, null);
                    } else {
                      console.log('폴더 생성 완료');
                      data.path = folderName;
                      data.no = userNo;
                      callback(null, data);
                    }
                  });
                }
              });
            } else {
              callback('insert error', null);
            }
          }
        });
      }
    }
  });
};
