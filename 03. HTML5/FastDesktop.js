// FastIcon Desktop Library
// A Quick Icon Arrangement UX
// (C)2013 Jam Zhang
// By Jam Zhang


function FastDesktop (sym) {
    
    console.log('FastScreen');
    
    FastDesktop.dockArray = [
        {label:'电话', id:5},
        {label:'信息', id:4},
        {label:'日历', id:10},
        {label:'邮件', id:2}
    ];
    
    FastDesktop.iconArray = [
        [
            {label:'Mail', id:5},
            {label:'Safari', id:4},
            {label:'Map', id:10},
            {label:'Clock', id:2},
            {label:'Calendar', id:3},
            {label:'Camera', id:8},
            {label:'Photos', id:9},
            {label:'Weather', id:6},
            {label:'Yahoo!', id:7},
            {label:'Passbook', id:12},
            {label:'计算器', id:13},
            {label:'通讯录', id:14},
            {label:'提醒事项', id:15},
            {label:'备忘录', id:16},
            {label:'Facetime', id:17},
            {label:'视频', id:18},
            {label:'Game Center', id:19}
        ],
        [
            {label:'Path', id:41},
            {label:'Facebook', id:42},
            {label:'Twitter', id:43},
            {label:'Tumblr', id:44},
            {label:'微信', id:39},
            {label:'微博', id:40},
            {label:'1号店', id:49},
            {label:'天猫', id:45},
            {label:'淘宝', id:46},
            {label:'支付宝', id:47},
            {label:'虾米', id:48}
        ]
    ];
    
    FastDesktop.COLUMNS_PER_SCREEN = 4;
    FastDesktop.ROWS_PER_SCREEN = 5;
    
    FastDesktop.MARGIN_TOP = 50;
    FastDesktop.MARGIN_LEFT = 32;
    FastDesktop.GRID_WIDTH = 152;
    FastDesktop.GRID_HEIGHT = 176;
    FastDesktop.SCREEN_WIDTH = 640;
    FastDesktop.MAX_SCREEN = FastDesktop.iconArray.length - 1;
    
    FastDesktop.ICON_MOVE_TIME = .5; // The duration of icon movement
    FastDesktop.ICON_MOVE_EASING = Power2.easeOut; // The easing of icon movement
    FastDesktop.ICON_SCALE_BIG = 1.2; // The scale when icon is held
    FastDesktop.ICON_SCALE_TIME = .25; // The duration of icon scaling
    FastDesktop.ICON_SCALE_EASING = Back.easeOut; // The easing of icon scaling
    FastDesktop.ICON_HOLD_AND_DRAG_TIME = .1; // The time to trigger Hold and Drag behavior
    
    FastDesktop.currentScreen = 0;
    
    instance = this;
    this.sym = sym;
    this.element = sym.getSymbolElement();
    this.element.css ('position','absolute');
    this.element.append('<div id="screens" class="Screen" style="width:' + FastDesktop.SCREEN_WIDTH*FastDesktop.iconArray.length + 'px"></div>');
    FastDesktop.screenContainer = this.screenContainer = this.element.find('>#screens');
    //_desktop = this.element;
    
    
    // Initializing icons
    for (var a in FastDesktop.iconArray) {
        
        //this.element.append('<div id="screen0'+a+'" class="Screen" style="left:'+ (FastDesktop.SCREEN_WIDTH*a) +'px">Screen 0'+a+'</div>');
        
        for (var b in FastDesktop.iconArray[a]) {
            //console.log (FastDesktop.iconArray[a][b].label);
            FastDesktop.iconArray[a][b].instance = this.addIcon (a, b, FastDesktop.iconArray[a][b]);
        }
        
    }
    
    FastDesktop.touch = this.touch = new TouchLib(this.screenContainer);
    this.touch.onDragStart = onDragStart;
    this.touch.onDragEnd = onDragEnd;
    this.touch.enableDrag('h');
    
    function onDragStart () {
        TweenLite.killTweensOf(instance.screenContainer);
    }
    
    function onDragEnd (result) {
        
        var screenID;
        
        switch (result.gesture) {
            case TouchLib.SWIPE_LEFT:
                screenID = Math.min(FastDesktop.iconArray.length - 1, FastDesktop.currentScreen + 1);
                break;
            case TouchLib.SWIPE_RIGHT:
                screenID = Math.max(0, FastDesktop.currentScreen - 1);
                break;
            default:
                var offset = instance.screenContainer.offset();
                screenID = Math.round (-offset.left / FastDesktop.SCREEN_WIDTH);
                screenID = Math.max(0, Math.min(screenID, FastDesktop.MAX_SCREEN));
                //instance.checkPosition(true);
                break;
        }
        
        FastDesktop.switchScreen(screenID);
        
    }
    
}

FastDesktop.switchScreen = function (screenID) {
    console.log(screenID);
    PageFlipper.highlight(screenID);
    FastDesktop.currentScreen = screenID;
    var left = - screenID * FastDesktop.SCREEN_WIDTH;
    TweenLite.to(instance.screenContainer, FastDesktop.ICON_MOVE_TIME, {left:left+"px", ease:Power2.easeOut});
}

FastDesktop.prototype.addIcon = function (screenID, iconID, data) {
    //console.log('addIcon');
    var icon = new FastIcon(this.sym, '#screens', screenID, iconID, data);
    icon.element.offset(FastIcon.getIconPosition(screenID, iconID));
    return icon;
}

FastDesktop.addScreen = function () {
    PageFlipper.addDot();
    FastDesktop.iconArray[FastDesktop.iconArray.length] = [];
    FastDesktop.screenContainer.css('width', FastDesktop.SCREEN_WIDTH*FastDesktop.iconArray.length + 'px');
}


FastDesktop.removeScreen = function () {
    PageFlipper.removeDot();
    FastDesktop.iconArray.length --;
    FastDesktop.screenContainer.css('width', FastDesktop.SCREEN_WIDTH*FastDesktop.iconArray.length + 'px');
}

/** Get current screen offset
*/
FastDesktop.getOffset = function () {
    return FastDesktop.screenContainer.offset().left;
}


/** Move an icon to a new place and move all related icons in both data and view
@param iconID1 (int or String) The ID of icon within the destination screen. If iconID1 is "auto", it will be put at the end of the screen.
*/
FastDesktop.moveIcon = function (screenID0, iconID0, screenID1, iconID1, moveThisIcon) {
    //console.log('moveIcon', iconID0, '->', iconID1);
    
    if (iconID1 == 'auto') {
        // Add screen if not existing
        if (!FastDesktop.iconArray[screenID1]) {
            FastDesktop.addScreen();
        }
        iconID1 = FastDesktop.iconArray[screenID1].length;
    }
    
    var data = FastDesktop.iconArray[screenID0][iconID0];
    
    // Move icons in the view
    if (screenID0!=screenID1) {
        // Cross-screen
        shiftLeft(screenID0, Number(iconID0)+1, FastDesktop.iconArray[screenID0].length);
        FastDesktop.iconArray[screenID0].length--;
        PageFlipper.pulse(screenID1);
    } else if (iconID0 < iconID1) {
        // Shift left
        shiftLeft(screenID0, Number(iconID0)+1, iconID1);
    } else {
        // Shift right
        shiftRight(screenID0, Number(iconID0-1), iconID1);
    }
    
    data.instance.screenID = screenID1;
    data.instance.iconID = iconID1;
    FastDesktop.iconArray[screenID1][iconID1] = data;
    if (moveThisIcon) {
        data.instance.moveAuto('h');
    }
    
    // Remove screen and switch to the previous one if empty
    if (FastDesktop.iconArray[screenID0].length <= 0) {
        FastDesktop.removeScreen();
        FastDesktop.switchScreen(FastDesktop.currentScreen - 1);
    }
    
    
    function shiftLeft(screenID, fromID, toID) {
//        console.log('shiftLeft', screenID, fromID, '->', toID);
        for (var n = fromID; n <= toID; n++) {
            if (FastDesktop.iconArray[screenID][n]) {
                //FastDesktop.iconArray[screenID][n].instance.moveTo(screenID, n-1);
                FastDesktop.iconArray[screenID][n].instance.iconID--;
                FastDesktop.iconArray[screenID][n].instance.moveAuto();
                // Move data
                FastDesktop.iconArray[screenID][n-1] = FastDesktop.iconArray[screenID][n];
            }
        }
    }
    
    function shiftRight(screenID, fromID, toID) {
//        console.log('shiftRight', screenID, fromID, '->', toID);
        for (var n = fromID; n >= toID; n--) {
            if (FastDesktop.iconArray[screenID][n]) {
                //FastDesktop.iconArray[screenID][n].instance.moveTo(screenID, n+1);
                FastDesktop.iconArray[screenID][n].instance.iconID++;
                FastDesktop.iconArray[screenID][n].instance.moveAuto();
                // Move data
                FastDesktop.iconArray[screenID][Number(n)+1] = FastDesktop.iconArray[screenID][n];
            }
        }
    }
    
}
