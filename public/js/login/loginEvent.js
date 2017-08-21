$(function(){
  let $elements = {
    'form': $('form#logForm'),
    'inputblock':{
      'mem': $('div.member'),
      'nonmem': $('div.non-member'),
      'reg': $('div.user-register'),
      'regctrl': $('div.non-member > div.regController'),
    },
    'reg':{
      'username':$('input.user-info.username'),
      'password':$('input.user-info.password'),
      'password-check':$('input.user-info.password-check'),
      'displayName':$('input.user-info.displayName'),
    },
    'button':{
      'reg' : $('div.non-member > input[type=button]'),
      'regctrl': $('div.non-member > div.regController > input[type=button]'),
      'logctrl': $('div.member > input[type=button]'),
    }
  }
  let patterns = {
    'username': /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    'password': /^[^\s\?\$\(\)\{\}\[\]]{8,12}$/,
    'displayName': /^[a-zA-Z]\w{2,8}$/u,
  }

  // 실시간 아이디 중복체크
  $elements.reg.username.keyup(function(e){
    if(!$(this).hasClass('regmode')){
      ajax_memberCheck($(this), $(this).val())
    }
    if(e.which === 13){
      $('input[type=button].local').click();
    }
  });
  $elements.reg.password.keyup(function(e){
    // enter
    if(e.which === 13){
      $('input[type=button].local').click();
    }
  });


  // 로컬 & 페이스북 로그인 실행
  $elements.button.logctrl.click(function(){
    if($(this).hasClass('local')){
      let check = {
        'username': $elements.reg.username,
        'password': $elements.reg.password,
      }
      // 이메일과 패스워드 형식 체크
      if(validCheck(check)){
        $elements.form.attr('method', 'post');
        $elements.form.attr('action', '/auth/login');
      } else {
        console.log('[email-pwd valid error]');
      }
    } else if($(this).hasClass('facebook')){
      $elements.form.attr('method', 'get');
      $elements.form.attr('action', "/auth/facebook");
    }
    $elements.form.submit();
  });

  // register 버튼 클릭 이벤트
  $elements.button.reg.click(function(){
    $(this).addClass('hidden');

    $elements.reg.username.addClass('regmode');   // 이메일과 패스워드 입력창을
    $elements.reg.password.addClass('regmode');   // 회언가입 모드로 변경

    $elements.form.find('input[type=text], input[type=password]').val('')
    if($(this).hasClass('register')){
      if($elements.inputblock.mem.hasClass('hidden')){
        $elements.inputblock.mem.removeClass('hidden');
        $elements.inputblock.reg.addClass('hidden');
        $elements.inputblock.regctrl.removeClass('hidden');
      } else {
        $elements.inputblock.mem.addClass('hidden');
        $elements.inputblock.reg.removeClass('hidden');
        $elements.inputblock.regctrl.removeClass('hidden');
      }
    }
  });

  $elements.button.regctrl.click(function(){
    if($(this).hasClass('submit')){
      if(validCheck($elements.reg)){
        $elements.inputblock.regctrl.removeClass('hidden');

        $elements.reg.username.removeClass('regmode');
        $elements.reg.password.removeClass('regmode');

        $elements.form.attr('method', 'post');
        $elements.form.attr('action', '/auth/register');
        $elements.form.submit();

      } else {
        $elements.reg.username.focus();
      }
    } else {
      document.location = '/auth/login';
    }
  });

  // 입력한 값이 유효한지 확인해줌
  validCheck = function(checkObject){
    let checkObjectSize = Object.keys(checkObject).length;
    let validCount = 0;
    for(let i in checkObject){
      let valid = checkObject[i].hasClass('valid');
      if(valid){
        validCount += 1;
      } else {
        return false;
      }
    }
    return validCount===checkObjectSize;
  }
  // mypage에서 name, pwd, pwdcheck를 입력하면,
  // 유효성 겁사해줌
  inputPatternCheck = function(e){
    e.preventDefault();
    let data = e.target.value;
    let elName = e.target.name;

    // password-check일 경우에,
    // 비밀번호가 같은지 확인해줌.
    if(elName === 'password-check'){
      patterns['password-check'] = RegExp("^"+$elements.reg.password.val()+"$");
    }

    if(Object.keys(patterns).indexOf(elName) > -1){
      let $noticeItem = $elements.reg[elName];
      if(patterns[elName].test(data)){
        if($noticeItem.hasClass('invalid')){
          $noticeItem.removeClass('invalid');
          $noticeItem.addClass('valid');
        }
      } else {
        if($noticeItem.hasClass('valid')){
          $noticeItem.removeClass('valid');
          $noticeItem.addClass('invalid');
        }
      }
    }
  }

  // keyPressPatternCheck
  $elements.reg.username.keyup(inputPatternCheck);
  $elements.reg.password.keyup(inputPatternCheck);
  $elements.reg['password-check'].keyup(inputPatternCheck);
  $elements.reg.displayName.keyup(inputPatternCheck);
});
