let express = require('express'),
		passport = require('passport'),
		moment = require('moment');
let PORT = process.env.PORT || '8080';

// config setting
let app = require('./config/express.js').init(express, passport);
let conn = require('./config/mysql.js').init('battlecode');

// 기본 라우트
let normalRoute = require('./route/normal.js')();
app.use('/', normalRoute);

// ajax : 컴파일, 문제리스트
let userIdCheck = require('./route/ajax/reg_check.js')(conn),
		questions = require('./route/ajax/questions.js')(conn),
		compiler = require('./route/ajax/compiler.js')(conn),
		myAlgo = require('./route/ajax/my_algo.js')(conn),
		session = require('./route/ajax/session.js')(),
		dashboard = require('./route/ajax/dashboard.js')(conn),
		getSourceCode = require('./route/ajax/get_source_code.js')(conn),
		default_source = require('./route/ajax/default_source.js')(conn),
		mypage = require('./route/ajax/myPage.js')(conn),
		notice = require('./route/ajax/notice.js')(conn);
app.use('/ajax', [userIdCheck, compiler, questions,
									myAlgo, session, dashboard, getSourceCode,
									default_source, mypage, notice]);

// 사용자 설정
let userEvent = require('./route/userEvent.js')(conn);
app.use('/user', [userEvent])

// 관리자 문제 등록 페이지
let adminDefault = require('./route/admin/manage_default.js')(conn),
		adminMain = require('./route/admin/manage_main.js')(conn),
		adminMember = require('./route/admin/manage_member.js')(conn),
		adminQuestion = require('./route/admin/manage_question.js')(conn),
		adminNotice = require('./route/admin/manage_notice.js')(conn),
		adminReport = require('./route/admin/manage_report.js')(conn);
app.use('/admin/manage', [adminDefault, adminMain, adminMember, adminQuestion, adminNotice, adminReport]);

// 로컬, 페이스북 로그인
let auth = require('./config/auth.js')(app, passport, conn);
app.use('/auth', [auth]);

// 크롤러
let backjoon = require('./config/crawler/backjoon.js')(conn);
app.use('/crawler', [backjoon]);

// 테스트 라우터
let test = require('./route/tester/test.js')();
app.use('/test', [test]);

// 서버 연결
app.listen(PORT, function(req, res){
	console.log('server connection :', PORT);
});
