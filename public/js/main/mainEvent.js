$(function(){
  // 로그인 상태 체크
  userState = {
    'state':{
      'connection':false,
      'location':{
        'left':'algo-list',
        'right':'home',
      },
    },
    'data':{
    },
    'dashboard':{
      'page':1,
      'rows':10
    },
    init : function(){
      this.state = {
        'connection':false,
        'location':{
          'left':'algolist',
          'right':'home',
        },
      }
      this.data = {
        'algorithm':{},
      };
    }
  };
  // 로그인 여부 확인 이벤트
  _ajax_session_check = function($elements){
    console.log('[ajax-session_check]');
    // header children tags

    $.ajax({
      url:"/ajax/session/",
      type:"GET",
      error:function(error){
        console.log(error);
      },
      success:function(result){
        if(result.result){
          console.log("[회원]",);
          $elements.session.username.val("["+result.user.info.name+"]님");

          userState.state.connection = true;
          userState.data = result.user;
          userState.data.algorithm = {};

          $elements.solve.removeClass('hidden');     // 문제풀기 버튼 보이기
          $elements.title.left.myalgo.removeClass('hidden'); // 타이틀 보이기
          $elements.contents.right.scroll.addClass('connected');

          $elements.session.userButtons.children('.login').addClass('hidden');
          $elements.session.userButtons.children('.logout').removeClass('hidden');
          if(result.user.info.name === 'admin'){
            if($elements.session.adminButtons.hasClass('hidden')){
              $elements.session.adminButtons.removeClass('hidden');
            }
          } else {
            if(!$elements.session.adminButtons.hasClass('hidden')){
              $elements.session.adminButtons.addClass('hidden');
            }
          }

          $('img#btn-setting').show();
          // _ajax_algoList();   // 알고리즘 문제 정보
          _ajax_myAlgoList($elements.contents.left.myalgo); // 내가 푼 문제 정보

        } else{
          console.log("[비회원]");
          $elements.session.username.val('[로그인 필요]');

          userState.init();

          $elements.solve.addClass('hidden');        // 문제풀기 버튼 가리기
          $elements.title.left.myalgo.addClass('hidden'); // 타이틀 가리기
          $elements.contents.right.scroll.removeClass('connected');

          $elements.session.userButtons.children('.admin').addClass('hidden');
          $elements.session.userButtons.children('.logout').addClass('hidden');
          if(!$elements.session.adminButtons.hasClass('hidden')){
            $elements.session.adminButtons.addClass('hidden');
          }
          $('img#btn-setting').hide();
        }
      },
      complete:function(){
        console.log("[확인완료]", userState);
        if(userState.state.connection){
          let $main_textarea = $('#editor');
          let theme = userState.data.editor.theme,
              font = userState.data.editor.font,
              fontsize = userState.data.editor.fontsize,
              language = userState.data.editor.language;
          main_editor = new codemirror_f($main_textarea, theme, font, fontsize);
          main_editor.init(false);
          main_editor.setTheme(theme);
          main_editor.setFontFamily(font);
          main_editor.setFontSize(fontsize);
          console.log(language);
          let $editorLanguageSelect = $("select.languageSelector"),
              $settingFontsizeSelect = $('select.editor-fontsize-selecter'),
              $settingFontfamilySelect = $('select.editor-fontfamily-selecter'),
              $settingLanguageSelect = $('select.editor-language-selecter'),
              $settingThemeSelect = $('select.editor-theme-selecter');

          $editorLanguageSelect.val(language).prop("selected", true);
          $settingLanguageSelect.val(language).prop("selected", true);
          $settingFontfamilySelect.val(font).prop("selected", true);
          $settingFontsizeSelect.val(fontsize).prop("selected", true);
          $settingThemeSelect.val(theme).prop("selected", true);
        }
      }
    });
  };


  _ajax_algoList = function($leftAlgoList, callback){
    $.ajax({
      url: "/ajax/question",
      type: "GET",
      error:function(error){
        console.error(error);
      },
      success: function(result){
        if(result.result === true){
          data = result.data;
          for(var i in data){
    			  $leftAlgoList.append(data[i]);
          }

          callback(true);
        }
      },
      complete: function(){
        console.log('[알고리즘 리스트 가져오기 종료]');
      }
    });
  };


  // 로그인 되어있을 때 적용해야됨
  _ajax_myAlgoList = function($leftMyAlgo){
    $.ajax({
      url:"/ajax/myAlgoList/",
      type:'GET',
      error:function(error){
        console.log("[ajax-error-myAlgoList]",error);
      },
      success:function(result){
        if(result.result === true){
          data = result.data;
          $leftMyAlgo.empty();
          for(var i in data){
      			 $leftMyAlgo.append(data[i]);
          }
        }
      },
      complete: function(){
        console.log('[내 알고리즘 리스트 가져오기 종료]');
      },
    });
  };
});
$(function(){
  console.log('window.ready');
  let $elements = {
    'session': {
      'username' : $('#connectForm input.user-display-name'),
      'userButtons' : $('#connectForm div.user-bottons'),
      'adminButtons' : $('#connectForm div.admin-bottons'),
    },
    'title':{
      'left':{
        'myalgo':$("li.left-title.my-algo-list"),
      },
      'right':{
        'all':$("li.right-title"),
      },
    },
    'contents':{
      'left':{
        'algolist':$('ul.left-contents.algo-list'),
        'myalgo':$('ul.left-contents.my-algo-list'),
      },
      'right':{
        'scroll':$('section.scroll-contents'),
      }
    },
    'solve':$("footer.algo-solve"),
  };
  _ajax_session_check($elements);
  _ajax_algoList($elements.contents.left.algolist, function(result){});

  let $closeTabButtons = $('button.closeTabButton');
  $closeTabButtons.click(function(event){
    event.stopPropagation();
    let $closeTarget = $($(this).val());
    $closeTarget.addClass('hidden');

    let $showTitle = $closeTarget.parents('ul').find('li:not(.hidden)').last();
    $showTitle.click();
  });
});
