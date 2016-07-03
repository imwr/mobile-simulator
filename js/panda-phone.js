/* =========================================================== *
 * @site http://tt-cc.cn
 * @email ttccmvp@gmail.com
 * Copyright 2016 ttcc
 * Licensed under the Apache License, Version 2.0 (the "License")
 * =========================================================== */
;
$(document).ready(function () {
    var screenStatus = 3;//屏幕状态
    var screenStatusEnum = {
        close: 0,
        locked: 1,
        normal: 2,
        poweroff: 3,
        oning: 4
    };    //屏幕状态 0 关闭 1 锁屏 2 正常 3 关机 4 开机中
    var leavetTime = 20, LAVENT_TIME = 30;//无操作时间，锁屏时间
    var contentIndex = null, currDomIndex = 0;

    //test start
    //$(".panda-screen-close").toggle();
    //$(".panda-screen").toggle();
    //leavetTime = 200;
    //LAVENT_TIME = 200;
    // screenStatus = 1;
    //setTimeout(function () {
    //    powerOn();
    //}, 2000);
    //test end

    //九宫格
    $(".panda-ninebox").nineBox({
        width: 250,
        height: 250,
        radius: 28,
        lineWidth: 12,
        backgroundColor: "none",
        color: "#fff",
        lineColor: "yellow",
        extClass: "center",
        pwd: "153",
        onSuc: function () {
            screenStatus = screenStatusEnum.normal;
            $(".panda-screen-locked").hide();//九宫格等隐藏
            $(".panda-screen-open").show();//主屏展示
            $(".panda-screen").removeClass("panda-screen-opacity");//屏幕全亮
        },
        onError: function () {
            console.log("wrong")
        }
    });
    //实时时间显示
    $.timer(1000, function () {
        if (screenStatus == screenStatusEnum.locked || screenStatus == screenStatusEnum.normal) {
            leavetTime--;
            if (leavetTime <= 0) {
                swichScrenn();
                screenStatus = screenStatusEnum.close;
            }
            var date = new Date();
            var hh = ("0" + date.getHours()).substring(("0" + date.getHours()).length - 2);
            var mm = ("0" + date.getMinutes()).substring(("0" + date.getMinutes()).length - 2);
            $(".panda-time").html(hh + ":" + mm);
        }
    }, true);
    //如果锁屏时在屏幕上有任何操作，锁屏重计时
    $(".panda-screen").on("mousedown", function () {
        if (screenStatus == screenStatusEnum.locked || screenStatus == screenStatusEnum.normal) {
            leavetTime = LAVENT_TIME;
        }
    });
    //操作键事件
    $(".b-power").on("holdTime", {
        time: 1200,
        onBegin: function (ele) {
            // 按键按下效果
            $(ele).find("i").stop().animate({
                width: 0,
                right: 4
            }, 100);
        }
    }, function () {
        $(this).find("i").stop().animate({
            width: 4,
            right: 0
        }, 100);
        if (screenStatus == screenStatusEnum.normal || screenStatus == screenStatusEnum.locked) {//关机
            poweroff();
        } else if (screenStatus == screenStatusEnum.poweroff) {//开机
            powerOn();
        }
    }).on("mouseup", function () {
        $(this).find("i").stop().animate({
            width: 4,
            right: 0
        }, 100, "linear");
        if (screenStatus == screenStatusEnum.close) {//之前是关闭，不用判断是否开关机
            swichScrenn(true);
            leavetTime = LAVENT_TIME;
            screenStatus = screenStatusEnum.locked;
        } else if (screenStatus == screenStatusEnum.normal || screenStatus == screenStatusEnum.locked) {//之前是正常
            swichScrenn(true);
            screenStatus = screenStatusEnum.close;
        }
    });
    var poweroff = function () {
        $(".panda-opr-frame")[0].style.display = "block";
        $(".panda-opr-content").css({
            height: 148,
            top: 120
        }).html("<li data-index='1'>关机</li>" +
            "<li  data-index='2'>重新启动</li><li data-index='3'>飞行模式</li><li  data-index='4'>取消</li>");
        $(".panda-opr-content li").on("click", function () {
            var index = $(this).attr("data-index");
            if (index == 1) {
                screenStatus = screenStatusEnum.poweroff;
                swichScrenn();
            } else if (index == 2) {
                screenStatus = screenStatusEnum.poweroff;
                swichScrenn();
                powerOn();
            } else if (index == 3) {
            }
            $(".panda-opr-frame").hide();
        })
    };
    //con 是否是进入锁屏
    var swichScrenn = function (con) {
        $(".panda-screen-close").toggle();   //锁屏
        var screen = $(".panda-screen").toggle(); //屏幕
        if (con) {
            $(".panda-screen-open").hide();
            $(".panda-screen-locked").show();//九宫格等
            screen.addClass("panda-screen-opacity");
            $(".panda-menu-frame").hide();//历史记录
        }
    };
    // 初始设置日期
    var date = new Date(), month = date.getMonth() + 1, days = date.getDate(), week;
    switch (date.getDay()) {
        case 1:
            week = "周一";
            break;
        case 2:
            week = "周二";
            break;
        case 3:
            week = "周三";
            break;
        case 4:
            week = "周四";
            break;
        case 5:
            week = "周五";
            break;
        case 6:
            week = "周六";
            break;
        default:
            week = "周日";
    }
    $(".panda-date").html(month + " 月 " + days + " 日 " + week);
    var hh = ("0" + date.getHours()).substring(("0" + date.getHours()).length - 2);
    var mm = ("0" + date.getMinutes()).substring(("0" + date.getMinutes()).length - 2);
    $(".panda-time").html(hh + ":" + mm);
    //开机
    var powerOn = function () {
        if (screenStatus != screenStatusEnum.poweroff) return;
        screenStatus = screenStatusEnum.oning;
        var colorchange = $(".panda-poweroning").colorChange({
            auto: false,
            changeChildren: true,
            colors: [
                '#fff',
                '#999',
                '#999',
                '#999',
                '#999',
                '#999'
            ]
        });
        var ParticleSystemA = $(".panda-screen-close").css("background", "#444").simpleParticles({
            particlesNum: 30,
            auto: false,
            particle: {
                position: [[10, 268], [10, 340]],
                speed: [0, [40, 80]],
                angle: Math.PI / 2,
                life: 1,
                color: "random",
                size: 4
            },
            gravity: [0, 100],
            acceleration: [0, 0]
        });
        var animationDiv = $(".panda-poweron-animation"), ruinsParticles = [];
        var ParticleSystemPD = animationDiv.simpleParticles({
            particlesNum: 50,
            auto: false,
            particle: {
                speed: [62, 82],
                life: 0.2,
                color: "white",
                size: 12,
                nodeStyle: "position: absolute;z-index:8;border-radius:6px;"
            },
            gravity: [0, 0],
            acceleration: [0, 0],
            initEmtr: function (emtr) {
                emtr.t = 0, emtr.position.x = 75, emtr.position.y = 186, emtr.r = 30, emtr.v = 0, emtr.angle = [0, Math.PI];
            },
            emtrTrail: function (emtr) {
                if (emtr.t == 0 && emtr.position.y > 75) {//竖线
                    emtr.position.y -= 1.5;
                    if (emtr.position.y <= 75) {
                        emtr.t = 1;
                        emtr.angle = [1 / 2 * Math.PI, 3 / 2 * Math.PI];
                    }
                    return;
                }
                if (emtr.t == 1) { //横线
                    emtr.position.x += 1.5;
                    if (emtr.position.x >= 100) emtr.t = 2;
                    return;
                }
                if (emtr.t == 2) {
                    emtr.v = emtr.v + Math.PI / 55;
                    emtr.position.x = 100 + emtr.r * Math.sin(emtr.v);
                    emtr.position.y = 75 + (emtr.r - emtr.r * Math.cos(emtr.v));
                    emtr.angle = emtr.angle + Math.PI / 55;
                    emtr.angle = [emtr.angle - 1 / 2 * Math.PI, emtr.angle + 1 / 2 * Math.PI];
                    if (emtr.position.x <= 75) {
                        emtr.t = 3;
                        emtr.position.x = 150;
                        emtr.position.y = 182;
                        emtr.r = 52;
                    }
                    return;
                }
                if (emtr.t == 3 && emtr.position.y > 75) {//竖线2
                    emtr.angle = [0, Math.PI];
                    emtr.position.y -= 1.5;
                    if (emtr.position.y <= 75) {
                        emtr.t = 4;
                        emtr.angle = [1 / 2 * Math.PI, 3 / 2 * Math.PI];
                    }
                    return;
                }
                if (emtr.t == 4) { //横线
                    emtr.position.x += 1.5;
                    if (emtr.position.x >= 162) {
                        emtr.t = 5;
                        emtr.angle = Math.PI;
                        emtr.v = 0;
                    }
                    return;
                }
                if (emtr.t == 5) {
                    emtr.v = emtr.v + Math.PI / 80;
                    emtr.position.x = 160 + emtr.r * Math.sin(emtr.v);
                    emtr.position.y = 75 + (emtr.r - emtr.r * Math.cos(emtr.v));
                    emtr.angle = emtr.angle + Math.PI / 80;
                    emtr.angle = [emtr.angle - 1 / 2 * Math.PI, emtr.angle + 1 / 2 * Math.PI];
                    if (emtr.position.x <= 152) {
                        var ParticleSystemPDRuins = animationDiv.simpleParticles("destroy").simpleParticles({
                            particlesNum: 500,
                            percent: 1.1,
                            particles: ruinsParticles,
                            gravity: [0, 300],
                            acceleration: [0, 0],
                            effectors: [function (particle) { // BOX DEMO
                                if (particle.position.x - particle.size < 0 || particle.position.x + particle.size > 278)
                                    particle.velocity.x = -particle.velocity.x;
                                if (particle.position.y - particle.size < 0 || particle.position.y + particle.size > 420)
                                    particle.velocity.y = -particle.velocity.y;
                            }],
                            onStart: function (particles) {
                                if (particles.length <= 0) {
                                    ParticleSystemPDRuins.simpleParticles("destroy");
                                    var timeout = setTimeout(function () {
                                        ParticleSystemA.simpleParticles("destroy");
                                        $(".panda-screen-close").css("background", "#222");
                                        $(".panda-poweron-text").hide();
                                        $(".panda-poweroning").hide();
                                        $(".panda-cartoon").hide();
                                        $(".panda-screen-close .panda-poweron-animation").html("");
                                        $(".panda-screen-close .simple-particle-node").hide().remove();
                                        screenStatus = screenStatusEnum.locked;
                                        leavetTime = LAVENT_TIME;
                                        swichScrenn(true);
                                        clearTimeout(timeout)
                                    }, 3000)
                                }
                            }
                        });
                        $(".panda-cartoon").show();
                        var timeout = setTimeout(function () {
                            ParticleSystemPDRuins.simpleParticles("settings", {
                                duration: 20 / 8
                            });
                            timeout = setTimeout(function () {
                                ParticleSystemPDRuins.simpleParticles("settings", {
                                    duration: 20 / 0.9
                                });
                                clearTimeout(timeout);
                            }, 500)
                        }, 400)
                    }
                }
            },
            onStart: function (particles, emtr) {
                var node = document.createElement("div");
                node.style.cssText = "position: absolute; border-radius: 3px;box-shadow:0px 0px 16px red";
                node.style.backgroundColor = "white";
                node.style.left = emtr.position.x - 3 + "px";
                node.style.top = emtr.position.y - 3 + "px";
                node.style.height = "6px";
                node.style.width = "6px";
                animationDiv.append(node);
                var a = Math.atan((emtr.position.y - 135) / (emtr.position.x - 135));
                if (emtr.position.x - 135 < 0) {
                    a = Math.PI + a - Math.PI / 4
                } else {
                    a = a + Math.PI / 4
                }
                ruinsParticles.push(ParticleSystemPD.simpleParticles("createParticle", {
                    position: [emtr.position.x - 3, emtr.position.y - 3],
                    angle: [a, a],
                    speed: [120, 220],
                    life: 1.2,
                    color: {
                        r: 255,
                        g: 255,
                        b: 255
                    },
                    size: 12,
                    node: node
                }));
            }
        });
        var timeout = setTimeout(function () {
            $(".panda-poweron-text").show();
            ParticleSystemA.simpleParticles("start");
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                $(".panda-poweroning").show();
                colorchange.colorChange("start");
                timeout = setTimeout(function () {
                    ParticleSystemPD.simpleParticles("start");
                    clearTimeout(timeout);
                }, 2400)
            }, 1800)
        }, 1200);
    };
    //音量键
    $(".b-audio").on("click", function () {
        var that = $(this).find("i");
        that.stop().animate({
            width: 0,
            right: 4
        }, 100, "linear", function () {
            that.stop().animate({
                width: 4,
                right: 0
            }, 100);
        });
        if (screenStatus == screenStatusEnum.normal) {
            $(".panda-opr-frame").show();
            $(".panda-opr-content").css({
                height: 30,
                top: 180
            }).html("");
            setTimeout(function () {
                $(".panda-opr-frame").hide();
            }, 1000)
        }
    });
    var pandaContent = $(".panda-content");
    //相机键
    $(".b-camera").on("click", function () {
        var that = $(this).find("i");
        that.stop().animate({
            width: 0,
            right: 4
        }, 100, "linear", function () {
            that.stop().animate({
                width: 4,
                right: 0
            }, 100);
        });
        if (screenStatus == screenStatusEnum.normal) {
            camera && (pandaContent[2].style.display == "block") && camera.takePhote();
            showCamera();
        }
    });
    $(".panda-return").on("click", function () {
        var frame = $(".panda-menu-frame");
        if (frame.is(":visible")) {
            return frame.hide();
        }
        var widget = $(".panda-menu-widget");
        if (widget.is(":visible")) {
            return widget.hide();
        }
        pandaContent.each(function (index, item) {
            if (item.style.display == "block") {
                if (contentIndex && currDomIndex > 1) {
                    var pandaContent = pandaContent[contentIndex];
                    pandaContent.getElementsByClassName("currDomIndex" + currDomIndex).hide();
                    pandaContent.getElementsByClassName("currDomIndex" + (currDomIndex - 1)).show();
                    currDomIndex--;
                } else {
                    $(".panda-opr-frame").show();
                    $(".panda-opr-content").css({
                        height: 84,
                        top: 156
                    }).html("<span style='text-align: center'><br>是否退出？</span>" +
                        "<p><button  data-index='0'>确认</button><button  data-index='1'>取消</button></p>")
                        .find("button").on("click", function () {
                            $(this).attr("data-index") == 0 && showHome();
                            $(".panda-opr-frame").hide();
                        });
                }
            }
        });
        $(".panda-screen-nav div")[1].click();
    });
    var showHome = function () {
        var num = 0;
        pandaContent.each(function (index, item) {
            if (item.style.display == "block") {
                item.style.display = "none";
                num++;
            }
        });
        num == 0 && $(".panda-screen-nav div")[1].click();
        $(".default-hide").hide();
        currDomIndex = 1;
        contentIndex = null;
    };
    $(".panda-home").on("holdTime", {time: 1200}, function () {
        if (screenStatus == screenStatusEnum.normal) {
            var pandaMenuFrame = $(".panda-menu-frame").show();
            if (pandaMenuFrame.find(".icon").length > 0) {
                pandaMenuFrame.find("span")[0].style.display = "";
            } else {
                pandaMenuFrame.find("span").hide();
            }
        }
    }).on("click", function () {
        if (!this.holdTime) {
            screenStatus == screenStatusEnum.normal && showHome();
        }
    });
    $(".panda-menu").on("click", function () {
        screenStatus == screenStatusEnum.normal && $(".panda-menu-widget").toggle();
    });
    var phone_contact_msg = null, autoaddto = null;
    // 联系人、拨号、通讯录tab
    $(".pcm-tab").on("click", function () {
        pandaContent[0].style.display = "block";
        var index = $(this).attr("data-opr");
        if (!autoaddto) {
            var data = [];
            $(".screen-msg .contact-num").each(function () {
                data.push($(this).text());
            });
            autoaddto = $(".contact-search").autoAddto({
                data: data
            });
        }
        phone_contact_msg ? phone_contact_msg.movableTab("show", index) : (phone_contact_msg = $(".phone-contact-msg").movableTab({
            width: 278,
            title: "bottom",
            addStyle: false,
            height: 408,
            movable: true,
            event: "click",
            auto: false
        }).movableTab("show", index));
    });
    $(".phone-contact-msg .phone-num li").on("click", function () {
        var input = $(this).parent().find("input"),
            val = input.val();
        if ($(this).hasClass("num")) {
            input.val(val + $(this).text());
            if (input.val().length > 13) {
                input.css("font-size", "12px");
            }
        } else if ($(this).hasClass("delnum")) {
            if (!val || val.length == 0) {
                return;
            }
            input.val(val.substring(0, val.length - 1));
        }
    });
    var camera = null, slide = null;
    var showCamera = function () {
        pandaContent.eq(2).show();
        if (camera) return;
        camera = $(".panda-screen-camera").simpleCamera({
            width: 272,
            height: 420,
            photoW: 272,//摄像头宽
            photoH: 378,//摄像头高
            doImage: $(".panda-gallery-carame"),
            onEnd: function (img) {
                $(".panda-gallery-msg").hide();
                img = img.cloneNode(true);
                var h = 160, w = 272 / 378 * h,
                    deg = ranNum(-80, 80),
                    t = 137 - h / 2, l = 108 - w / 2;
                $(img).css({
                    "position": "absolute",
                    "height": h,
                    width: w,
                    opacity: 0.8,
                    top: t + "px",
                    left: l + "px",
                    transform: "rotate(" + deg + "deg)",
                    "-webkit-transform": "rotate(" + deg + "deg)",
                    "-moz-transform": "rotate(" + deg + "deg)"
                });
                $(".screen-gallery-plugin").append(img);
            }
        });
    };
    var ranNum = function (min, max) {
        var t = Math.random();
        return min * t + max * (1 - t);
    };
    $(".panda-screen-icons").on("click", ".screen-icon", function () {
        if ($(this).hasClass("plane")) {
            return pandaContent[1].style.display = "block";
        }
        if ($(this).hasClass("camera")) {
            return showCamera();
        }
        if (!$(this).hasClass("gallery")) {
            return
        }
        contentIndex = 3;
        currDomIndex = 1;
        pandaContent.eq(3).show();
        var gallery = $(".panda-screen-gallery");
        gallery.find(".panda-gallery-msg").hide();
        gallery.find(".gallery-item").show().on("click", function () {
            if (this.getElementsByTagName("img").length < 1) return;
            currDomIndex = 2;
            $(".gallery-item-main").show().html("");
            $(this).find("img").each(function (item, index) {
                var img = item.cloneNode(true);
                img.className = "gallery-item-" + (index % 3);
                $(".gallery-item-main").append(img);
            });
            $(".gallery-item-main img").on("click", function () {
                $(".gallery-detail")[0].style.display = "block";
                currDomIndex = 3;
                var imgtools = $(".panda-imgtools").html("");
                imagetools = panda.widget.manager.get(require("widget.ImageTools"), {
                    container: imgtools,
                    image: this.src,
                    mode: "css3|filter",
                    maxImgW: 272,//图片最大宽度
                    maxImgH: 378,//图片最大高度
                    imageZoom: {
                        container: "in",//$("#zoom"),//图片放大预览的容器，为空默认在原图右方显示
                        //preImage: null,
                        refImage: 2,
                        width: 100,//272,//预览框宽
                        height: 100// 378//预览框高
                    }// 放大镜，暂只支持css3模式下有效，参见 ImageZoom 组件参数
                });
            });
        });
    });
    $(".screen-gallery-plugin").on("click", function () {
        if (this.getElementsByTagName("img").length < 1) return;
        pandaContent.eq(4).show();
        contentIndex = 4;
        currDomIndex = 1;
        if (slide) slide.distroySelf();
        var slideMain = $(".gallery-slide-main").html("");
        $(".panda-gallery-carame img").each(function (item) {
            var img = item.cloneNode(true);
            $(img).css({
                height: 390,
                width: 278
            });
            slideMain.append(img);
        });
        slide = new panda.widget.manager.get(require("widget.MultSlide"), {
            container: slideMain,//Slide容器
            width: 272,//图片宽度
            height: 360,//图片高度
            numNav: false,//是否显示数字导航条
            thumbsNav: "bottom",//缩略图导航位置，left top bottom right，为空不显示缩略图导航
            thumbsW: 50,//缩略图宽
            thumbsH: 40,//缩略图高
            margin: 3,
            pageSize: 8,
            event: "click",//导航切换图片的事件：mouseover、click ...
            auto: false,//是否自动切换
            tweener: {
                vertical: true,//是否垂直滚动（方向不能改）
                type: "easeInOutQuint", //滑动类型 linear easeInQuad easeOutQuad easeInOutQuad easeInCubic easeOutCubic easeInOutCubic
                // easeInQuart easeOutQuart easeInOutQuart easeInQuint easeOutQuint easeInOutQuint easeInSine easeOutSine easeInOutSine
                duration: 600,//滑动持续时间
                pause: 1500//停顿时间(Auto为true时有效)
            }
        });
        $(".gallery-slide .slide-play").on("click", function () {
            if (slide.options.auto) {
                this.innerHTML = "播放";
                slide.stop();
            } else {
                slide.play();
                this.innerHTML = "停止"
            }
        });
    });
    //导航
    $(".panda-screen-nav div").on("click", function () {
        if ($(this).hasClass("curr-nav")) {
            return;
        }
        var _this = this;
        var curr = $(".panda-screen-nav .curr-nav").removeClass("curr-nav");
        $(".panda-screen-nav i").animate({
            left: _this.offsetLeft
        }, 400, function () {
            $(_this).addClass("curr-nav");
        });
        var screemFrame = $(".screem-frame");
        var screemto = (curr.attr("data-index") - $(_this).attr("data-index")) * 278 + screemFrame[0].offsetLeft;
        screemFrame.animate({
            left: screemto
        }, 400);
    });
    //历史记录
    $(".icon").on("click", function () {
        var x = this.className.replace("icon", "").replace("screen-icon", "").replace("panda-dock-icon", "").replace("pcm-tab", "");
        x = x.replace(/[ ]/g, "");
        var menuFrame = $(".panda-menu-frame ." + x), tasklist = $(".panda-opr-menu .opr-menu-tasklist");
        if (menuFrame.length == 1) {
            tasklist.prepend(menuFrame)
        } else {
            var dom = this.cloneNode(true);
            if ($(dom).hasClass("panda-dock-icon")) { // 修复样式
                $(dom).css("margin","0 10px 24px");
            }
            tasklist.prepend(dom);
            dom.onclick = function () {
                $("." + x)[0].click();
                $(".panda-menu-frame")[0].style.display = 'none';
            }
        }
    });
    $(".easytable-plugin-detail").on("click", function () {
        pandaContent.eq(5).show();
        contentIndex = 5;
        currDomIndex = 1;
        //panda.widget.manager.get(require("widget.SortTable"), {
        //    table: $(".easy-table-main"),
        //    index: 0,//td索引
        //    property: "innerHTML",//获取数据的属性
        //    type: "string",//比较的数据类型
        //    desc: true,//是否按降序
        //    compare: null,//自定义排序函数
        //    value: null,//自定义取值函数
        //    onBegin: function () {
        //    },//排序前执行
        //    onEnd: function () {
        //    }//排序后执行
        //});
    })
})