$(function(){
  let $elements = {
    'notice':{
      'section':{
        'board':$('section.notice-board'),
        'list':$('section.notice-list'),
        'viewer':$('section.notice-viewer'),
      },
      'topic':$('div.topic-container'),
      'list':$('tbody.list'),
      'listremote':$('nav.notice-list-controller'),
      'viewer':{
        'info':$('li.notice-info'),
        'contents':$('textarea.notice-contents'),
      },
      'button':$('button#btn-notice'),
    },
  }
  // 맨 처음 보여줄 리스트 가져오기
  let getDataSize = {
    'initPage':true,
    'page': 1,    // 최초 페이지 번호
    'rows': 10,   // 몇개를 보여줄 것인가
  }
  let movingPanel = new MovingPanel();
  // 클릭 이벤트
  // 리스트 initializge
  notice_init = function(){
    let $board = $elements.notice.section.board;
    movingPanel.stop()
    // 페이지 버튼 생성
    ajax_get_notice_count(function(result, data){
      if(result){
        let pagesize = Math.ceil(data / getDataSize.rows),
            startPage = 1,
            tag = '';
        $elements.notice.listremote.empty();
        for(; startPage <= pagesize; startPage++){
          tag = `<button type='button' onClick='notice_list_page(${startPage})'>${startPage}</button>`;
          $elements.notice.listremote.append(tag);
        }
      }
    });
    ajax_get_notice_list('list', $elements.notice.list, getDataSize, function(){});
    ajax_get_notice_list('topic',$elements.notice.topic, null, function(result, $container){
      if(result){
        // 움직이는 공지사항
        movingPanel.init($container, 0, 1500, 300);
        movingPanel.start();
        // 마우스 올리면 멈춤
        movingPanel.elements.items.mouseover(function(){
          movingPanel.stop()
        });
        // 마우스 치우면 다시 움직임
        movingPanel.elements.items.mouseout(function(){
          movingPanel.start();
        });
      }
    });
    // fase in
    $board.removeClass('hidden');
    $board.animate({'opacity':1}, 300, function(){});
  };


  // 공지사항 리스트 클릭 이벤트
  // 공지사항 디테일 정보 가져오기
  notice_viewer = function(noticeNo){
    let data = {'no':noticeNo}
    ajax_get_notice_detail($elements.notice.viewer, data, function(result){
      if(result){
        $elements.notice.section.viewer.removeClass('hidden');
        $elements.notice.section.list.addClass('hidden');
      }
    });
  }


  // 뒤로가기 클릭 이벤트
  notice_back = function(){
    $elements.notice.section.viewer.addClass('hidden');
    $elements.notice.section.list.removeClass('hidden');
  }


  // 페이지 버튼 클릭 이벤트
  notice_list_page = function(page){
    let _updateList = {
      'initPage':false,
      'page': page,    // 최초 페이지 번호
      'rows': getDataSize.rows,   // 몇개를 보여줄 것인가
    }
    ajax_get_notice_list('list', $elements.notice.list, _updateList, function(){});
  };

  // 공지사항 닫기
  notice_cancle = function(){
    // FadeOut
    let $board = $elements.notice.section.board;
    $board.animate({'opacity':0}, 300, function(){
      movingPanel.delete();
      $board.addClass('hidden');
    });
  };
});
