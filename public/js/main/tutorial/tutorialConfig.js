$(function(){
  MouseMove = function(){
    this.isPlaying = false;
    this.interval = {
      'mouse': Object,
      // 'editor': Object,
    };
    this.$elements = {
      '$cursor':'',
      '$contents':'',
      '$clicker':'',
      '$clickerPanel':'',
    };

    this.pointIndex = 0;      // 현재 content index
    this.pointIndexEnd = 0;   // content size
    this.point = {
      'start':{
        'top': 0,
        'left': 0,
      },
      'end':{
        'top':0,
        'left':0,
      },
    };

    this.option = {
      'speed': 1000,
      'delay': 2000,
      'autoClick':false,
      'autoTyping': {
        'index':-1,
        'editor': '',
        'text': '',
      },
    }
  };

  MouseMove.prototype.targetStyleSetting = function($_clicker, $_nextTarget){
    if($_nextTarget.length === 0){
      console.log('[before]', $_nextTarget, $_nextTarget.prevObject.selector);
      let selector = $_nextTarget.prevObject.selector;
      $_nextTarget = $(selector).first();
      this.$elements.$contents[this.pointIndex] = $_nextTarget;
      console.log('[after]', $_nextTarget);
    }

    let bodyWidth = $('body').outerWidth(),
        bodyHeight = $('body').outerHeight();

    let offsetLeft = $_nextTarget.offset().left,
        offsetTop = $_nextTarget.offset().top,
        width = $_nextTarget.outerWidth(),
        height = $_nextTarget.outerHeight();

    let borderLeft = offsetLeft,
        borderTop = offsetTop,
        borderRight = bodyWidth - (offsetLeft + width),
        borderBottom = bodyHeight - (offsetTop + height);

    let styleOption = {
      'border-left-width': borderLeft + 'px',
      'border-right-width': borderRight + 'px',
      'border-top-width': borderTop + 'px',
      'border-bottom-width': borderBottom + 'px',
    }

    $_nextTarget.focus();
    $_clicker.css(styleOption);

    return $_clicker;
  };

  MouseMove.prototype.eidtorTextInterval = function(){
    this.option.autoTyping.editor.set('');
    let _this = this,
        index = 0,
        text = this.option.autoTyping.text,
        delay = this.option.delay / text.length,
        setText = '';

    let editorInterval = setInterval(function(){
      if(index === text.length-1){
        clearInterval(editorInterval);
        setTimeout(function(){
          _this.clicked();
        }, 500);
      }
      setText += text[index];
      _this.option.autoTyping.editor.set(setText);
      index += 1;
    }, delay);

    return editorInterval;
  }

  // initializing
  MouseMove.prototype.init = function($_cursor, $_clickerPanel, $_contents){
    this.isPlaying = true;
    this.pointIndex = 0;
    this.pointIndexEnd = Object.keys($_contents).length;
    let $nextTarget = $_contents[this.pointIndex];

    this.$elements.$cursor = $_cursor;
    this.$elements.$contents = $_contents;
    this.$elements.$clicker = $_clickerPanel.children('div#point-clicker');
    this.$elements.$clickerPanel = this.targetStyleSetting($_clickerPanel, $nextTarget);

  };

  MouseMove.prototype.setOptions = function(_options){
    let thisOptionKeys = Object.keys(this.option);
    for(let key in _options){
      if(thisOptionKeys.indexOf(key) > -1){
        this.option[key] = _options[key];
      }
    }
  }

  MouseMove.prototype.start = function(){
    if(this.isPlaying){
      let _this = this;
      $(document).bind( "mousemove", function(event){
        console.log('mousemove binding');
        _this.point.start.left = event.pageX;
        _this.point.start.top = event.pageY;
      });

      console.log(this.option.autoClick);
      if(this.option.autoClick){
        this.$elements.$clicker.unbind('click');
      } else {
        this.$elements.$clicker.unbind('click').bind('click', function(){
          _this.clicked();
        })
      }

      let speed = this.option.speed,
          delay = this.option.delay,
          $cursor = this.$elements.$cursor,
          $end = this.$elements.$clicker,
          endWidth = $end.outerWidth(),
          endHeight = $end.outerHeight(),
          autoTyping = this.pointIndex === this.option.autoTyping.index,
          autoClick = this.option.autoClick;

      this.point.end.top = $end.offset().top + (endHeight / 2);
      this.point.end.left = $end.offset().left + (endWidth / 2);

      $cursor.animate(_this.point.end, speed, function(){
        if(autoTyping){
          // 에디터 자동 타이핑
          _this.eidtorTextInterval();
        } else {
          // 자동클릭
          if(autoClick){
            setTimeout(function(){
              _this.clicked();
            }, 500);
          }
        }
      });

      if(!autoTyping && !autoClick){
        this.interval.mouse = setInterval(function(){
          $cursor.css(_this.point.start);
          $cursor.animate(_this.point.end, speed, function(){

          });
        }, delay);
      }
    }
  };

  MouseMove.prototype.stop = function(){
    $(document).unbind('mousemove');
    console.log('mousemove unbinding');
    for(let i in this.interval){
      clearInterval(this.interval[i]);
    }
  };
  MouseMove.prototype.skip = function(){
    this.isPlaying = false;
    let $cursor = this.$elements.$cursor;
    if($cursor.is(':animated')){
      $cursor.stop();
    }
    this.stop();
  };

  MouseMove.prototype.clicked = function(){
    this.stop();

    // point-cliker에 해당하는 태크 클릭 이벤트 발생
    this.$elements.$contents[this.pointIndex].click();

    this.pointIndex += 1;
    if(this.pointIndex !== this.pointIndexEnd){
      let $nextTarget = this.$elements.$contents[this.pointIndex],
          $clickerPanel = this.$elements.$clickerPanel;

        // 다음 태그에 대한 border-size reszing
      let _this = this;
      setTimeout(function(){
        _this.$elements.$clickerPanel = _this.targetStyleSetting($clickerPanel, $nextTarget);
        _this.start();
      }, 300);
    } else {
      console.log('[tutorial finish]');
    }
  };
});
