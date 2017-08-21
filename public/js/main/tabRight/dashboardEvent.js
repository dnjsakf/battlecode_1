$(function(){
  let $elements = {
    'contents':{
      'left':{
        'selectedalgo':$('ul.left-contents.selected-algo-name'),
      },
      'right':{
        'all':$('ul.right-contents'),
        'scroll':$('section.scroll-contents'),
        'slider':$('section.slider-contents'),
      },
    },
    'dashboard':{
      'list':{
        'board': $('ul.dashboard'),
        'table': $('table.question-detail-dashboard'),
        'tbody': $('tbody.detail-dashboard.ajax-data'),
        'compares': '.compare',
      },
      'score':{
        'challenger': $('li#challenger-score'),
        'perfect': $('li#perfect-score'),
        'persent': $('li#persent-score'),
        'c': $('li#lang-c-score'),
        'java': $('li#lang-java-score'),
        'python': $('li#lang-python-score'),
      }
    },
  };

  UpdateDashboardList = function(){
    this.data = {};
    this.toggle = {};
    this.conditinos = {};
  };
  UpdateDashboardList.prototype.init = function(){
    console.log('inited');
    this.toggle = {
      'prev':true,
      'challenger': true,
      'perfect': true,
      'persent': true,
      'c': true,
      'java': true,
      'python': true,
    };
    this.conditions = {
      'prev':{
        'qNo':'',
        'name':'',
        'select': '',
        'join': '',
        'condition': 'true',
        'sort': {
          'true' : 'ORDER BY no DESC',
          'false' : 'ORDER BY no ASC',
        },
      },
      'challenger':{
        'select': ', questions.challenger_count as count',
        'join': 'INNER JOIN questions ON qState.qNo = questions.no',
        'condition': 'true',
        'sort': {
          'true' : 'ORDER BY no DESC',
          'false' : 'ORDER BY no ASC',
        },
      },
      'perfect':{
        'select': ', questions.perfect_count as count',
        'join': 'INNER JOIN questions ON qState.qNo = questions.no',
        'condition': 'result = 100',
        'sort': {
          'true' : 'ORDER BY result DESC, no DESC',
          'false' : 'ORDER BY result ASC, no DESC',
        },
      },
      'persent':{
        'select': ', questions.challenger_count as count',
        'join': 'INNER JOIN questions ON qState.qNo = questions.no',
        'condition': 'true',
        'sort': {
          'true' : 'ORDER BY result DESC, no DESC',
          'false' : 'ORDER BY result ASC, no DESC',
        },
      },
      'c':{
        'select': ', questions.lang_c_count as count',
        'join': 'INNER JOIN questions ON qState.qNo = questions.no',
        'condition': 'language = "c"',
        'sort': {
          'true' : 'ORDER BY result DESC, no DESC',
          'false' : 'ORDER BY result ASC, no DESC',
        },
      },
      'java':{
        'select': ', questions.lang_java_count as count',
        'join': 'INNER JOIN questions ON qState.qNo = questions.no',
        'condition': 'language = "java"',
        'sort': {
          'true' : 'ORDER BY result DESC, no DESC',
          'false' : 'ORDER BY result ASC, no DESC',
        },
      },
      'python':{
        'select': ', questions.lang_python_count as count',
        'join': 'INNER JOIN questions ON qState.qNo = questions.no',
        'condition': 'language = "python"',
        'sort': {
          'true' : 'ORDER BY result DESC, no DESC',
          'false' : 'ORDER BY result ASC, no DESC',
        },
      },
    }
  }
  UpdateDashboardList.prototype.set = function(_data){
    this.data = _data;
  }
  UpdateDashboardList.prototype.get = function(_target, _page){
    let _this = this;
    let data = this.conditions[_target];
        toggle = this.toggle[_target];

    let select = data.select,
        join = data.join,
        sort = data.sort[toggle],
        condition = data.condition;

    this.data.page = _page;
    this.data.select = select;
    this.data.join = join;
    this.data.sort = sort;
    this.data.condition = condition;
    ajax_get_dashboard($elements.dashboard.list, this.data, function(result){
      if(result){
        _this.toggle[_target] = !toggle;
        _this.toggle.prev = toggle;
        _this.conditions.prev = data;
        _this.conditions.prev.name = _target;
        _this.conditions.prev.qNo = this.data.qNo;
      }
    });
  }
  updateDashboardList = new UpdateDashboardList();
  updateDashboardList.init();


  // 대쉬보드 리스트 보여주기 이벤트
  $elements.dashboard.list.board.click(function(){
    $elements.contents.right.scroll.scrollTop(0);
    if(!$elements.contents.right.slider.hasClass('moved')){
      $elements.contents.right.slider.addClass('moved');
      $elements.contents.right.slider.animate({'left':'-100%'}, 200, function(){
        // $elements.contents.scroll.css({'overflow-y':'hidden'});
      });
    }
  });
  // 대쉬보드 리스트 뒤로가기 이벤트
  closeDashboardDetail = function(){
    if($elements.contents.right.slider.hasClass('moved')){
      $elements.contents.right.slider.removeClass('moved');
      $elements.contents.right.slider.animate({'left':'0'}, 200, function(){
        $elements.contents.right.scroll.css({'overflow-y':'scroll'})
      });
    }
  }
  // page 버튼 클릭 이벤트
  dashboard_page = function(page){
    let isMineAlgo = userState.state.location.left === 'my-algo-list';
    let data = {
      'rows': userState.dashboard.rows, // 출력시킬 데이터 수
      'qNo': userState.data.algorithm.no,
      'mNo': isMineAlgo === true ? userState.data.info.no : 0,
      'isMineAlgo': isMineAlgo
    };
    updateDashboardList.set(data);
    updateDashboardList.get('prev', page);
  };
});
