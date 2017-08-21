$(function(){
  MovingPanel = function(){
    this.panel = '',
    this.elements = {
      'container':'',
      'items':'',
    }
    this.state = {
      'index':0,
      'moveLength':0,
      'moveHiehgt':0,
      'delay':0,
      'speed':0,
    }
  };
  MovingPanel.prototype.init = function($_container, _startIndex, _delay, _speed){
    console.log($_container);
    console.log(this);
    this.panel = '';

    this.elements.container = $_container;
    this.elements.items = $_container.children();

    this.state.index = _startIndex;
    this.state.delay = _delay;
    this.state.speed = _speed;
    this.state.moveLength = this.elements.items.length,
    this.state.moveHeight = this.elements.items.first().height(),

    this.elements.container.css({'margin-top':0});
  };
  MovingPanel.prototype.start = function(){
    let _this = this,
        $container = _this.elements.container,
        index = _this.state.index,
        height = _this.state.moveHeight,
        length = _this.state.moveLength,
        speed = _this.state.speed,
        delay = _this.state.delay;
    // setInterval은 window의 method...
    // 그래서 setInterval 내에서의 this 는 window를 가리킴
    _this.panel = setInterval(function(){
      index === length-1 ? index = 0 : index += 1;
      $container.animate({'margin-top': height * -index}, speed);
      _this.state.index = index;  // 이걸 전역변수에 넣는 수 밖에 없는 건가?
    }, delay);
  };
  MovingPanel.prototype.stop = function(){
    clearInterval(this.panel);
  };
  MovingPanel.prototype.delete = function(){
    this.stop();
    delete this.panel;
    delete this.elements.container ;
    delete this.elements.items;
    delete this.state.index;
    delete this.state.delay;
    delete this.state.speed;
    delete this.state.moveLength;
    delete this.state.moveHeight;
  };
});
