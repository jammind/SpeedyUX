// Multi-touch Gesture and Behavior Library
// (C)2013 Jam Zhang
// By Jam Zhang & Terence Wang



/** Initializing TouchLib on an element.
@param target (element) The target element on which TouchLib will be initialized.
*/
function TouchLib (target) {
    this.target = target;
    this.onDragStart = null;
    this.onDragMove = null;
    this.onDragEnd = null;
    this.onHoldAndDragStart = null;
    this.onHoldAndDragFailed = null;
    this.onHoldAndDragMove = null;
    this.beingDragged = false; // Indicates this instance is being dragged and prevent other instances from starting drag
    this.beingHeldAndDragged = false; // Indicates this instance is being held for a specific time and dragged
    this.trail = []; // A trail of positions to tell the dragging gesture.
    this.trailIntervalID = -1; // To store the ID of setInterval used by trail logging.
    this.holdTimeoutID = -1; // To store the ID of setTimeout used by Hold and Drag logic.
    this.dragOptions = {}; // Optional advanced attributes
};

TouchLib.TRAIL_LENGTH = 5; // The length of trail array.
TouchLib.TRAIL_INTERVAL = 20; // The interval of each sample in trail array in Milliseconds.
TouchLib.MIN_SWIPE_SPEED = 500; // The minimal speed in PX per second in which the icon will trigger a Throw-to-next-screen behavior.
TouchLib.MAX_SWIPE_ANGLE_RANGE = 20; // The maximum directional error range in Degree in which an horizontal or vertical gesture will tolerate.
TouchLib.MIN_MOVEMENT_DISTANCE = 10; // Movement with distance smaller than this value will be ignored and treated as still.
TouchLib.OVERFLOW_SPEED = 0.5; // Speed multiplier when element is dragged outside the limits
TouchLib.SWIPE_LEFT = 'swipe left';
TouchLib.SWIPE_RIGHT = 'swipe right';

/** Enable drag behavior.
@param mode (String) "h" means horizontal dragging. "v" means vertical dragging. Default value is "hv".
@param dragOptions (Object) Optional advanced attributes {
    minLeft (Number) Minimal value of Left
    maxLeft (Number) Maximum value of Left
    minTop (Number) Minimal value of Top
    maxTop (Number) Maximum value of Top
    holdAndDragTime (Number) In seconds. If given, this.onHoldAndDragStart will be called only when you have held the touch point still for a specific time. And this.beingHeldAndDragged flag will be set true.
*/
TouchLib.prototype.enableDrag = function (mode, dragOptions) {
    
    if (!mode) {
        mode = 'hv';
    }
    if (!dragOptions) {
        dragOptions = {};
    }
    this.mode = mode;
    this.dragOptions = dragOptions;
    var instance = this;
    TouchLib.bindAction(this.target, 'touchstart', onTouchStart);
    this.startTouch = onTouchStart;
    this.endTouch = onTouchEnd;
    
    function logTrail (){
        instance.trail.push(instance.target.offset());
        if (instance.trail.length > TouchLib.TRAIL_LENGTH) {
            instance.trail.shift();
        }
    }
    
    function onTouchStart (e){
        //console.log('FastIcon.prototype.onTouchStart', e.originalEvent.pageX, e.originalEvent.pageY);
        e.stopPropagation(); // Prevent parent elements from getting this event
        
        instance.touchX0 = e.originalEvent.pageX;
        instance.touchY0 = e.originalEvent.pageY;
        instance.offset0 = instance.target.offset();
        
        // Keep track of the dragging trail
        instance.trail = [instance.offset0];
        if (instance.trailIntervalID >= 0) {
            clearInterval(instance.trailIntervalID);
        }
        instance.trailIntervalID = setInterval(logTrail, TouchLib.TRAIL_INTERVAL);
        
        if (instance.dragOptions.holdAndDragTime) {
            instance.initialTouchEvent = e;
            instance.holdTimeoutID = setTimeout(onHold, instance.dragOptions.holdAndDragTime * 1000);
        }
        
        // Binding event globally
        TouchLib.bindAction($(document), 'touchmove', onTouchMove);
        TouchLib.bindAction($(document), 'touchend', onTouchEnd);
        
        // Customized callback
        if (instance.onDragStart) {
            instance.onDragStart(e);
        }
    }
    
    function onHold (){
        if (instance.holdTimeoutID >= 0) {
            clearTimeout(instance.holdTimeoutID);
            instance.holdTimeoutID = -1;
        }
        instance.beingHeldAndDragged = true;
        if (instance.onHoldAndDragStart) {
            instance.onHoldAndDragStart(instance.initialTouchEvent);
        }
    }
    
    function onTouchMove (e){
        //console.log('FastIcon.prototype.onTouchMove', e.originalEvent.pageX, e.originalEvent.pageY);
        
        if (instance.beingDragged) {
            if ((instance.beingHeldAndDragged && instance.dragOptions.holdAndDragOnly) || !instance.dragOptions.holdAndDragOnly) {
                var left1;
                var top1;
                
                if (instance.mode.indexOf('h') >= 0) {
                    left1 = instance.offset0.left + e.originalEvent.pageX - instance.touchX0;
                } else {
                    left1 = instance.offset0.left;
                }
                
                if (instance.mode.indexOf('v') >= 0) {
                    top1 = instance.offset0.top + e.originalEvent.pageY - instance.touchY0;
                } else {
                    top1 = instance.offset0.top;
                }
                
                instance.target.offset({left:left1, top:top1});
                if (instance.beingHeldAndDragged) {
                    if (instance.onHoldAndDragMove) {
                        instance.onHoldAndDragMove(e);
                    }
                } else if (instance.onDragMove) {
                    instance.onDragMove(e);
                }
            }
        } else {
            if (Math.sqrt(Math.pow(e.originalEvent.pageX - instance.touchX0, 2), Math.pow(e.originalEvent.pageY - instance.touchY0, 2)) > TouchLib.MIN_MOVEMENT_DISTANCE) {
                TouchLib.beingDragged = instance.beingDragged = true;
                if (instance.holdTimeoutID >= 0) {
                    clearTimeout(instance.holdTimeoutID);
                    instance.holdTimeoutID = -1;
                    
                    // Hold and Drag behavior failed and call the deligate
                    if (instance.dragOptions.holdAndDragTime && instance.onHoldAndDragFailed) {
                        instance.onHoldAndDragFailed(e);
                    }
                }
            }
        }
        
    }
    
    function onTouchEnd (e){
        $(document).unbind('touchmove touchend mousemove mouseup');
        TouchLib.beingDragged = instance.beingDragged = false;
        
        // Calculate the dragging trail and recognize the gesture
        if (instance.trailIntervalID >= 0) {
            clearInterval(instance.trailIntervalID);
            instance.trailIntervalID = -1;
        }
        var result = {};
        with (result) {
            result.deltaH = instance.trail[instance.trail.length-1].left - instance.trail[0].left;
            result.deltaV = instance.trail[instance.trail.length-1].top - instance.trail[0].top;
            result.distance = Math.sqrt(deltaH*deltaH + deltaV*deltaV);
            result.speed = Math.round(distance / (TouchLib.TRAIL_INTERVAL * TouchLib.TRAIL_LENGTH / 1000)); // PX per second
            result.angle = Math.round(Math.atan2(-deltaV, deltaH) / Math.PI * 180); // Degree
            if (speed > TouchLib.MIN_SWIPE_SPEED) {
                if (Math.abs(angle) < TouchLib.MAX_SWIPE_ANGLE_RANGE) {
                    result.gesture = TouchLib.SWIPE_RIGHT;
                } else if (Math.abs(Math.abs(angle)-180) < TouchLib.MAX_SWIPE_ANGLE_RANGE) {
                    result.gesture = TouchLib.SWIPE_LEFT;
                }
            }

        }
        instance.inTouch = false;
        instance.beingDragged = false;
        instance.beingHeldAndDragged = false;
        instance.trail = [];
        
        if (instance.onDragEnd) {
            instance.onDragEnd(result);
        }
    }
}



TouchLib.prototype.disableDrag = function () {
    if (instance.holdTimeoutID >= 0) {
        clearTimeout(instance.holdTimeoutID);
        instance.holdTimeoutID = -1;
    }
		this.inTouch = false;
    this.beingDragged = false;
    this.beingHeldAndDragged = false;
    this.trail = [];
    this.target.unbind('touchstart mousedown');
}



/** bindAction
@param target (jQuery Element) The target element to bind action
@param event (String) The event you want to bind
@param callback (function(event, data)) The callback function when event is triggered
@param data (Object) The optional data object to pass to callback function
*/
TouchLib.bindAction = function(target, event, callback, data) {
    //console.log('TouchLib.bindAction');
    
    function internalCallback (e) {
        //console.log('internalCallback');
        e.preventDefault();
        callback(e, data);
    };
    
    // Replace touch events with mouse events on non-touch devices
    if (!Modernizr.touch) {
        switch (event) {
            case "touchstart":
                event = 'mousedown';
                break;
             case "touchend":
                event = 'mouseup';
                break;
             case "touchmove":
                event = 'mousemove';
                break;
        }
    }
    
    target[event](internalCallback);

}


/** TouchSlide
@param container (jQuery Element) The container div
@param type (String) "v" means vertical and "h" means horizontal
*/
function TouchSlide(container, type)
{
	//console.log('height', container.find('>div').height(), container.height());
	//console.log('width', container.find('>div').width(), container.width())
	//console.log("TouchLib type " + type);
	
	var defaultLeft = Number(String(container.css("margin-left")).split("px")[0]);
	var defaultTop = Number(String(container.css("margin-top")).split("px")[0]);
	
	//console.log("TouchLib : default margin-left = " + defaultLeft);
	//console.log("TouchLib : default margin-top = " + defaultTop);
	
	this.instance = this;
	
	if(!type)
	{
		this.type = "v";
	}
	else
	{
		this.type = type;
	}
	
	this.speed = 0;
	this.resistance = .3;
	this.y0 = 0;
	this.x0 = 0;
	this.y1 = 0;
	this.x1 = 0;
	this.yT0 = defaultTop;
	this.xT0 = defaultLeft;
	this.yT1 = 0;
	this.xT1 = 0;
	this.intervalId = -1,
	this.moveIntervalId = -1,
	this.moveArr = [];
	this.inTouch = false;
	this.origonalTarget = container;
	this.target = container.find('>div');
	this.contentHeight = this.target.height();
	this.contentWidth = this.target.width();
	
	this.parentWidth = container.width();
	this.parentHeight = container.height();
	
	if(this.type.charAt(0) == 'h')
	{
		if(this.contentWidth < this.parentWidth)
		{
			if(this.type.length > 1)
			{
				switch(this.type[1])
				{
					case "l":
					this.xT0 = 0;
					break;
					
					case "c":
					this.xT0 = (this.parentWidth - this.contentWidth) / 2;
					break;
					
					case "r":
					this.xT0 = this.parentWidth - this.contentWidth;
					break;
				}
				//console.log("TouchLib default margin-left " + this.xT0);
				this.target.css("margin-left", this.xT0);
			}
		}
	}
	
	if(this.type.charAt(0) == "v")
	{
		if(this.contentHeight < this.parentHeight)
		{
			if(this.type.length > 1)
			{
				switch(this.type[1])
				{
					case "t":
					this.yT0 = 0;
					break;
					
					case "m":
					this.yT0 = (this.parentHeight - this.contentHeight) / 2;
					break;
					
					case "b":
					this.yT0 = this.parentHeight - this.contentHeight;
					break;
				}
				//console.log("TouchLib default margin-top " + this.yT0);
				this.target.css("margin-top", this.yT0);
			}
		}
	}
	
	var instance = this;
	
	//console.log("TouchLib.onTouchStart contentHeight ", instance.contentHeight, "parentHeight ", instance.parentHeight);
	//console.log("TouchLib.onTouchStart contentWidth ", instance.contentWidth, "parentwidth ", instance.parentWidth);
	
	TouchSlide.prototype.onTouchStart = function (e)
	 {
		var defaultLeft = Number(String(instance.target.css("margin-left")).split("px")[0]);
		var defaultTop = Number(String(instance.target.css("margin-top")).split("px")[0]);
		 
		instance.xT0 = defaultLeft;
		instance.yT0 = defaultTop;
		 
		instance.inTouch = true;
		instance.contentWidth = instance.origonalTarget.find('>div').width();
		instance.contentHeight = instance.origonalTarget.find('>div').height();
		
		instance.parentWidth = instance.origonalTarget.width();
		instance.parentHeight = instance.origonalTarget.height();
		
		//console.log("TouchLib.onTouchStart contentHeight ", instance.contentHeight, "parentHeight ", instance.parentHeight);
		//console.log("TouchLib.onTouchStart contentWidth ", instance.contentWidth, "parentwidth ", instance.parentWidth);
		
		if(instance.type.charAt(0) == 'h')
		{
			if(instance.contentWidth < instance.parentWidth)
			{
				return;
			}
		}
		if(instance.type.charAt(0) == "v")
		{
			if(instance.contentHeight < instance.parentHeight)
			{
				return;
			}
		}
		
		var t = e.touches[0]; 		//获取第一个触点  
		var tx = Number(t.pageX); 	//页面触点X坐标  
		var ty = Number(t.pageY); 	//页面触点Y坐标  
		
		instance.y1 = instance.y0 = ty;
		instance.x1 = instance.x0 = tx;
	
		if(instance.intervalId > 0)
		{
			clearInterval(instance.intervalId);
		}
		
		if(instance.moveIntervalId > 0)
		{
			clearInterval(instance.moveIntervalId);
		}
		
		var instance2 = instance;
		
		instance.moveIntervalId = setInterval(function()
		{
			//console.log("moveIntervalid", tx);
			//console.log("contentHeight ", instance2.contentHeight);
			if(instance2.type.charAt(0) == "h")
			{
				instance2.moveArr.push(instance2.x1);
			}
			else
			{
				instance2.moveArr.push(instance2.y1);
			}
			if(instance2.moveArr.length > 5)
			{
				instance2.moveArr.shift();
			}
		}, 20);
		
	}
	
	TouchSlide.prototype.onTouchMove = function (e)
	{
		if(instance.type.charAt(0) == 'h')
		{
			if(instance.contentWidth < instance.parentWidth)
			{
				return;
			}
		}
		if(instance.type.charAt(0) == "v")
		{
			if(instance.contentHeight < instance.parentHeight)
			{
				return;
			}
		}
		
		var t = e.touches[0]; 		//获取第一个触点  
		var tx = Number(t.pageX); 	//页面触点X坐标  
		var ty = Number(t.pageY); 	//页面触点Y坐标  
		if (instance.inTouch)
		 {
			instance.x1 = tx;
			var gx = instance.x1 - instance.x0;
			var dx = instance.parentWidth-instance.contentWidth;
			if(instance.xT0 + gx >= 0)
			{
				instance.xT1 = (instance.xT0 + gx) * instance.resistance;
			}
			else if(instance.xT0 + gx <= dx)
			{
				instance.xT1 = ((instance.xT0 + gx) - dx) * instance.resistance + dx;
			}
			else
			{
				instance.xT1 = instance.xT0 + gx;
			}
			//instance.xT1 =  Math.max (Math.min(instance.xT0 + instance.x1 - instance.x0, 0), instance.parentWidth-instance.contentWidth);
			
			instance.y1 = ty;
			var gy = instance.y1 - instance.y0;
			var dy = instance.parentHeight-instance.contentHeight;
			if(instance.yT0 + gy >= 0)
			{
				instance.yT1 = (instance.yT0 + gy) * instance.resistance;
				console.log("yT1 re1 = " + instance.yT1);
			}
			else if(instance.yT0 + gy <= dy)
			{
				instance.yT1 = ((instance.yT0 + gy) - dy) * instance.resistance + dy;
				console.log("yT1 re2 = " + instance.yT1);
			}
			else
			{
				instance.yT1 = instance.yT0 + gy;
				console.log("yT1 re3 = " + instance.yT1);
			}
			
			//instance.yT1 = Math.max (Math.min(instance.yT0 + instance.y1 - instance.y0, 0), instance.parentHeight-instance.contentHeight);
			
			if(instance.type.charAt(0) == "h")
			{
				instance.target.css("margin-left", instance.xT1);
			}
			else
			{
				instance.target.css("margin-top", instance.yT1);
			}
					
		}
	}
	
	TouchSlide.prototype.onTouchEnd = function (e) 
	{
		if(instance.moveIntervalId > 0)
		{
			clearInterval(instance.moveIntervalId);
			moveIntervalId = -1;
		}
		
		if(instance.type.charAt(0) == 'h')
		{
			if(instance.contentWidth < instance.parentWidth)
			{
				return;
			}
		}
		if(instance.type.charAt(0) == "v")
		{
			if(instance.contentHeight < instance.parentHeight)
			{
				return;
			}
		}
		
		if (instance.inTouch)
		 {
			instance.inTouch = false;
			
			instance.yT0 = instance.yT1;
			instance.xT0 = instance.xT1;
			
			if(instance.type.charAt(0) == "h")
			{
				if(instance.xT0 < instance.parentWidth-instance.contentWidth)
				{
					console.log("x Out of bounds");
					instance.target.animate({"margin-left":instance.parentWidth-instance.contentWidth},500);
					instance.xT1 = instance.parentWidth-instance.contentWidth;
					return;
				}
				
				if(instance.xT0 > 0)
				{
					console.log("xt0 Out of bounds");
					instance.target.animate({"margin-left":0},500);
					instance.xT1 = 0;
					return;
				}
			}
			
			if(instance.type.charAt(0) == "v")
			{
				if(instance.yT0 > 0)
				{
					console.log("y Out of bounds");
					instance.target.animate({"margin-top":0},500);
					instance.yT1 = 0;
					return;
				}
				
				if(instance.yT0 < instance.parentHeight-instance.contentHeight)
				{
					console.log("y Out of bounds");
					instance.target.animate({"margin-top":instance.parentHeight-instance.contentHeight},500);
					instance.yT1 = 0;
					return;
				}
			}
						
			if (instance.moveArr.length > 1) {
				instance.speed = instance.moveArr[instance.moveArr.length - 1] - instance.moveArr[0];
	
				instance.intervalId = setInterval(function()
				{
					instance.speed *= .77;
					instance.xT0 += instance.speed;
					//instance.xT0 = Math.max (Math.min(instance.xT0, 0), instance.parentWidth-instance.contentWidth);
					instance.yT0 += instance.speed;
					//instance.yT0 = Math.max (Math.min(instance.yT0, 0), instance.parentHeight-instance.contentHeight);
					
					if(instance.type.charAt(0) == "h")
					{
						var dx = instance.parentWidth-instance.contentWidth;
						if(instance.xT0 > 0)
						{
							instance.xT0 = instance.xT0 * .5;
						}
						else if(instance.xT0 < dx)
						{
							instance.xT0 = (instance.xT0 - dx) * .5 + dx;
						}
						
						instance.target.css("margin-left", instance.xT0);
					}
					else
					{
						var dy = instance.parentHeight-instance.contentHeight;
						if(instance.yT0 > 0)
						{
							instance.yT0 = instance.yT0  * .5;
						}
						else if(instance.yT0 < dy)
						{
							instance.yT0 = (instance.yT0 - dy) * .5 + dy;
						}
						
						instance.target.css("margin-top", instance.yT0);
					}
	
					if(Math.abs(instance.speed) < .1)
					{
						clearInterval(instance.intervalId);
					}
				}, 50);
			}
	
			instance.moveArr = [];
	
		}
	}
	
	this.target[0].addEventListener("touchstart", this.onTouchStart);
	this.target[0].addEventListener("touchmove", this.onTouchMove);
	this.target[0].addEventListener("touchend", this.onTouchEnd);
	
}
