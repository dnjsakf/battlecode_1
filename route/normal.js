module.exports = function(){
  var route = require('express').Router();
  route.get('/', function(req, res){
    console.log('[session-check-main]');
    console.log(req.session.passport);

    res.sendfile('./public/html/main/main.html');
  });
  return route;
};
