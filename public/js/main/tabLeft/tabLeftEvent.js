$(document).ready(function(){
  const SHOW_CLASS = 2;
  let $elements = {
    'title':{
      'all':{
        'selectedalgoname':$('.tab-title.selected-algo-name'),
      },
      'left':{
        'all':$("li.left-title"),
        'selectedalgoname':$('li.left-title.selected-algo-name'),
      },
      'right':{
        'all':$('li.right-title'),
        'home':$('li.right-title.home'),
      },
    },
    'contents':{
      'left':{
        'all':$('ul.left-contents'),
      },
      'right':{
        'all':$('ul.right-contents'),
        'scroll':$('section.scroll-contents'),
      },
    }
  };

  // 타이틀&&콘텐츠 선택 이벤트
  $elements.title.left.all.on('click',function(){
    let $this = $(this);
    let showClass = $this.attr('class').split(" ")[SHOW_CLASS];
    let $showContents = $('ul.left-contents.' + showClass);
    let flag = true;
    // 오른쪽에 에디터가 보여질 때, 문제 외에 다른 것을 클릭하면, 풀이 종료.
    if(userState.state.location.right === 'editor' && showClass !== 'selected-algo-name'){
      if(confirm('풀이를 중단하시겠습니까?')){
        $elements.title.right.all.addClass('hidden');
        $elements.title.left.selectedalgoname.addClass('hidden');
        $elements.title.right.home.click();
        flag = true;
      } else {
        flag = false;
      }
    }

    if(flag){
      // 현재 왼쪽에 보여지는 아이템 저장
      userState.state.location.left = showClass;
      console.log('[userState-location-left]', userState.state.location);

      // 선택한 타이틀에 [selected] 속성 삽입
      $elements.title.left.all.removeClass('selected');
      $this.addClass('selected');

      // 현재 탭이 [hidden] 클래스를 가지고 있다면 제거하여 보여줌.
      if($this.hasClass('hidden')){
        $this.removeClass('hidden');
      }

      // 선택한 타이틀에 해당되는 콘텐츠를 보여줌
      if($showContents.hasClass('hidden')){
        $elements.contents.left.all.addClass('hidden');
        $showContents.removeClass('hidden');
      }
    }
  });

  // 알고리즘 선택 이벤트
  // ajax로 생성된 태그는 $(document).on('click', 'selector', function(){})로
  // 이벤트를 바인딩해야됨
  $(document).on('click', 'ul.left-contents > li' ,function(){
    let $this = $(this);
    let algoName = $this.attr('value'),
        algoNo = $this.attr('class').split(' ')[1],
        ismine = $this.hasClass('isMine');

    userState.data.algorithm.no  = algoNo;
    userState.data.algorithm.name = algoName;

    closeDashboardDetail(); // tabRightEvent.js
    updateDashboardList.init();

    // [right-title] 탐색
    // 오른쪽만 보여줘도 될 듯한데?
    $elements.title.all.selectedalgoname.each(function(){
      let $thisTitle = $(this);
      $thisTitle.find('span > a').text(algoName);   // left && right title
      $thisTitle.attr('value', parseInt(algoNo));

      if($thisTitle.hasClass('right-title')){
        $thisTitle.removeClass('hidden');
        // change 이벤트 호출
        $thisTitle.click();
      }
    });
  });
});
