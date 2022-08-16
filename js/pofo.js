(($)=>{
    //클래스 - 파스칼 케이스 기법
    class Pofo {
      init(){
        this.header();
        this.section1();
        this.section2();
        this.section3();
        this.section4();
        this.section5();
        this.section6();
        this.section7();
        this.section8();
        this.section9();
        this.section10();
        this.quick();
        this.gotop();
      }
      header(){
        let t=false; //태블릿, 모바일
        let t2=false; //pc

        //모바일 메뉴 버튼 이벤트
        $('.mobile-btn').on({
          click:function(){
            $(this).toggleClass('on');
            $('#nav').stop().slideToggle(300);
          }
        });

        //기본값
        $('.sub').stop().slideUp(0);

        //반응형
        $(window).resize(function(){
          resizeNav();
        });

        //반응형 네비게이션
        function resizeNav(){
          if($(window).width()<=1024){
            $('.mobile-btn').removeClass('on');
            $('#nav').stop().hide();
            t2=false; //데스크탑 토글 초기화
            if(t===false){
              t=true;
              $('.sub').stop().fadeOut(0);
              $('.main-btn').off('mouseenter');
              $('.main-btn').bind({
                click:function(e){
                  $(this).next().stop().slideToggle(300);
                }
              });
            }
          }
          else {
            $('.mobile-btn').removeClass('on');
            $('#nav').stop().show();

            t=false;
            if(t2===false){
              t2=true;
              //마우스 오버 이벤트 기능 삭제
              $('.main-btn').off('click');
              $('.main-btn').on('mouseenter');
              $('.sub').stop().slideUp(0);
            }

            //해상도 1024 초과
            $('.main-btn').on({
              mouseenter:function(){
                $('.sub').fadeOut(0);
                $(this).next().fadeIn(300);
              }
            });

            $('#nav').on({
              mouseleave:function(){
                $('.sub').fadeOut(300);
              }
            });

            //서브서브메뉴
            $('.sub-btn').on({
              mouseenter:function(){
                $('.sub-sub').fadeOut(0);
                $(this).next().fadeIn(300);
              }
            });

            $('.col24').on({
              mouseleave:function(){
                $('.sub-sub').fadeOut(300);
              }
            });
          }
        }
        
        resizeNav(); //로딩시 실행1

        //$(window).resize(); 크기,높이,너비 변화가 되면 실행
        //스크롤 이벤트: 반드시 스크롤이 발생해야만 실행됨
        //패럴럭스
        let upDown='';                    //UP DOWN
        let newTop=$(window).scrollTop(); //현재(새로운) 위치의 스크롤 top값
        let oldTop=newTop;                //이전 스크롤 top값 위치

        $(window).scroll(function(){
          //스크롤이 아래로 발생하면: scrollDown
          //스크롤이   위로 발생하면: scrollUp
          newTop=$(window).scrollTop();   //현재(새로운) 위치 스크롤 top값
            //200-299(-90)>0?'UP':'DOWN'; //음수 발생하면 scrollDown
            //300-290(10)>0?'UP':'DOWN';  //양수 발생하면 scrollUp
          upDown=oldTop-newTop>0?'UP':'DOWN';

          if(upDown==='UP'){   //네비게이션 보이기
            $('#header').removeClass('hide');
            $('#header').addClass('show');
          }
          if(upDown==='DOWN'){ //네비게이션 감추기
            $('#header').removeClass('show');
            $('#header').addClass('hide');
          }

          if($(window).scrollTop()===0){ //맨위로 올라가면
            $('#header').removeClass('show');
          }

          oldTop=newTop; //이전 스크롤 top값 위치
        });
      }
      section1(){
        let cnt=0;
        let n=$('.slide').length-3; //5-3=2
        let setId=0; //타이머 변수
        let setId2=0;
        let touchStart=null;
        let touchEnd=null;
        let result='';
        let dragStart=null;
        let dragEnd=null;
        let mouseDown=false; //논리변수, true(마우스 다운 상태) / false(마우스 다운 안 한 상태)
        let winW=$(window).width(); //창 너비

        //슬라이드 너비 반응형 구하기
        //너비와 높이가 단 1px이라도 변경되면 동작한다. 크기 변화가 없으면 절대 동작하지 않음
        $(window).resize(function(){
          winW=$(window).width();
          console.log('창 너비',winW);
          mainSlide();
          return winW; //반응형 창 너비(데스크탑,태블릿,노트북,모바일)
        });

        //1.메인슬라이드 함수
        function mainSlide(){
          $('.slide-wrap').stop().animate({left:-winW*cnt},600,'easeOutExpo',function(){
            cnt>2?cnt=0:cnt;
            cnt<0?cnt=n:cnt;
            $('.slide-wrap').stop().animate({left:-winW*cnt},0);
          })
        }

        //2.다음카운트 함수
        function nextCount(){
          cnt++;
          mainSlide();
        }
        //2-1.이전카운트 함수
        function prevCount(){
          cnt--;
          mainSlide();
        }

        //3.자동카운터 함수
        function autoTimer(){
          setId=setInterval(nextCount,3000);
        }
        autoTimer();

        //타이머 중지 함수
        function timerfn(){
          let cnt2=0;
          clearInterval(setId); //자동타이머 중지
          clearInterval(setId2); //자동타이머 중지
          setId2=setInterval(function(){
            cnt2++;
            //console.log(cnt2);
            if(cnt2>=2){
              clearInterval(setId);
              clearInterval(setId2); //카운트 중지하고
              autoTimer(); //자동타이머 호출
            }
          },1000);
        }

        $('.slide-container').on({
          mousedown:function(e){ //데스크탑용, touchstart
            clearInterval(setId); //자동 타이머 중지
            //중지되고 난 후 5초간 아무 터치가 없으면 다시 자동타이머 불러오기
            timerfn();
            touchStart=e.clientX;
            //drag
            dragStart=e.clientX-$('.slide-wrap').offset().left-winW; //반드시 초기값 0으로 세팅
            mouseDown=true;
          },
          mouseup:function(e){ //touchend
            touchEnd=e.clientX;
            result=touchStart-touchEnd>0?'NEXT':'PREV';
            if(result==='NEXT'){
              if(!$('.slide-wrap').is(':animated')){
                nextCount(); //다음 슬라이드 호출
              }
            }
            if(result==='PREV'){
              if(!$('.slide-wrap').is(':animated')){
                prevCount(); //이전 슬라이드 호출
              }
            }
            //드래그 앤 드롭 끝
            mouseDown=false;
          },
          mouseleave:function(e){
            if(!mouseDown) return; //mouseDown이 아니면 강제종료
            touchEnd=e.clientX;
            result=touchStart-touchEnd>0?'NEXT':'PREV';
            if(result==='NEXT'){
              if(!$('.slide-wrap').is(':animated')){
                nextCount(); //다음 슬라이드 호출
              }
            }
            if(result==='PREV'){
              if(!$('.slide-wrap').is(':animated')){
                prevCount(); //이전 슬라이드 호출
              }
            }
            //드래그 앤 드롭 끝
            mouseDown=false;
          },
          mousemove:function(e){
            if(!mouseDown) return; //mouseDown이 아니면 강제종료
            dragEnd=e.clientX;
            //console.log(dragEnd-dragStart);
            $('.slide-wrap').css({left:dragEnd-dragStart}); //드래그 앤 드롭
          }
        });

        //모바일 전용 터치 이벤트 (finger touch)
        $('.slide-container').on({
          touchstart:function(e){ //mousedown(터치 시작)
            timerfn();
            touchStart=e.originalEvent.changedTouches[0].clientX;
            //drag
            dragStart=e.originalEvent.changedTouches[0].clientX-$('.slide-wrap').offset().left-winW; //반드시 초기값 0으로 세팅
            mouseDown=true;
          },
          touchend:function(e){ //mouseup(터치 끝)
            touchEnd=e.originalEvent.changedTouches[0].clientX;
            result=touchStart-touchEnd>0?'NEXT':'PREV';
            if(result==='NEXT'){
              if(!$('.slide-wrap').is(':animated')){
                nextCount(); //다음 슬라이드 호출
              }
            }
            if(result==='PREV'){
              if(!$('.slide-wrap').is(':animated')){
                prevCount(); //이전 슬라이드 호출
              }
            }
            //드래그 앤 드롭 끝
            mouseDown=false;
          },
          touchmove:function(e){ //mousemove
            if(!mouseDown) return; //mouseDown이 아니면 강제종료
            dragEnd=e.originalEvent.changedTouches[0].clientX;
            $('.slide-wrap').css({left:dragEnd-dragStart}); //드래그 앤 드롭
          }
        });
      }
      section2(){
        //스크롤 이벤트
        //section2이 노출되면 패럴럭스 구현 (추가 클래스 sec2Ani)
        const sec2Top=$('#section2').offset().top-$(window).height();
        //console.log(`$(window).height()`,$(window).height());
        //console.log(`$('#section2').offset().top`,$('#section2').offset().top);
        //console.log(`sec2Top`,sec2Top);
        $(window).scroll(function(){
          if($(window).scrollTop()===0){
            $('#section2').removeClass('sec2Ani');
            return;
          }
          if($(window).scrollTop()>sec2Top){
            $('#section2').addClass('sec2Ani');
            return;
          }
        });
      }
      section3(){
        const sec3Top=$('#section3').offset().top-$(window).height();
        $(window).scroll(function(){
          if($(window).scrollTop()===0){
            $('#section3').removeClass('sec3Ani');
            return;
          }
          if($(window).scrollTop()>sec3Top){
            $('#section3').addClass('sec3Ani');
            return; //스크롤 top값 계속 진행하는 걸 방지
          }
        });
      }
      section4(){
        let idx = 0;
        let winW = $(window).width();
        let cols = 4; //해상도 크기별 조건문 4 3 2 1
        let imgW = winW/cols;
        let imgH = imgW*0.8125;
  
        let n = $('.gallery-item').length;
        let h = $('.gallery-item.hide').length;
        let rows = Math.ceil((n-h)/cols);

        //scrollTop 애니메이션
        const sec4Top=$('#section4').offset().top-$(window).height();
        let scr=false;

        $(window).scroll(function(){
          if($(window).scrollTop()===0){
            $('#section4').removeClass('sec4Ani');
            return;
          }
          if($(window).scrollTop()>sec4Top){
            if(scr===false){
              scr=true; //애니메이션 1회만 진행
              $('#section4').addClass('sec4Ani');
            }
            return;
          }
        });
  
        setTimeout(galleryMain, 100);
  
        //반응형 윈도우 리사이즈
        $(window).resize(function(){              
          galleryMain();
        });
  
        $('.gallery-btn').each(function(index){
          $(this).on({
            click: function(e){
              e.preventDefault();
              idx = index; //클릭한 인덱스 번호
              galleryMain();
              $('.gallery-btn').removeClass('on');
              $(this).addClass('on');
              $('#section4').removeClass('sec4Ani');
            }           
          });
        });
  
        // 갤러리 이미지 재배치 함수
        function galleryMain(){
        winW = $(window).width();

        if(winW>=1280){
          cols = 4;
        }
        else if(winW>=1024){ //1024~1279
          cols = 3;
        }
        else if(winW>=600){ //600~1023
          cols = 2;
        }
        else { //320~599
          cols = 1;
        }

        imgW = winW/cols;
        imgH = imgW*0.8125;
  
        $('.gallery-item').removeClass('zoom'); //줌 효과 삭제 초기화
        $('.gallery-item').stop().animate({width:imgW,height:imgH}).removeClass('hide'); //초기화
        $('.gallery-item .img-wrap').css({width:imgW});
  
        if(idx===0){      //8개 보이기(show)
          switch(cols){
            case 4: //칸
              $('.gallery-item').eq(0).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*1,top: imgH*0},300);
              $('.gallery-item').eq(2).show().stop().animate({left: imgW*2,top: imgH*0},300);
              $('.gallery-item').eq(3).show().stop().animate({left: imgW*3,top: imgH*0},300);
          
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*1},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*1,top: imgH*1},300);
              $('.gallery-item').eq(6).show().stop().animate({left: imgW*2,top: imgH*1},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*3,top: imgH*1},300);
              break;
            case 3:
              $('.gallery-item').eq(0).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*1,top: imgH*0},300);
              $('.gallery-item').eq(2).show().stop().animate({left: imgW*2,top: imgH*0},300);
  
              $('.gallery-item').eq(3).show().stop().animate({left: imgW*0,top: imgH*1},300);      
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*1,top: imgH*1},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*2,top: imgH*1},300);
  
              $('.gallery-item').eq(6).show().stop().animate({left: imgW*0,top: imgH*2},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*1,top: imgH*2},300);
              break;
            case 2:
              $('.gallery-item').eq(0).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*1,top: imgH*0},300);
          
              $('.gallery-item').eq(2).show().stop().animate({left: imgW*0,top: imgH*1},300);
              $('.gallery-item').eq(3).show().stop().animate({left: imgW*1,top: imgH*1},300);
          
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*2},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*1,top: imgH*2},300);
          
              $('.gallery-item').eq(6).show().stop().animate({left: imgW*0,top: imgH*3},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*1,top: imgH*3},300);                    
              break;
            default : //else 1칸
              $('.gallery-item').eq(0).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*0,top: imgH*1},300);
              $('.gallery-item').eq(2).show().stop().animate({left: imgW*0,top: imgH*2},300);
              $('.gallery-item').eq(3).show().stop().animate({left: imgW*0,top: imgH*3},300);
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*4},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*0,top: imgH*5},300);
              $('.gallery-item').eq(6).show().stop().animate({left: imgW*0,top: imgH*6},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*0,top: imgH*7},300);
          }
        }
        else if(idx===1){ //3개 보이기 / 5 숨기기 재배치
          $('.gallery-item').eq(0).hide().addClass('hide');
          $('.gallery-item').eq(2).hide().addClass('hide');
          $('.gallery-item').eq(3).hide().addClass('hide');
          $('.gallery-item').eq(4).hide().addClass('hide');
          $('.gallery-item').eq(6).hide().addClass('hide');
          switch(cols){
            case 4:
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*1,top: imgH*0},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*2,top: imgH*0},300);
              break;
            case 3:
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*1,top: imgH*0},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*2,top: imgH*0},300);
              break;
            case 2:
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*1,top: imgH*0},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*0,top: imgH*1},300);
              break;
            default:
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*0,top: imgH*1},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*0,top: imgH*2},300);
          }
        }
        else if(idx===2){ //6개 보이기 3, 7 숨기기
          $('.gallery-item').eq(3).hide().addClass('hide');
          $('.gallery-item').eq(7).hide().addClass('hide');
          switch(cols){
            case 4:
              $('.gallery-item').eq(0).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*1,top: imgH*0},300);
              $('.gallery-item').eq(2).show().stop().animate({left: imgW*2,top: imgH*0},300);           
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*3,top: imgH*0},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*0,top: imgH*1},300);
              $('.gallery-item').eq(6).show().stop().animate({left: imgW*1,top: imgH*1},300);
              break;
            case 3:
              $('.gallery-item').eq(0).show().stop().animate({left:imgW*0,top:imgH*0}, 300);
              $('.gallery-item').eq(1).show().stop().animate({left:imgW*1,top:imgH*0}, 300);
              $('.gallery-item').eq(2).show().stop().animate({left:imgW*2,top:imgH*0}, 300);           
              $('.gallery-item').eq(4).show().stop().animate({left:imgW*0,top:imgH*1}, 300);
              $('.gallery-item').eq(5).show().stop().animate({left:imgW*1,top:imgH*1}, 300);
              $('.gallery-item').eq(6).show().stop().animate({left:imgW*2,top:imgH*1}, 300);
              break;
            case 2:
              $('.gallery-item').eq(0).show().stop().animate({left:imgW*0,top:imgH*0}, 300);
              $('.gallery-item').eq(1).show().stop().animate({left:imgW*1,top:imgH*0}, 300);
              $('.gallery-item').eq(2).show().stop().animate({left:imgW*0,top:imgH*1}, 300);           
              $('.gallery-item').eq(4).show().stop().animate({left:imgW*1,top:imgH*1}, 300);
              $('.gallery-item').eq(5).show().stop().animate({left:imgW*0,top:imgH*2}, 300);
              $('.gallery-item').eq(6).show().stop().animate({left:imgW*1,top:imgH*2}, 300);
              break;
            default:
              $('.gallery-item').eq(0).show().stop().animate({left:imgW*0,top:imgH*0}, 300);
              $('.gallery-item').eq(1).show().stop().animate({left:imgW*0,top:imgH*1}, 300);
              $('.gallery-item').eq(2).show().stop().animate({left:imgW*0,top:imgH*2}, 300);           
              $('.gallery-item').eq(4).show().stop().animate({left:imgW*0,top:imgH*3}, 300);
              $('.gallery-item').eq(5).show().stop().animate({left:imgW*0,top:imgH*4}, 300);
              $('.gallery-item').eq(6).show().stop().animate({left:imgW*0,top:imgH*5}, 300);
          }  
        }
        else if(idx===3){ //4개
          $('.gallery-item').eq(1).hide().addClass('hide');
          $('.gallery-item').eq(3).hide().addClass('hide');
          $('.gallery-item').eq(6).hide().addClass('hide');
          $('.gallery-item').eq(7).hide().addClass('hide');
          switch(cols){
            case 4:
              $('.gallery-item').eq(0).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(2).show().stop().animate({left: imgW*1,top: imgH*0},300);            
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*2,top: imgH*0},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*3,top: imgH*0},300);
              break;
            case 3:
              $('.gallery-item').eq(0).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(2).show().stop().animate({left: imgW*1,top: imgH*0},300);            
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*2,top: imgH*0},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*0,top: imgH*1},300);
              break;
            case 2:
              $('.gallery-item').eq(0).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(2).show().stop().animate({left: imgW*1,top: imgH*0},300);            
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*1},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*1,top: imgH*1},300);
              break;
            default:
              $('.gallery-item').eq(0).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(2).show().stop().animate({left: imgW*0,top: imgH*1},300);            
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*2},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*0,top: imgH*3},300);
          }
        }
        else if(idx===4){ //2개
          $('.gallery-item').eq(0).hide().addClass('hide');
          $('.gallery-item').eq(1).hide().addClass('hide');
          $('.gallery-item').eq(2).hide().addClass('hide');
          $('.gallery-item').eq(3).hide().addClass('hide');
          $('.gallery-item').eq(5).hide().addClass('hide');
          $('.gallery-item').eq(6).hide().addClass('hide');
          switch(cols){
            case 4:
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*1,top: imgH*0},300);
              break;
            case 3:
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*1,top: imgH*0},300);
              break;
            case 2:
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*1,top: imgH*0},300);
              break;
            default:
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*0,top: imgH*1},300);
          }
        }
        else if(idx===5){ //5개
          $('.gallery-item').eq(0).hide().addClass('hide');
          $('.gallery-item').eq(2).hide().addClass('hide');
          $('.gallery-item').eq(6).hide().addClass('hide');
          switch(cols){
            case 4:
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(3).show().stop().animate({left: imgW*1,top: imgH*0},300);
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*2,top: imgH*0},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*3,top: imgH*0},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*0,top: imgH*1},300);
              break;
            case 3:
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(3).show().stop().animate({left: imgW*1,top: imgH*0},300);
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*2,top: imgH*0},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*0,top: imgH*1},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*1,top: imgH*1},300);
              break;
            case 2:
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(3).show().stop().animate({left: imgW*1,top: imgH*0},300);
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*1},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*1,top: imgH*1},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*0,top: imgH*2},300);
              break;
            default:
              $('.gallery-item').eq(1).show().stop().animate({left: imgW*0,top: imgH*0},300);
              $('.gallery-item').eq(3).show().stop().animate({left: imgW*0,top: imgH*1},300);
              $('.gallery-item').eq(4).show().stop().animate({left: imgW*0,top: imgH*2},300);
              $('.gallery-item').eq(5).show().stop().animate({left: imgW*0,top: imgH*3},300);
              $('.gallery-item').eq(7).show().stop().animate({left: imgW*0,top: imgH*4},300);
          }
        }
  
        //hide 된 클래스가 몇 개인가
        h=$('.gallery-item.hide').length;
        rows=Math.ceil((n-h)/cols); //줄수는 hide  갯수를 가져온뒤에 높이를 정한다. 
        $('.galley-wrap').stop().animate({height: imgH*rows},300); //갤러리 전체 박스 높이
  
        //줌 효과
        $('.gallery-item').addClass('zoom');
        }  //갤러리 함수
      }
      section5(){
        const sec5Top=$('#section5').offset().top-$(window).height();
        let t=false; //toggle

        $(window).scroll(function(){
          if($(window).scrollTop()===0){
            t=false;
            $('#section5').removeClass('sec5par');
          }
          if($(window).scrollTop()>sec5Top){
            if(t===false){
              t=true;
              $('#section5').addClass('sec5par');
              //SVG 애니메이션 실행
              svgAnimation();
            }
          }
        });

        function svgAnimation(){
          const svgObj=$('.ring-front circle')
          let svgArr=[];
          let perSize=[];
          let piece=[];
          let per=[.9,.75,.9,.62];
          let second=3;
          let sum=[0,0,0,0];
          let setId=[0,0,0,0];

        $.each(svgObj,function(idx,obj){
          console.log(idx,obj,obj.getTotalLength());
          svgArr[idx]=obj.getTotalLength();

          $(obj).css({strokeDasharray:svgArr[idx]});
          $(obj).css({strokeDashoffset:svgArr[idx]});

          perSize[idx]=svgArr[idx]*per[idx];

          piece[idx]=(perSize[idx]/second)/100;

          function sumfn(){
            sum[idx]+=piece[idx];
            if(sum[idx]>perSize[idx]){
              clearInterval(setId[idx]);
            }
            else {
              $(obj).css({strokeDashoffset:svgArr[idx]-sum[idx]});
              $('.count-num').eq(idx).html(Math.ceil(sum[idx]/svgArr[idx]*100)+'%');
            }
          }
          setId=setInterval(sumfn,10);
        });
        }
      }
      section6(){
        let sec6Top=$('#section6').offset().top-$(window).height();

        $(window).scroll(function(){
          if($(window).scrollTop()===0){
            $('#section6').removeClass('sec6Ani');
          }
          if($(window).scrollTop()>sec6Top){
            $('#section6').addClass('sec6Ani');
          }
        });
      }
      section7(){
        let sec7Top=$('#section7').offset().top-$(window).height();

        $(window).scroll(function(){
          if($(window).scrollTop()===0){
            $('#section7').removeClass('sec7Ani');
          }
          if($(window).scrollTop()>sec7Top){
            $('#section7').addClass('sec7Ani');
          }
        });
      }
      section8(){
        let sec8Top=$('#section8').offset().top-$(window).height();

        $(window).scroll(function(){
          if($(window).scrollTop()===0){
            $('#section8').removeClass('sec8Ani');
          }
          if($(window).scrollTop()>sec8Top){
            $('#section8').addClass('sec8Ani');
          }
        });
      }
      section9(){
        let sec9Top=$('#section9').offset().top-$(window).height();

        $(window).scroll(function(){
          if($(window).scrollTop()===0){
            $('#section9').removeClass('sec9Ani');
          }
          if($(window).scrollTop()>sec9Top){
            $('#section9').addClass('sec9Ani');
          }
        });
      }
      section10(){
        let sec10Top=$('#section8').offset().top-$(window).height();

        $(window).scroll(function(){
          if($(window).scrollTop()===0){
            $('#section10').removeClass('sec10Ani');
          }
          if($(window).scrollTop()>sec10Top){
            $('#section10').addClass('sec10Ani');
          }
        });
      }
      quick(){ //스크롤시 따라다니는 메뉴
        let quickTop=($(window).height()-$('#quickBox').height())/2-100;
        //console.log(quickTop);
        $(window).scroll(function(){
          $('#quickBox').stop().animate({top:quickTop+$(window).scrollTop()},300,'easeOutExpo');
        });
      }
      gotop(){
        $(window).scroll(()=>{
          if($(window).scrollTop()>100){
            $('#goTopBox').stop().fadeIn(1000);
          }
          else {
            $('#goTopBox').stop().fadeOut(1000);
          }
        });

        //맨위로 부드럽게 이동: 스무스 스크롤링(smooth scrolling)
        $('.gotop-btn').on({
          click:function(){
            $('html,body').stop().animate({scrollTop:0},500);
          }
        });
      }
    }
  const newPofo=new Pofo();
  newPofo.init();
})(jQuery);