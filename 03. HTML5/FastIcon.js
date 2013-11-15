// FastIcon Library
// A Quick Icon Arrangement UX
// (C)2013 Jam Zhang
// By Jam Zhang


function FastIcon(symbol, container, screenID, iconID, data) {
    //console.log('FastIcon', screen);
    var instance = this;
    this.screenID = screenID;
    this.iconID = iconID;
    var sym = symbol.createChildSymbol('FastIcon', container);
    var element = this.element = sym.getSymbolElement();
    //_icon = instance;
    
    FastIcon.initIconContent(sym, data.id, data.label);
    
    var touch = new TouchLib(element);
    touch.onDragStart = onDragStart;
    touch.onHoldAndDragStart = onHoldAndDragStart;
    touch.onHoldAndDragFailed = onHoldAndDragFailed;
    touch.enableDrag('hv', {
        holdAndDragOnly: true,
        holdAndDragTime: FastDesktop.ICON_HOLD_AND_DRAG_TIME
    });
    //TouchLib.bindAction(element, 'touchstart', onTouchStart);
    
    function onDragStart (e) {
        console.log('onDragStart');
    }
    
    function onHoldAndDragFailed (e) {
        FastDesktop.touch.startTouch(e);
    }
    
    function onHoldAndDragStart () {
        console.log('onHoldAndDrag');
        touch.onHoldAndDragMove = onHoldAndDragMove;
        touch.onDragEnd = onDragEnd;
        instance.hover();
    }
    
    function onHoldAndDragMove () {
        //console.log('onHoldAndDragMove');
        instance.checkPosition();
    }
    
    function onDragEnd (result) {
        console.log('onDragEnd callback', result.gesture);
        touch.onDragMove = null;
        touch.onDragEnd = null;
        switch (result.gesture) {
            case TouchLib.SWIPE_LEFT:
                if (instance.screenID == 0) {
                    instance.moveAuto();
                    return;
                }
                FastDesktop.moveIcon(instance.screenID, instance.iconID, Number(instance.screenID)-1, 'auto', true);
                break;
            case TouchLib.SWIPE_RIGHT:
                FastDesktop.moveIcon(instance.screenID, instance.iconID, Number(instance.screenID)+1, 'auto', true);
                break;
            default:
                instance.checkPosition(true);
                break;
        }
    }
    
}


FastIcon.initIconContent = function (sym, id, label) {
//    console.log('initIconContent', id, label);
    if (id || id==0) {
        var y = Math.floor(id * .1);
        var x = id - y * 10;
        sym.getSymbol('icon').$('icon').css('background-position', (-120*x)+'px '+(-120*y)+'px');
    }
    
    sym.getSymbolElement().css ('position','absolute');
    sym.$('textLabel').html(label);
}


FastIcon.prototype.checkPosition = function (isIconReleased) {
    
    var newID = this.getIconID(this.screenID);
    if (this.iconID != newID.iconID) {
        //console.log('Icon position changed', this.iconID, '->', newID.iconID);
        FastDesktop.moveIcon (this.screenID, this.iconID, this.screenID, newID.iconID, false);
        this.iconID = newID.iconID;
    }
    if (isIconReleased) {
        this.moveTo (newID.screenID, newID.iconID);
    }
    
}



FastIcon.prototype.hover = function () {
    TweenLite.to(this.element, FastDesktop.ICON_SCALE_TIME, {scale: 1.2, ease:FastDesktop.ICON_SCALE_EASING});
}


FastIcon.prototype.land = function () {
    TweenLite.to(this.element, FastDesktop.ICON_SCALE_TIME, {scale: 1, ease:FastDesktop.ICON_SCALE_EASING});
}

/** Get icon screenID and iconID based on current position. Return is an object with screenID, columnID, rowID and iconID.
@param screenID (int) If screenID given, the result will always be limited within this screen. If not, the result screenID will be calculated according to the position.
*/
FastIcon.prototype.getIconID = function (screenID) {
    var offset = this.element.offset();
    offset.left -= FastDesktop.getOffset();
    if (!screenID && screenID!=0) {
        screenID = Math.floor(offset.left / FastDesktop.SCREEN_WIDTH);
    }
    var columnID = Math.floor((offset.left + FastDesktop.GRID_WIDTH * .5 - FastDesktop.MARGIN_LEFT - FastDesktop.SCREEN_WIDTH * screenID) / FastDesktop.GRID_WIDTH);
    columnID = Math.max (0, Math.min ( columnID, FastDesktop.COLUMNS_PER_SCREEN - 1));
    var rowID = Math.floor((offset.top + FastDesktop.GRID_HEIGHT * .5 - FastDesktop.MARGIN_TOP) / FastDesktop.GRID_HEIGHT);
    rowID = Math.max (0, Math.min ( rowID, FastDesktop.ROWS_PER_SCREEN - 1));
    var iconID = columnID + rowID * FastDesktop.COLUMNS_PER_SCREEN;
    iconID = Math.max (0, Math.min ( iconID, FastDesktop.iconArray[screenID].length - 1));
    //console.log ('Scr', screenID, 'Col', columnID, 'Row', rowID, 'ID', iconID);
    return {screenID: screenID, columnID: columnID, rowID: rowID, iconID: iconID};
}

// Get position in PX by screenID and iconID
FastIcon.getIconPosition = function (screenID, iconID) {
    var columnID = iconID % FastDesktop.COLUMNS_PER_SCREEN;
    var rowID = Math.floor (iconID / FastDesktop.COLUMNS_PER_SCREEN);
    var left = FastDesktop.SCREEN_WIDTH * screenID + FastDesktop.MARGIN_LEFT + columnID * FastDesktop.GRID_WIDTH;
    var top = FastDesktop.MARGIN_TOP + rowID * FastDesktop.GRID_HEIGHT;
    return {
        left: left,
        top: top
    };
}


/** Animate icon to a certain screenID and iconID
@param direction (String) 'h' Horizontal motion, 'v' Vertical motion, Default is linear motion
*/
FastIcon.prototype.moveTo = function (screenID, iconID, direction) {
    var offset = FastIcon.getIconPosition(screenID, iconID);
    if (!direction) {
        direction = '';
    }
    switch (direction.toLowerCase()) {
        case 'h': 
            TweenLite.to(this.element, FastDesktop.ICON_MOVE_TIME, {scale:1, ease:FastDesktop.ICON_MOVE_EASING});
            TweenLite.to(this.element, FastDesktop.ICON_MOVE_TIME, {left:offset.left+"px", ease:Power1.easeOut});
            TweenLite.to(this.element, FastDesktop.ICON_MOVE_TIME, {top:offset.top+"px", ease:Power1.easeIn});
            break;
        case 'v': 
            TweenLite.to(this.element, FastDesktop.ICON_MOVE_TIME, {scale:1, ease:FastDesktop.ICON_MOVE_EASING});
            TweenLite.to(this.element, FastDesktop.ICON_MOVE_TIME, {left:offset.left+"px", ease:Power1.easeIn});
            TweenLite.to(this.element, FastDesktop.ICON_MOVE_TIME, {top:offset.top+"px", ease:Power1.easeOut});
            break;
        default:
            TweenLite.to(this.element, FastDesktop.ICON_MOVE_TIME, {scale:1, left:offset.left+"px", top:offset.top+"px", ease:FastDesktop.ICON_MOVE_EASING});
            break;
    }
}


// Animate icon in position according to its screenID and iconID
FastIcon.prototype.moveAuto = function (direction) {
    this.moveTo(this.screenID, this.iconID, direction);
}
