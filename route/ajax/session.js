module.exports = function(){
  var route = require('express').Router();

  route.get('/session', function(req, res){
    var session = req.session.passport;
    console.log('[session-check]');
    console.log(session);
    if(session === undefined){
      // 비로그인 상태
      console.log('[로그인이 필요합니다.]');
      res.send({result:false, user:null});
    } else {
      // 로그인 상태
      console.log(`[${session.user.info.name}]님 환영합니다.`);
      res.send({result:true, user:session.user});
    }
  });
  return route;
};
