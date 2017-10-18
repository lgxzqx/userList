$(function(){

    //提示样式
    var myTip = {
        //样式一  加载提示
        loadOne:function(jsonData){
            console.log(1)
            var htmlText = "<div id='loading-center'><div id='loading-center-absolute'><div class='object' id='object_one'></div><div class='object' id='object_two' style='left:10px;'></div><div class='object' id='object_three' style='left:20px;'></div><div class='object' id='object_four' style='left:30px;'></div><div class='object' id='object_five' style='left:40px;'></div></div></div>";
            $('#'+jsonData.groupId).find('.accordion-content').append(htmlText);
        },
        loadOneDel:function(jsonData){
            $('#loading-center').remove();
        },
        gLoad:function(jsonData){
            var html = "<div class='globleTip' id='globleTip'>"
                          +"<div class='tipMask'></div>"
                          +"<span class='tipContent'>"+ jsonData.s +"</span>"
                      +"</div>"
            $("body").append(html);
        },
        gLoadEnd:function(){
            setTimeout(function(){
              $('#globleTip').remove();
            },1000)
        },
        gLoadErr:function(jsonData){
            $('#globleTip').find('.tipContent').text(jsonData.e);
        },
        gLoadSucceed:function(jsonData){
          $('#globleTip').find('.tipContent').text(jsonData.r);
        }
        //样式二  弹窗成功提示

        //样式三  弹窗成功提示
    }

    //ajax
    function myAjax(url, jsonData, successFn, loadFn, loadSuccessFn, errorFn){
        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          data: jsonData,
          beforeSend:function(){
            if (loadFn) loadFn(jsonData);
          },
          complete: function(xhr, textStatus) {
            if (loadSuccessFn) loadSuccessFn();
          },
          success: function(data, textStatus, xhr) {
            successFn(data, jsonData);
          },
          error: function(xhr, textStatus, errorThrown) {
            if (errorFn) errorFn(jsonData);
            console.log(errorThrown); 
          }
        });
        
    }
    //名片组
    function mpGroup(){
       var editBtn = $('#editBtn');//编辑按钮
       var createGroup = $('#createGroup');//新建分组按钮
       var currentBox = $('#currentBox');//头部名片组
       var mpGroup = $('.mp-group');//名片组
       var createGroupBtn = $('#createGroupBtn')//创建分组表单
       var editGroupBtn = $('#editGroupBtn');//修改组名提交按钮
       var defaultGroup = $('.default-group');
       var delGroup;
        //编辑-完成
       editBtn.on('click', function(){
            delGroup = mpGroup.find('.delGroup');//删除组按钮
            $(this).toggleClass('editState');
            mpGroup.find('.accordion-item').toggleClass('groupDownBtn');
            if ($(this).hasClass('editState')) {
                $(this).text('完成');
                currentBox.find('.bjBtn').text('编辑-名片组');
                currentBox.find('.mp-back').show();
                delGroup.show();
                //编辑时收取下拉
                mpGroup.find('.accordion-title').removeClass('active');
                mpGroup.find('.am-collapse').hide();

                //禁用事件
                createGroup.off('click');//新建分组事件
                createGroup.removeAttr("data-am-modal");

                //重新启用事件
                mpGroup.on('click', '.custom-group .accordion-title', editBtnFn);//编辑分组名事件
                defaultGroup.on('click', disDefGroupFn);
                createGroup.on('click', disCreGroupFn);


            } else {
                $(this).text('编辑');
                currentBox.find('.bjBtn').text('名片组');
                delGroup.hide();
                currentBox.find('.mp-back').hide();
                //清除编辑分组类名

                //重新启用事件
                createGroup.on('click', createGroupFn);//新建分组事件

                //禁用事件
                mpGroup.off('click', '.custom-group .accordion-title', editBtnFn);//编辑分组名事件
                editGroupBtn.find('span.groupName').removeAttr("data-am-modal");
                mpGroup.find('.custom-group .accordion-title').removeAttr("data-am-modal");
                defaultGroup.off('click', disDefGroupFn);
                createGroup.off('click', disCreGroupFn);
            }
       });
       function disDefGroupFn(){
          var jsonData = {
            s:'默认组不可编辑'
          }
          myTip.gLoad(jsonData);
          myTip.gLoadEnd();
       }
       //编辑情况下，禁用新建分组
       function disCreGroupFn(){
          var jsonData = {
            s:'编辑状态下，不可新建分组'
          }
          myTip.gLoad(jsonData);
          myTip.gLoadEnd();
       }
       //取消关注-- start
       function cancelFollowFn(){
          var target = $(this);
          var userId = target.parents('.group-list').attr('id');
          var groupId = $('#'+ userId).parents('.groupDownBtn').attr('id');
          var jsonData = {
              groupId:groupId,
              userId:userId
          }
          target.attr("data-am-modal","{target:'#mp-btn4'}");
          celFollowConfirmFn(jsonData);
       }
       //弹窗确认框
       function celFollowConfirmFn(jsonData){
          
          var unFollowBtn = $('#unFollowBtn');
          var url = unFollowBtn.attr('data-link');

          jsonData.s = "正在取消关注";
          jsonData.r = "成功取消关注";
          jsonData.e = "取消失败";

          unFollowBtn.off('click');
          unFollowBtn.on('click', function(){
            myAjax(url, jsonData, selGroupSucceed, myTip.gLoad, myTip.gLoadEnd, myTip.gLoadErr);
            //url, jsonData, successFn, loadFn, loadSuccessFn, errorFn
          })

       } 
       mpGroup.on('click', '.cancelFollow', cancelFollowFn);
       //取消关注-- end
       //弹出选择分组 获取总分组  选择分组---start
       function countGroup(groupId){
          var group = mpGroup.find('.groupDownBtn');
          var groupLenght = group.length;
          var content = $('#mp-btn5').find('ul.amUl');
          var html = "";
          for(var i=1; i<groupLenght+1; i++){
            html = html+ "<li><label for='num"+ i +"'><input type='radio' name='num' value='"+ group.eq(i-1).attr('id') +"'  id='num"+ i +"'><span>"+ group.eq(i-1).find('.accordion-title span').text() +"</span></label></li>"
          }
          content.find('li').remove();
          content.append(html);
          $("#mp-btn5 input[value="+ groupId +"]").attr('checked', true);
       }
       //弹出选择分组
       function selectGroupFn(){
          var target = $(this);
          var targetGroupId = target.parents('.groupDownBtn').attr('id');
          var targetUserId = target.parents('.group-list').attr('id');
          var jsonData = {
            groupId:targetGroupId,
            userId:targetUserId
          };
          countGroup(targetGroupId);
          target.attr("data-am-modal","{target:'#mp-btn5'}");
          selGroupConfirmFn(jsonData);
       }
       //选择分组确认提交
       function selGroupConfirmFn(jsonData){
          var selectGroupBtn = $('#selectGroupBtn');
          selectGroupBtn.off('click');//解除事件,再绑定防止重复提交
          selectGroupBtn.on('click', function(){
            var groupTo = $("#mp-btn5 input").filter(":checked").val();
            var url = selectGroupBtn.attr('data-link');
            jsonData.groupTo = groupTo;
            jsonData.s = '正在转移分组';
            jsonData.r = '成功转移分组';
            jsonData.e = '转移分组失败';
            if (jsonData.groupId != jsonData.groupTo) {
              myAjax(url, jsonData, selGroupSucceed, myTip.gLoad, myTip.gLoadEnd, myTip.gLoadErr);
            } else {
              jsonData.s = '本组不需要转移';
              myTip.gLoad(jsonData);
              myTip.gLoadEnd();
            }
          })
       }
       //分组成功操作DOM操作
       function selGroupSucceed(data, jsonData){
          myTip.gLoadSucceed(jsonData);
          var userIdHtml = $('#'+ jsonData.userId);
          var userParentToId = $('#'+ jsonData.groupTo);
          var userParentTo = userParentToId.find('.accordion-content');
          userIdHtml.remove();
          userParentTo.append(userIdHtml);
          //更新组成员数字
          var userParent = $('#'+ jsonData.groupId);
          var userParentNum = parseInt(userParent.find('.userNum').text()) - 1;
          var userParentToNum = parseInt(userParentToId.find('.userNum').text()) + 1;
          userParent.find('.userNum').text(userParentNum);
          userParentToId.find('.userNum').text(userParentToNum);
       }
       mpGroup.on('click', '.selectGroup', selectGroupFn);
       //-----选择分组 end

       //user 展开操作按钮
       function userDownFn(){
          var target = $(this);//事件促发对象
          var targetParent = target.parent('.group-list');//事件促发对的上一级
          var userList = targetParent.find('.group-list-btn');//当前个展开对象
          var userListAll = targetParent.parent('.accordion-content').find('.group-list');
          var userListCon = targetParent.parent('.accordion-content').find('.group-list-btn');//当前组所有得展开对象
          //var pointAllBtn = target.parent('.accordion-content').find('.group-list');

          if (!targetParent.hasClass('active')) {
            userListCon.hide(400);
            userListAll.removeClass('active');
            targetParent.addClass('active');
            userList.show(400);
          }
       }
       mpGroup.on('click', '.group-list-mes', userDownFn);

       //分组下拉
       function groupDownFn(){
            var url = $(this).attr('data-link');
            var id = $(this).parents('dl').attr('id');
            var jsonData = {};
            jsonData.groupId = id;

            var objId = $('#'+id );
            var userNumText = objId.find('.userNum').text();
            var userLenght = objId.find('.group-list').length;

            objId.siblings('.groupDownBtn').find('.am-collapse').hide(200);//所有组隐藏
            objId.parent('.accordion-gapped').find('.accordion-title').removeClass('active');
            $(this).addClass('active');
            
            $(this).siblings('.am-collapse').slideToggle(400); //当前组展开
            //有更新user，调用ajax
            if (userNumText != userLenght) {
                myAjax(url, jsonData, userDownSucceed, myTip.loadOne, myTip.loadOneDel );//下拉加载成员
            } else {
              groupUserFirst(jsonData);
            }
            
       }
       function groupUserFirst(jsonData){
          //每个组第一个默认展开
          var objId = $('#'+jsonData.groupId);
          if (objId.find('.accordion-title').hasClass('active')) {
              var mesGz = objId.find('.group-list-btn').first();
              var point = objId.find('.group-list').first();
              objId.find('.group-list-btn').hide();
              objId.find('.group-list').removeClass('active');
              mesGz.show();
              point.addClass('active');
          }
       }
       //更新分组下的数据
       function userDownSucceed(data, jsonData){
            if (!data) return;
            var id = data.id;
            var userList = $('#' + id).find('.accordion-content');
            var res = '';
            userList.empty();
            console.log( data.user.length)
            $.each(data.user, function(key,val){
              res = res + "<div class='group-list' id='"+ val.id +"'>"+
                        "<div class='group-list-mes'>"+
                            "<div class='mes-img'><img src='"+ val.avatar +"'></div>"+
                            "<div class='mes-data'>"+
                                "<h3>"+ val.name +"</h3>"+
                                "<p>"+ val.company_name +"</p>"+
                                "<i>"+ val.sex +"</i>"+
                            "</div>"+
                            "<div class='mes-gz rt'>"+
                                "<i class='iconfont'>&#xe602;</i>"+
                                "<span>"+ val.is_active +"</span>"+
                            "</div>"+
                        "</div>"+
                        "<ul class='group-list-btn'>"+
                            "<li class='lt'><a href='"+ val.homepage +"'><i class='iconfont'>&#xe62d;</i><span>查看</span></a></li>"+
                            "<li class='lt'><a href='tel:"+ val.mobile +"'><i class='iconfont'>&#xe644;</i><span>拨号</span></a></li>"+
                            "<li class='lt'><a class='selectGroup' href='javascript:'><i class='iconfont'>&#xe6b8;</i><span>分组</span></a></li>"+
                            "<li class='lt'><a class='cancelFollow' href='javascript:'><i class='iconfont'>&#xe607;</i><span>取消</span></a></li>"+
                        "</ul>"+
                    "</div>"
            })
            userList.append(res);
            groupUserFirst(jsonData);
       }

       mpGroup.on('click', 'dl.groupDownBtn dt', groupDownFn);
       //编辑分组名称
       function editBtnFn(event){
            var target = $(this);
            var groupName = target.find('.groupName').text();
            var groupId = target.parents('dl.custom-group').attr('id');
            target.attr("data-am-modal","{target:'#mp-btn1'}");
            $('#mp-btn1 .modal-group-name').find('input')[0].value = groupName;
            $('#mp-btn1 .modal-group-name').find('.tip').text('');
            $('#mp-btn1').attr('group-id', groupId);
       }

       //新建分组初始化数据
       function createGroupFn(event){
          createGroupBtn.parent().siblings('.modal-group-name').find('.tip').text('');
          createGroupBtn.parent().siblings('.modal-group-name').find('input')[0].value = '';
          $(this).attr("data-am-modal","{target: '#mp-btn2'}");
       };
       //新建分组
       createGroup.on('click', createGroupFn);

       //确定提交创建分组
       editGroupBtn.add(createGroupBtn).on('click', function(){
            var url = $(this).attr('data-link');
            //把填入的组名传给后台
            var tip = $(this).parent().siblings('.modal-group-name').find('.tip'); //提示信息
            var jsonData = {};
            jsonData.name = $(this).parent().siblings('.modal-group-name').find('input')[0].value;
            //修改组的id,传给后台。如果新增组，id为空。后台可判断此参数是新增，还是修改
            jsonData.gropuId = $(this).parents('.am-modal').attr('group-id');
            //拿到修改组的名称
            var currGropuName = $('#'+jsonData.gropuId).find('span.groupName').text();
            //判断组名是否重复
            var groupName = $('.custom-group .accordion-title span');
            var groupLenght = groupName.length;
            for(var i=0;i<groupLenght;i++){

                if (groupName[i].innerHTML == jsonData.name  && currGropuName != jsonData.name) {
                    tip.text('已有相同的组名');
                    return false;
                }
                if (jsonData.name == '' || jsonData.name == 'undefined') {
                    tip.text('不能为空');
                    return false;
                }
            }
            if (jsonData.gropuId) {
                //修改分组名称
                if (currGropuName != jsonData.name) myAjax(url, jsonData, updataSucceed);
            } else {
                //新建分组
                myAjax(url, jsonData, createSucceed);
            }
       });
       //成功修改分组名称DOM操作
       function updataSucceed(data, jsonData){
            console.log('修改成功');
            $('#'+jsonData.gropuId).find('span.groupName').text(jsonData.name);
       }

       //成功创建分组DOM操作
       function createSucceed(data, jsonData){
            jsonData.s = '创建成功';
            myTip.gLoad(jsonData)
            myTip.gLoadEnd();
            var html="<dl id='"+ data.id + "'class='accordion-item custom-group groupDownBtn'><b data-link='createGroup.txt' class='delGroup'><em>-</em></b><dt class='accordion-title' data-link='createGroup.txt'><span class='groupName'>" + jsonData.name + "</span><i class='on userNum'>0</i></dt><dd class='accordion-bd am-collapse'><div class='accordion-content'></div></dd></dl>"
            $('.accordion-gapped').append(html);
            $('.mp-groupBg').hide();
       }

       //删除组弹窗提示框
       mpGroup.on('click', '.delGroup', function(event){
            var id = $(this).parents('dl').attr('id');
            var jsonData = {};
            jsonData.groupId = id;
            delConfirm(jsonData);
            $(this).attr("data-am-modal","{target: '#mp-btn3'}");
       });
       //删除组提交按钮请求
       function delConfirm(jsonData){
          var delGroupBtn = $('#delGroupBtn');
          delGroupBtn.off('click');
          delGroupBtn.on('click', function(){
            var target = $(this);
            var url = target.attr('data-link');
            myAjax(url, jsonData, delSucceed);
          })
       }
       //成功删除分组DOM操作
       function delSucceed(data, jsonData){

            jsonData.s = '删除成功';
            myTip.gLoad(jsonData);
            myTip.gLoadEnd();

            var targetGroup = $("#"+jsonData.groupId);
            var userNum = parseInt(targetGroup.find('.userNum').text());
            if (userNum) {
              var defaults = $('.default-group');
              //为了再展开分组，不用每次都进行异步加载 --start
              var users = targetGroup.find('.group-list');
              var userLenght = users.length;
              if (userNum == userLenght) {
                var defaultGroup = defaults.find('.accordion-content');
                defaultGroup.append(users);
              }
              //为了再展开分组，不用每次都进行异步加载 --end
              //删除成功 成员数更新
              var defaultNum = parseInt(defaults.find('.userNum').text()) + userNum;
              defaults.find('.userNum').text(defaultNum);
            }
            targetGroup.remove();
            mpGroupBg();
       }
       //没有创建分组提示图片
      function mpGroupBg(){
        var mpGroupBg = $('.mp-groupBg');
        var groupLenght = mpGroup.find('dl.accordion-item').length;
        console.log(groupLenght);
        if (groupLenght <= 1) mpGroupBg.show();
      }
      mpGroupBg();
    }
    mpGroup();
    

});