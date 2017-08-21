$(function(){
  let $elements = {
    'display':$('input.user-display-name'),
    'mypage':{
      'email':$('div.auth.info-contents.email > input'),
      'name':$('div.auth.info-contents.name > input'),
      'date':$('div.auth.info-contents.joindate > input'),
      'pwd':$('div.auth.info-contents.password > input'),
      'pwdCheck':$('div.auth.info-contents.password-check > input'),
    },
    'nonauth':{
      'pwd':$('div.non-auth.info-contents.password > input'),
      'pwdCheck':$('div.non-auth.info-contents.password-check > input'),
    },
    'notice':{
      'my-name': $('div.auth.info-contents.name > span'),
      'my-password':$('div.auth.info-contents.password > span'),
      'my-password-check':$('div.auth.info-contents.password-check > span'),
      'non-auth-my-password':$('div.non-auth.info-contents.password > span'),
      'non-auth-my-password-check':$('div.non-auth.info-contents.password-check > span'),
    }
  };
  let patterns = {
    'my-email': /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    'my-name': /^[a-zA-Z]\w{2,8}$/u,
    'my-password': /^[^\s\?\$\(\)\{\}\[\]]{8,12}$/,
    'non-auth-my-password': /^[^\s\?\$\(\)\{\}\[\]]{8,12}$/,
  }

  // 입력한 정보들이 모두 유효한지 확인
  validCheck = function(notice){
    let noticeSize = Object.keys(notice).length;
    let validCount = 0;
    for(let i in notice){
      let valid = notice[i].text();
      if(valid === 'valid'){
        validCount += 1;
      } else {
        return false;
      }
    }
    return validCount===noticeSize;
  }

  // mypage에서 name, pwd, pwdcheck를 입력하면,
  // 유효성 겁사해줌
  inputPatternCheck = function(e){
    e.preventDefault();
    let data = e.target.value,
        elName = e.target.name;

    // my-password-check일 경우에,
    // 비밀번호가 같은지 확인해줌.
    if(elName === 'my-password-check'){
      patterns[elName] = RegExp("^"+$elements.mypage.pwd.val()+"$");
    } else if(elName === 'non-auth-my-password-check'){
      patterns[elName] = RegExp("^"+$elements.nonauth.pwd.val()+"$");
    }

    if(Object.keys(patterns).indexOf(elName) > -1){
      let $noticeItem = $elements.notice[elName];
      if(patterns[elName].test(data)){
        if($noticeItem.hasClass('invalid')){
          $noticeItem.removeClass('invalid');
          $noticeItem.addClass('valid');
        }
        $noticeItem.text('valid');
      } else {
        if($noticeItem.hasClass('valid')){
          $noticeItem.removeClass('valid');
          $noticeItem.addClass('invalid');
        }
        $noticeItem.text('invalid');
      }
    }
  }

  // keyPressPatternCheck
  $elements.mypage.name.keyup(inputPatternCheck);
  $elements.mypage.pwd.keyup(inputPatternCheck);
  $elements.mypage.pwdCheck.keyup(inputPatternCheck);
  $elements.nonauth.pwd.keyup(inputPatternCheck);
  $elements.nonauth.pwdCheck.keyup(inputPatternCheck);


  handleMyPageGet = function(){
    let $myPageTitle = $('li.right-title.mypage');
    let connection = userState.state.connection;
    if(connection){
      let data = userState.data.info;
      $myPageTitle.click();

      $elements.mypage.email.val(data.email);
      $elements.mypage.name.val(data.name);
      $elements.mypage.date.val(data.date);
      $elements.mypage.pwd.val('');
      $elements.mypage.pwdCheck.val('');

      // 세션정보 업데이트
      _ajax_session_check();  // 여기서 userState를 변경시켜줌
    }
  };

  handleMyPasswordCheck = function(){
    let password = {
      'password': $elements.nonauth.pwd.val(),
      'passwordCheck':$elements.nonauth.pwdCheck.val(),
    }
    if(password.password === password.passwordCheck){
      alter('비밀번호 일치');
    } else {
      alter('비밀번호가 일치하지 않습니다.');
    }
  };
  handleMyPageUpdate = function(){
    let postData = {
      'no':userState.data.info.no,
      'data':{
        'name':$elements.mypage.name.val(),
      },
      'password':{
        'pwd':$elements.mypage.pwd.val(),
        'pwdCheck':$elements.mypage.pwdCheck.val(),
      },
    }
    if(validCheck($elements.notice)){
      ajax_post_my_info(postData, function(error, result){
        $elements.mypage.pwd.val('');
        $elements.mypage.pwdCheck.val('');
        $elements.notice['my-name'].text('');
        $elements.notice['my-password'].text('');
        $elements.notice['my-password-check'].text('');

        if(result){
          alert('수정완료');
          handleMyPageGet();
        } else {
          alert('수정오류');
          if(error === 'nomatch'){
            // $elements.mypage.pwd.attr({'placeHolder':'no match'});
            $elements.notice['my-password-check'].text('2 password no matched');
          } else if(error === 'pwdcheck'){
            // $elements.mypage.pwd.attr({'placeHolder':'pwd check error'});
            $elements.notice['my-password'].text('retry');
          }

          $elements.mypage.pwd.focus();
        }
      });
    } else {
      console.log('[invalid]');
    }
  };
  handleMyPageDelete = function(){
    let delData = {
      'no' : userState.data.info.no,
      'password':{
        'pwd':$elements.mypage.pwd.val(),
        'pwdCheck':$elements.mypage.pwdCheck.val(),
      },
    }
    // DB 비밀번호도 체크해야됨
    if(confirm("탈퇴하시겠습니까?") === true){
      ajax_del_my_info(delData, function(error, result){
        if(error){
          console.log('탈퇴에러');
        } else {
          alert('탈퇴가 완료되었습니다.');
          document.location.href = '/';
        }
      });
    }
  };
});
