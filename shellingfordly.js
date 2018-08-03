/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-07-31 15:25:18
 * @version $Id$
 */
/*== category模块js begin ==*/
// 显示/隐藏每个模块的介绍
$(".box").mouseenter(function (){
    let that = $(this).children().children().children();
    let timer = setTimeout(function (){
        that.eq(0).css("display","none");
        that.eq(1).css("display","block");
    },200)
});
$(".box").mouseleave(function (){
    let that = $(this).children().children().children();
    let timer = setTimeout(function (){
        that.eq(0).css("display","block");
        that.eq(1).css("display","none");
    },200)
});
/*== category模块js begin ==*/


/*== alwaysStudy模块js begin ==*/
/*-- music begin--*/
// 随机获取音乐数组号
let num = Math.floor(Math.random()*51);
// 推荐音乐数据
let url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=27&_=1519963122923`;
// 获取qq音乐最新歌单
function getMusic(){
    $.ajax({
        url : url,
        type : "get",
        dataType : 'jsonp',
        jsonp : "jsonpCallback",
        scriptCharset : 'GBK',//解决中文乱码
        success : function(data){//最新歌单数据
                //歌曲id
            let songmid = data.songlist[num].data.songmid,
                // 歌名
                songname = data.songlist[num].data.songname,
                // 歌手
                songer = data.songlist[num].data.singer[0].name,
                bgUrl = data.songlist[num].data.albumid;


            //将歌曲的http链接写入audio的src
            myAudio.src = `http://ws.stream.qqmusic.qq.com/C100${songmid}.m4a?fromtag=0&guid=126548448`;
            // 写歌名
            $(".musicname").html(songname);
            // 写歌手名
            $(".musicer").html(songer);
            // 插入歌曲图片
            $(".musicimg").css("background",`url(http://imgcache.qq.com/music/photo/album_300/${bgUrl%100}/300_albumpic_${bgUrl}_0.jpg) no-repeat center/cover`);
            play();
        },
        error : function (e) {
            alert('啊~~~~获取出错啦！');
        }
    });
}
getMusic();
// 控制播放/暂停
let myAudio = $("audio")[0];
$(".btn2").click(function (){
    if(myAudio.paused){
        play();
    }else {
        pause();
    }
})
// 播放
function play(){
    myAudio.play();
    $(".btn2").removeClass('icon-bofang1').addClass('icon-bofang');
}
// 暂停
function pause(){
    myAudio.pause();
    $(".btn2").removeClass('icon-bofang').addClass('icon-bofang1');
}
$(".btn1").click(function(){
    if (num === 0) return;
    num--;
    getMusic();
});
$(".btn3").click(function(){
    num++;
    getMusic();
});
//进度条控制
setInterval(automaticNextSong,500)    //每0.5秒计算进度条长度
$(".basebar").mousedown(function(e){  //进度条控制进度
    let posX = e.clientX;
    let targetLeft = $(this).offset().left;
    let percentage = (posX - targetLeft)/300*100;
    myAudio.currentTime = myAudio.duration * percentage/100;
});
function automaticNextSong(){
    let length = myAudio.currentTime/myAudio.duration*100;
    $('.progressbar').width(length+'%');//设置进度条长度
    //自动下一曲
    if(myAudio.currentTime == myAudio.duration){
        num++;
        getMusic()
    }
}
/*-- music end --*/

// 获取日期、时间、星期
(function(){
    let date = new Date();
    let dateArr = date.toLocaleDateString().split(/\//g);
    let day = getWeek(date.getDay());
    $("#date").html(`${dateArr[0]}/${dateArr[1]}/${dateArr[2]}`);
    $("#day").html(day);
    function setTime(){
        let date = new Date();
        let time = date.toTimeString().split(/:/g);
        $("#time").html(`${time[0]}:${time[1]}:${time[2].split(" ")[0]}`);
    }
    setInterval(setTime, 1000);
})();
// 星期
function getWeek(day){
    switch (day) {
        case 0:
            return "星期天";
        case 1:
            return "星期一";
        case 2:
            return "星期二";
        case 3:
            return "星期三";
        case 4:
            return "星期四";
        case 5:
            return "星期五";
        case 6:
            return "星期六";
        default:
            return "正在查询";
    }
}

/*-- 获取实地天气getWeather函数 begin --*/
getWeather();
function getWeather(myCity){
    myCity ? myCity : myCity="六盘水";
    theCity.map(function (val){
        myCity === val[0] ? myCity = val[1] : 0;
    })
    // 获取天气api
    let weatherUrl = `http://wthrcdn.etouch.cn/weather_mini?citykey=${myCity}`;
    $.ajax({
        url: weatherUrl,
        dataType: "jsonp",
        // scriptCharset: "gbk",写上会乱码
        method:'GET',
        crossDomain: true,
        success: function (data) {
            //请求无误，但是数据有误，desc为接口返回的数据中的一部分，往下看
            if(data.desc != "OK"){
                alert("请求地区有误");
            }
            //这儿写上正常处理的流程
            let t = data.data.forecast[0],
                type = t.type,
                hight = t.high,
                lowt = t.low,
                ganmao = data.data.ganmao,
                wendu = data.data.wendu;
            // 实时温度
            $("#temp").html(wendu+"℃");
            // 天气状态
            $("#weather").html(type);
            // 设置天气小图标
            setWeatherIcon(type);
            // 最高温度
            $(".hight").html(hight);
            // 最低温度
            $(".lowt").html(lowt);
            // 感冒提醒
            $(".ganmao").html(ganmao);
        },
        error : function(){
            console.log("请求失败");
        }
    })
}
// 根据天气显示对应小图标
function setWeatherIcon(icon) {
    // 查询天气正则 and 天气小图标类名
    let regJson = {
        sun : [/晴/g,"icon-weather1","http://s9.rr.itc.cn/r/wapChange/20171_18_0/a59z199844732612619.jpg"], //天晴
        rain : [/雨/g,"icon-baoyu","http://img.photo.163.com/0HbVZgm2gAIokApV69hTIg==/649362771271760257.gif"], //下雨
        frost : [/霜/g,"icon-shuang","http://pic.58pic.com/58pic/14/60/48/65258PIC68V_1024.jpg"], //霜
        snow : [/雪/g,"icon-weather_snow","http://ww2.sinaimg.cn/large/6ac8c5eagw1ex55jschp8g20c80827hj.gif"], //雪
        fog : [/雾/g,"icon-wu","http://5b0988e595225.cdn.sohucs.com/images/20171028/45fab71e281d4690a0d58fc7d7951775.gif"],  //雾
        smog : [/雾霾/g,"icon-wumai","http://upfile.asqql.com/2009pasdfasdfic2009s305985-ts/2017-10/20171025180970787.gif"], //雾霾
        cloudy : [/多云|阴/g,"icon-icon-cloudy","http://n8.cmsfile.pg0.cn/group1/M00/CE/2B/Cgqg11j9WhGAaH9OAA8QcPMo3UY093.gif"], //多云、阴
        sandstorm : [/沙尘暴/g,"icon-icon-sandStorm","http://image13.m1905.cn/uploadfile/2017/0608/20170608031557258001.gif"], //沙尘暴
        thunderstorms : [/雷阵雨/g,"icon-leizhenyu","http://img.mp.sohu.com/upload/20170801/02df5d4da24042889fabf1d46423eca4_th.png"], //雷阵雨
    };
    // 遍历json判断天气
    for (let key in regJson) {
        if ( regJson[key][0].test(icon) ) {
            $("#icon-w").removeClass("icon-dengdai").addClass(regJson[key][1]);
            $(".weather").css("background",`url(${regJson[key][2]}) no-repeat center/cover`);
        }
    };
}
/*-- 获取实地天气getWeather函数 end --*/

/*--more about front-end begin --*/
// 随机获取背景图片
let morebg = Math.random();

/*--more about front-end end--*/
/*== alwaysStudy模块js end ==*/


/*== mylife模块js begin ==*/
// 模拟奔跑动作
let act = 0;
function iActive(){
    if (act==0) {
        $("#me").removeClass("icon-paobu1").addClass('icon-run');
        act=1;
    }
    else if(act==1) {
        $("#me").removeClass('icon-run').addClass('icon-sport');
        act=2;
    } else {
        $("#me").removeClass('icon-sport').addClass('icon-run');
        act=1;
    }
}
setInterval(iActive,1000/300)
// 绕地球旋转
let itop, ileft, deg = 0;
function iRun(){
    itop = 200-Math.cos(Math.PI*deg/180)*200 -10;
    ileft = 200+Math.sin(Math.PI*deg/180)*200-10;
    $(".run")[0].style.top = itop/134.9+"rem";
    $(".run")[0].style.left = ileft/134.9+"rem";
    $(".run").css("transform",`rotateZ(${deg}deg)`);
    deg++;
    requestAnimationFrame(iRun);
}
requestAnimationFrame(iRun);
/*== mylife模块js end ==*/


/*== footer模块js begin ==*/
// 改变html的font-size
let html = document.querySelector("html");
changeRem();
window.addEventListener("resize",changeRem);
function changeRem(){
    //获取设备宽度
    let width = html.getBoundingClientRect().width;
    html.style.fontSize = width/10 + "px";
}
// 置顶按键
document.onmousewheel = function (e){
    if ($(document).scrollTop() >= 500) {
        $("#topping").css("display","block");
    } else {
        $("#topping").css("display","none");
    }
    $("#topping").click(function (){
        $(document).scrollTop(0);
        $(this).css("display","none");
    });
}
//网页被访问次数，本质为刷新次数
if (localStorage.pagecount){
   localStorage.pagecount=Number(localStorage.pagecount)+1;
}else{
  localStorage.pagecount=1;
}
localStorage.setItem("naem","111");
$(".times").html(localStorage.pagecount);
/*== footer模块js end ==*/
