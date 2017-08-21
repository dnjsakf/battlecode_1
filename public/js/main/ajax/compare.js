$(function(){
  ajax_get_compare_code = function(elements, data, editor, callback){
    let myCodes;
    $.ajax({
      url:'/ajax/sourceCode',
      type:'GET',
      data: data,
      error:function(error){
        console.error('[ajax-source-code]', error);
        callback(error, null);
      },
      success:function(result){
        console.log('[ajax-source-code]', result.result);
        if(result.result){
          // 성공
          console.log(result.data);
          // 성공하면 보여주기 시작.
          let myData = result.data.myCode;
          let otherData = result.data.otherCode;

          // 나중에 selector로 불러올 데이터들
          myCodes = myData;

          // DOM setting
          elements.viewer.css({'display':'block'});
          elements.select.empty();
          for(let index in myData){
            let option = myData[index];
            let optionTag = `<option value=${index}>${option.result}</option>`;
            elements.select.append(optionTag);
          }
          elements.select.find('option').first().attr({'selected':''})
          elements.btn.attr(
                      {'myStateNo':result.data.myCode[0].no,
                       'otherStateNo':data.stateNo});


          let mySource = myData[0].sourceCode;
          let otherSource = otherData[0].sourceCode;

          let json_my = {};
          if(typeof mySource === 'string'){
            json_my = JSON.parse(mySource);
          }
          let json_other = {};
          if(typeof otherSource === 'string'){
            json_other = JSON.parse(otherSource);
          }

          mySource = ''
          for(let key in json_my){
            mySource += json_my[key] + '\n';
          }
          otherSource = ''
          for(let key in json_other){
            otherSource += json_other[key] + '\n';
          }

          editor.my.set(mySource);
          editor.other.set(otherSource);

          elements.viewer.animate({opacity:1}, 400, function(){
            editor.my.set(editor.my.editor.getValue() + '');
            editor.other.set(editor.other.editor.getValue() + '');
          });
        } else {
          // 실패
        }
      },
      complete:function(){
        callback(!true, myCodes);
        console.log('[ajax-source-code-complete]');
      }
    });
  }

  ajax_do_compare = function(elements, data){
    $.ajax({
      url:'/ajax/sourceCode/compare',
      type:'GET',
      data: data,
      beforeSend:function(){

      },
      error:function(error){
        console.error('[ajax-compare]', error);
      },
      success:function(result){
        console.log('[ajax-compare]', result.result);
        if(result.result){
          // 성공
          elements.text(result.data.result.total + "%")
        } else {
          elements.text('error');
        }
      },
      complete:function(){
        console.log('[ajax-compare-complete]');
      }
    });
  }
});
