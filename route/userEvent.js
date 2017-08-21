module.exports = function(conn){
  let route = require('express').Router(),
      moment = require('moment'),
      myf = require('../config/myFunctions.js');

  route.post('/setting', function(req, res){
    let myNo = req.session.passport.user.info.no;
    let editor = {
      'setting_editor_theme': req.body.theme,
      'setting_editor_language': req.body.language,
      'setting_editor_font': req.body.font,
      'setting_editor_fontsize': req.body.fontsize,
    }

    let sql = 'UPDATE member SET ? WHERE no = ?';
    conn.query(sql, [editor, myNo], function(error, result){
      if(error){
        res.redirect('/?result=error');
      } else {
        req.session.passport.user.editor = {
          'language' : editor.setting_editor_language,
          'theme' : editor.setting_editor_theme,
          'font' : editor.setting_editor_font,
          'fontsize' : editor.setting_editor_fontsize,
        }
        res.redirect('/?result=success');
      }
    });
  });

/*
  no     | int(10) | NO   | PRI | NULL    | auto_increment |
 | qNo    | int(10) | NO   |     | NULL    |                |
 | mNo    | int(10) | NO   |     | NULL    |                |
 | type   | text    | NO   |     | NULL    |                |
 | detail | text    | NO   |     | NULL    |                |
 | date
*/
  route.post('/report', function(req, res){
    let data = req.body;
		data.date = moment().format('YYYY-MM-DD');

		myf.myInsert(conn, 'report', data, function(error, result){
			if(error){
				// res.send({result:false, data:error});
        res.redirect('/?report=fail')
			} else {
				// res.send({result:true, data:result});
        res.redirect('/?report=success')
			}
		});
  });
  return route;
}
