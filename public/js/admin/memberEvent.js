  // restrict-event
  ajaxSetUserRestrict = function(updateData){
    $.ajax({
      url:'/admin/manage/member/restrict',
      type:'post',
      dataType:'JSON',
      data:updateData,
      error: function(error){
        console.error(error);
      },
      success: function(result){
        if(result.result){
          console.log('updated');
        } else {
          console.error('fail');
        }
      }
    });
  }


$(function(){;
  $(document).on('change', 'select.restrict-type', function(target){
    const $parent = $(this).parent();
    $(this).val() !== 0 ? $parent.next().find('textarea').focus() : '';
  });

  $(document).on('click', 'button.restrict-save', function(event){
    const $parent = $(this).parents('tr');
    const $type = $parent.find('select.restrict-type');
    const $comment = $parent.find('textarea.restrict-comment');
    const updateData = {
      user:{
        no: $(this).val()
      },
      update:{
        restrict_type: $type.val(),
        restrict_comment: $comment.val()
      }
    };
    ajaxSetUserRestrict(updateData);

  });
  $(document).on('click', 'button.restrict-init', function(event){
    const updateData = {
      user:{
        no: $(this).val(),
      },
      update:{
        restrict_type: 0,
        restrict_comment: 'Normal'
      }
    };
    ajaxSetUserRestrict(updateData);
  });
});