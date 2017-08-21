module.exports.init = function(express, passport){
  var session = require('express-session');
  var bodyParser = require("body-parser");
  var app = express();

  app.use(session({
    secret: "Acza01!@asd8$!",
    resave: false,
    saveUninitialzied: true
  }));

  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  return app;
};
