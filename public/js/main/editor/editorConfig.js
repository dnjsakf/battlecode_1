$(function(){
  // 클래스처럼 사용할 수 있음
  codemirror_f = function($textarea, a, b, c){
    this.textarea = $textarea;
    this.editor = '';

    console.log(a,b,c);
  };
  // 에디터 설정
  codemirror_f.prototype.init = function(_readeonly){
	  this.editor = CodeMirror.fromTextArea(this.textarea[0], {
		  lineNumbers: true,
		  lineWrapping: true,
		  matchBrackets: true,
      readOnly: _readeonly,
		  val: this.textarea.val(),
		});
  };
  // 에디터에 글자 입력
  codemirror_f.prototype.get = function(){
    return this.editor.getValue();
  }
  codemirror_f.prototype.set = function(data){
    this.editor.setValue(data);
  };
  codemirror_f.prototype.setTheme = function(theme){
    console.log('[this-eidtor]',this.editor);
    console.log('[this-textarea]',this.textarea);
    console.log('[condemirror-theme]', theme);
    if(theme !== undefined){
      this.editor.setOption('theme', theme);
    }
  };
  codemirror_f.prototype.setFontSize = function(size){
    console.log('[condemirror-fontsize]', size);
    if(size !== undefined){
      $('.CodeMirror').css({'font-size':size});
    }
  };
  codemirror_f.prototype.setFontFamily = function(font){
    console.log('[condemirror-font]', font);
    if(font !== undefined){
      $('.CodeMirror').css({'font-family':font+', serif'});
    }
  };

});
