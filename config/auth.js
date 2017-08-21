module.exports = function(app, passport, conn){
  let route = require('express').Router();
  let myf = require('./myFunctions.js');
  let userDB = require('./userDB.js');
  let moment = require('moment');

  let pbkdf2Password = require('pbkdf2-password');
  let hasher = pbkdf2Password();
  let default_salt = '#!@#!@zxcvasdlb0@ASDFSDF';

  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function(userProfile, done){
    console.log("[serializeUser]");
    console.log(userProfile);
    let user = {
      'info':{
        'no':userProfile.no,
        'email':userProfile.email,
        'name':userProfile.name,
        'date':userProfile.date,
        'path':userProfile.path,
      },
      'editor':{
        'language':userProfile.setting_editor_language,
        'theme':userProfile.setting_editor_theme,
        'font':userProfile.setting_editor_font,
        'fontsize':userProfile.setting_editor_fontsize,
      }
    }
    done(null, user);
  });
  passport.deserializeUser(function(userProfile, done){
    console.log("[deserializeUser]");
    console.log(userProfile);
    done(null, userProfile);
  });
  let FacebookStrategy = require('passport-facebook').Strategy;
  passport.use(new FacebookStrategy({
    	clientID: '1905196089750902',
    	clientSecret: '4f7aad86aaf1244414aa6302a778bb6f',
    	callbackURL: "/auth/facebook/callback",
    	profileFields:['id', 'displayName', 'emails']
    	// profileFields:['id', 'photos', 'gender','link','locale','name','timezone','updated_time', 'verified','displayName', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
      let username;
      if(profile.emails[0].value === undefined){
        username = "[fb_no_email] "+profile.displayName;
      } else{
        username = profile.emails[0].value;
      }
      console.log('[facebook-login] ', username);
      let sql = 'SELECT * FROM member WHERE email = ?';
      conn.query(sql, [username], function(error, selectedResult){
        if(error){
          console.log('[Fb-login-error]', error);
        } else {
          if(selectedResult.length > 0){
            // 이미 가입된 사용자
            // DB에 저장된 데이터를 session.passport에 저장
            console.log("Welcome", selectedResult[0].email);
            console.log('[faceboock]', selectedResult[0]);
            return done(null, selectedResult[0]);
          } else {
            // 미가입 사용자
            // 페이스북 정보(profile)를
            // 데이터(data)로 가공해서 session.passport에 저장
            let data = {
              'email':username,
              'name':profile.displayName,
              'date':moment().format('YYYY-MM-DD')
            };
            userDB.userRegister(conn, data, function(error, regResult){
              console.log('[facebook-login-insertResult]', regResult);
              if(error){
                console.log("[가입실패]");
                return done(null, false);
              } else{
                console.log("[가입성공]");
                return done(null, regResult);
              }
            });
          }
        }
      });
    }
  ));
  route.get('/facebook',
  	passport.authenticate(
  		'facebook',
  		{
  			scope: ['email']
  		}
  	)
  );
  route.get('/facebook/callback',
    passport.authenticate(
  		'facebook',
  		{
  			successRedirect: '/',
  		 	failureRedirect: '/auth/login'
  		 }
  	 )
  );
    let LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(
      function(username, password, done){
        let sql = 'SELECT * FROM member WHERE email = ?';
        conn.query(sql, [username], function(error, result){
          if(error){
            console.error('[local]', error);
          }else{
            if(result.length > 0){
              let user = result[0];
              myf.password_checker(conn, user.no, password, function(error, result){
                if(error){
                  console.log(error);
                  return done(null, false);
                } else {
                  if(result){
                    console.log("Welcome", username);
                    return done(null, user);
                  } else {
                    console.log("Welcome", 'asdfasdfasdfs');
                    return done(null, false);
                  }
                }
              });
            }else{
            // 미가입 사용자
            // 회원가입을 별도로 해야됨
              return done(null, false);
            }
          }
        });
      }
    ));
    route.post(
      '/login',
      passport.authenticate(
        'local', // Strategy
        {
          successRedirect: '/',
          failureRedirect: '/auth/login',
          failureFlash: false
        }
      )
    );


    /**********************/
    /******* 로그인 *******/
    /**********************/
    route.get(['/login'], function(req, res){
      res.sendfile('./public/html/login/login.html');
    });

    /**********************/
    /****** 로그아웃 ******/
    /**********************/
    route.post('/logout', function(req, res){
      if(req.session.passport){
        let logout_user = req.session.passport.user;
        req.session.destroy(function(){
          console.log("[logout-session] Bye...", logout_user.email, logout_user.name);
          res.redirect('/');
        });
      } else {
        console.log("[logout-no-session] 잘못된접근입니다.");
        res.redirect('/');
      }
    });

    /**********************/
    /****** 회원가입 ******/
    /**********************/
    route.post('/register', function(req, res){
      let pwd = req.body.password;
      myf.userPatternCheck(req.body, function(error, result){
        if(error){
          console.log("[가입실패] ", error);
          res.redirect('/auth/login?regError='+error);
        } else {
          hasher(
            {
              password: pwd,
              salt: default_salt
            },
            function(error, password, salt, hash){
              let data = {
                'email': req.body.username,
                'password': hash,
                'pwd_salt': salt,
                'name': req.body.displayName,
                'date': moment().format('YYYY-MM-DD')
              };
              userDB.userRegister(conn, data, function(error, result){
                if(error){
                  console.log("[가입실패]", error);
                  res.redirect('/auth/login?register=fail');
                } else{
                  console.log("[가입성공]");
                  res.redirect('/auth/login?register=success');
                }
              });
            }
          );
        }
      });
    });
    return route;
};
