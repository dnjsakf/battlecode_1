module.exports = function(conn){
  let route = require('express').Router();

  route.get('/main', function(req, res){
    res.sendfile('./public/html/admin/admin.html');
  });

  route.get('/question', function(req, res){
    res.sendfile('./public/html/admin/question.html');
  });

  route.get('/member', function(req, res){
    res.sendfile('./public/html/admin/member.html');
  });

  route.get('/notice', function(req, res){
    res.sendfile('./public/html/admin/notice.html');
  });

  route.get('/report', function(req, res){
    res.sendfile('./public/html/admin/report.html');
  });

  return route;
};
