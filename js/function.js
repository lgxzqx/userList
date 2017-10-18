
$(function(){
    (function(doc,win){
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize' ,
            recalc = function()
            {
                var clientWidth = docEl.clientWidth;
                if(!clientWidth) return;
                if(clientWidth>640){
                    clientWidth=640;
                }
                docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
            };
        recalc();
        if(!doc.addEventListener) return;
        win.addEventListener(resizeEvt,recalc,false);
        doc.addEventListener('DOMContentLoaded',recalc,false);
    })(document,window);


    /*选项卡*/
    function Wtab(eId,index) {
        if($(eId).length == 0) return;
        var tab = $(eId);
        var index = index ? index : 0;

        tab.find('div').removeClass('current');
        tab.find('div').eq(index).addClass('current');


        tab.siblings('.w-content').find('.w-list').hide();
        tab.siblings('.w-content').find('.w-list').eq(index).show();

        tab.find('div').on('touchstart',function () {
            var index=$(this).index();
            $(this).parent().find('div').removeClass('current');
            $(this).parent().siblings('.w-content').find('.w-list').hide();

            $(this).addClass('current');
            $(this).parent().siblings('.w-content').find('.w-list').eq(index).show();

            /*关注列表头部--我关注的和关注我的人数切换*/
            tab.prev().find(".gz-num").find('div').removeClass('current');
            tab.prev().find(".gz-num").find('div').eq(index).addClass('current');

        });
        var listL= tab.find('div').parent().siblings('.w-content').find('.w-list').eq(index).find('.list1');
        console.log(listL.length);
        if( listL.length == 0){
            $('.list').siblings('.indexImg').show();
        }else{
            $('.list').siblings('.indexImg').hide();
        }
    }



    /*加入成功弹出框*/
    $(".confirm").click('touchstart',function () {
        $(this).parents('#add2').hide();
    });

    /*编辑*/
    $(".x-cont-had .bianji a").click('touchstart',function () {
        // console.log(222);
        $(this).toggleClass("complete");
        if($(".x-cont-had .bianji a").hasClass("complete")){
            $(".G-list .G-close").show();
            $(".G-list input").hide();
            $(this).parent().parent().find('input').attr("disabled","disabled");
            $(this).find('img').hide();
            $(this).find('span').html('完成');
        }else{
            $(".G-list .G-close").hide();
            $(".G-list input").show();
            $(this).parent().parent().find('input').removeAttr("disabled","disabled");
            $(this).find('img').show();
            $(this).find('span').html('编辑');
        }
    });


    /*删除*/
    $(".G-close").click('touchstart',function () {
        $(this).attr("data-am-modal","{target: '#G-close'}");
        var self=$(this);
        $(".close-modal .confirm").click('touchstart',function (){
            $(self).parent('.G-list').hide();
        });
    });

    /*引导页高度*/
    var height=$('html').height();
    $(".lead").height(height);
    
    
    // 引导页
    function lead() {
        $(".new-btn .next").click('touchstart',function () {
            $(this).parents('.lead').hide();
            $(this).parents('.lead').next().show();
        });
        $(".onShow").click('touchstart',function () {
            $(this).parents('.lead').hide();
        });
        $(".L-hide").hover(function () {
            $(this).hide();
        });
    }

    function common(x) {
        x();
        Wtab('.myTab');
    }
     common(lead);
     Wtab('.gzTab');


    /*G名片-名片夹*/
    /*mp背景图高度*/
    var mpH=$('html').height();
    $(".mp-groupBg").height(mpH-$(".mp-footBtn").height()-$(" .default-group .accordion-title").height());

    /*mp背景图显示与隐藏*/
   function mpBg() {
       var mpGroup=$(".mp-group .accordion-gapped .accordion-item");
       if(mpGroup.length > 1){
           $(".mp-groupBg").hide();
       }else{
           $(".mp-groupBg").show();
           $(".mp-bjBox").hide();
       }
       $(".accordion-gapped .accordion-title").click('touchstart',function () {
               var groupList=$(".group-list");
               if(groupList.length !== 0){
                   $(".mp-groupBg").hide();
               }
           }
       );
   }
    mpBg();

    /*编辑 - 名片组的显示以及删除操作*/
   function compile(group){
       var iThis=$(group);
       var iIndex=$(group).index();
       var iHtml=$(iThis).find(".accordion-title i");
       iHtml.each(function (iIndex) {/*判断是否有自定义分组*/
           if(iHtml.eq(iIndex).html() == 0){/*判断i是否等于0*/
               $(iHtml).eq(iIndex).removeClass("on");/*如果等于0移除  "on" */

               $(".mp-bjBox").show();/*编辑-名片组显示*/
           }
       });

       function myModel(e){/*添加编辑分组模态框*/
           e.preventDefault();
           iThis.find('dt').attr("data-am-modal","{target: '#mp-btn1'}");
       }

       /*分组下拉*/
       $(".default-group").click('touchstart',function () {
           $(this).find(".accordion-bd").slideToggle();
           $(this).find(".accordion-title").toggleClass("active");
       });
       function groupSlide(e) {
           var target = $(e.target);
           target.removeAttr("data-am-modal","{target: '#mp-btn1'}");
           target.siblings(".accordion-bd").slideToggle();
           target.toggleClass("active");
       }
       iThis.find('dt').bind('touchstart',groupSlide);/*初始状态下绑定*/

       /*判断当前分组是否有子级，没有则下拉不显示*/
       function onSlide() {
           iThis.each(function (iIndex) {
               iThis.click('touchstart',function () {
                   var listG=iThis.find(".group-list");
                   if(listG.eq(iIndex).length  == 0){
                       console.log(000);
                       $(iThis).eq(iIndex).find(".accordion-bd").stop(true,true).slideDown();
                       $(iThis).eq(iIndex).find(".accordion-bd").hide();
                       $(iThis).eq(iIndex).find(".accordion-title").removeClass("active");
                       console.log($(listG).eq(iIndex).parent().parent());
                   }
               });
           });
       }
       onSlide();


       /*点击底部编辑按钮显示正在编辑的状态*/
       $(".mp-footBtn  a:first-child").click('touchstart',function () {
           $(this).toggleClass('bjY');
           if($(this).hasClass('bjY')){
               $(".footBtn1").html("完成");
               $('.mp-back').show();/*返回按钮显示*/
               $(".bjBtn").html("编辑 - 名片组");
               $(iHtml).parent().siblings("b").show();/*删除按钮显示*/
               $(iHtml).parent().addClass("onAfter");/*上下箭头隐藏*/

               iThis.find('dt').unbind();
               iThis.addClass('modelBtn');
               $('.modelBtn').click('touchstart', myModel);

           } else {
               $(this).html("编辑");
               $('.mp-back').hide();/*返回按钮隐藏*/
               $(".bjBtn").html("名片组");
               $(iHtml).parent().siblings("b").hide();
               $(iHtml).parent().removeClass("onAfter");

               $('.modelBtn').unbind('click');
               iThis.find('dt').bind('touchstart',groupSlide);
               onSlide();
           }

       });

       /*点击返回回到最初状态*/
       $(".mp-bjBox .mp-back").click('touchstart',function () {
           $(this).hide();
           $(".footBtn1").removeClass("bjY");
           $(".footBtn1").html("编辑");
           $(".bjBtn").html("名片组");
           $(iThis).unbind("click");
           $(iHtml).parent().siblings("b").hide();
           $(iHtml).parent().removeClass("onAfter");

           $('.modelBtn').unbind('click');
           iThis.find('dt').bind('touchstart',groupSlide);
           onSlide();
       });

   }
    compile(".custom-group");


    /*确认删除的显示与删除*/
    $(".custom-group   b  ").click('touchstart',function () {
        $(this).siblings("dt").removeAttr("data-am-modal","{target: '#mp-btn1'}");
        var self=$(this);
        $(".conRemove").click('touchstart',function (){
            $(self).parent().hide();
            $(".am-modal ").hide();
            $(".am-dimmer.am-active").hide();

        });
    });
    
    /*选择分组中点击新建分组*/
    $(".modal5-xj").click('touchstart',function () {
        $(this).parents('.mp-modal5').hide();
        $(".modal5-close").click('touchstart',function(){
            $(this).parents(".mp-modal2").hide();
            $('.mp-modal5').show();
        });
    });



});
