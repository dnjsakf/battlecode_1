module.exports.timer = function(){
  let moment = require('moment');
  let myTimer = function(){};
  myTimer.prototype = {
  	start: function(){
  		this._time = moment(new Date().getTime());
  	},
  	end: function(){
  		return moment(new Date().getTime()).diff(this._time);
  	}
  };
  return new myTimer;
};

// 사용자가 풀어본 문제가 닮길 폴더
// 문제별로 폴더를 생성하지 않아도 된다면,
// foldername 변수는 필요 없음
module.exports.copyUserFolder = function(userFolderPath, folderName, callback){
  let path = require('path');
  let fs = require('fs-extra');
  let defaultPath = path.join(__dirname, "../data/users", userFolderPath);
  let copyFolderPath = path.join(defaultPath, "init");
  let copyedFolderName = path.join(defaultPath, folderName);

  console.log('[createFolder] from', copyFolderPath);
  console.log('[createFolder] to', copyedFolderName);

  fs.copy(copyFolderPath, copyedFolderName)
  .then(function(result){
    console.log('[UserFolderCreated]',result);
    callback(null, copyedFolderName);
  })
  .catch(function(error){
    console.error('[FolderCopyError]', error);
    callback(error, false);
  });
};


module.exports.myInsert = function(conn, TABLENAME, DATA, callback){
  let SHOW_RESULT = false;
  let _data = [];
  for(let i in DATA){ _data.push(DATA[i]); }
  let sql = `INSERT INTO ${TABLENAME}(${Object.keys(DATA)}) VALUES (?)`;
  conn.query(sql, [_data], function(error, result){
    if(error){
      console.log(error);
      callback(error, null);
    } else{
      if(SHOW_RESULT) console.log(`insert ${DATA}`, result);
      callback(null, result);
    }
  });
};

// 유저 정보 패턴 체크
module.exports.userPatternCheck = function(data, callback){
  let email = data.username,
      pwd = data.password,
      pwdCheck = data['password-check'],
      name = data.displayName;

  let pattern = {
    'email': /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    'name': /^[a-zA-Z]\w{2,8}$/u,
    'password': /^[^\s\?\$\(\)\{\}\[\]]{8,12}$/,
  };

  if(!pattern.email.test(email)){
    callback('email-error', null);
  } else {
    if(!pattern.name.test(name)){
      callback('name-error', null);
    } else {
      if(!pattern.password.test(pwd)){
        callback('pwd-error', null);
      } else {
        if(pwd === pwdCheck){
          callback(null, true);
        } else {
          callback('pwd-check-error', null);
        }
      }
    }
  }
}

// 유저 비밀번호 체크
module.exports.password_checker = function(conn, userkey, _password, callback){
  let pbkdf2Password = require('pbkdf2-password');
  let hasher = pbkdf2Password();

  let ori_pwd, chk_pwd;

  if(typeof _password === 'object'){
    // 패스워드 변경.
    ori_pwd = _password.pwd;
    chk_pwd = _password.pwdCheck;
  } else if (typeof _password === 'string'){
    // 비밀번호만 체크할 경우,
    // 로그인, 회원정보수정.
    ori_pwd = chk_pwd = _password;
  }

  if(ori_pwd === chk_pwd){
    let sql = 'SELECT password, pwd_salt FROM member WHERE no = ?';
    conn.query(sql,[userkey], function(error, user){
      if(error){
        // mysql 에러
        callback(error, null);
      } else {
        hasher(
          {
            password: ori_pwd,
            salt:user[0].pwd_salt
          }, function(error, pwd, salt, hash){
            if(hash === user[0].password){
              // 모두 일치
              callback(null, true);
            } else {
              // 입력한 패스워드와 디비의 패스워드가 불일치
              callback('pwdcheck', false);
            }
          }
        );
      }
    });
  } else {
    // 입력한 패스워드와 확인용 패스워드가 일치하지 않음.
    callback('nomatch', null);
  }
}
