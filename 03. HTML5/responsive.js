// Porsche 911 50th Anniversary Campaign Responsive Library
// (P)2013 01COSMOS
// By Jam Zhang


// Auto-size

var Responsive = {
	STAGE_WIDTH: 640,
	STAGE_HEIGHT: 1136,
	fitList: []
};


/**
对象根据舞台自适应方法

sym 为需要自适应的Symbol

mode 为字符串，代表自适应模式，可以是以下多个模式的组合
- "l" 左对齐
- "r" 右对齐
- "c" 水平居中对齐
- "t" 左对齐
- "b" 左对齐
- "m" 垂直居中对齐
- "w" 宽度撑满 (可能变形)
- "h" 高度撑满 (可能变形)
- "fw" 宽度撑满 (锁定比例)
- "fh" 高度撑满 (锁定比例)
- "ff" 全屏撑满 (锁定比例/可能出现裁剪/没有空白)
- "fl" 全部显示 (锁定比例/可能出现空白/不会裁剪)

options 为对象，可省略，包含高级属性
- offsetX 给最终位置加上水平偏移 (缺省为0)
- offsetY 给最终位置加上垂直偏移 (缺省为0)
- marginX 在计算stage宽度时总是扣除的横向边距 (缺省为0)
- marginY 在计算stage高度时总是扣除的纵向边距 (缺省为0)
- contentWidth 手工指定被fit对象的宽度 (缺省则取对象实际宽度)
- contentHeight 手工指定被fit对象的高度 (缺省则取对象实际高度)

*/
Responsive.fit = function(sym, mode, options){

	//console.log('fit', options);
	
	// Prevent duplication in list
	for (var n in Responsive.fitList) {
		if (Responsive.fitList[n].sym == sym) {
			return;
		}
	}
	
	// Set transform origin to 0,0
	sym.getSymbolElement().css('transform-origin','0% 0%');
	sym.getSymbolElement().css('-webkit-transform-origin','0% 0%');
	sym.getSymbolElement().css('-moz-transform-origin','0% 0%');
	sym.getSymbolElement().css('-o-transform-origin','0% 0%');
	
	if(!options) {
		options = {};
	}
	if(!options.offsetX) {
		options.offsetX = 0;
	}
	if(!options.offsetY) {
		options.offsetY = 0;
	}
	if(!options.marginX) {
		options.marginX = 0;
	}
	if(!options.marginY) {
		options.marginY = 0;
	}
	if(!options.contentWidth) {
		options.contentWidth = Responsive.STAGE_WIDTH;
	}
	if(!options.contentHeight) {
		options.contentHeight = Responsive.STAGE_HEIGHT;
	}
	options.mode = mode;
	sym.setVariable('_responsive_options', options);
	
	Responsive.fitList.push({
		sym: sym,
		options: options
	});
	
	Responsive.doFit(sym);
	
}


Responsive.doFit = function(sym){
	
	var options = sym.getVariable('_responsive_options');
	
	var scaleX = 1;
	var scaleY = 1;
	var top;
	var left;
	var _stage = sym.getComposition().getStage().getSymbolElement();
	var sw = _stage.width()-options.marginX;
	var sh = _stage.height()-options.marginY;
	
	if (options.debug) {
		console.log('Stage Width', _stage.width(), 'Content Width', options.contentWidth);
		Responsive.debugSym = sym;
		Responsive.debugElement = sym.getSymbolElement();
	}
	
	for(var n=0; n<options.mode.length; n++) {
		switch (options.mode.charAt(n).toLowerCase()) {
		
			case 'f': // Fit and keep proportion
			
				n++;
				
				switch (options.mode.charAt(n).toLowerCase()) {
					case 'w': // Fit to stage width
						scaleX = scaleY = sw / options.contentWidth;
						if (options.debug) {
							console.log('Fit Width');
						}
						break;
				
					case 'h': // Fit to stage height
						scaleX = scaleY = sh / options.contentHeight;
						if (options.debug) {
							console.log('Fit Height', _stage.height(), options.contentHeight);
						}
						break;
						
					case 'l': // Fit to letterbox
						scaleX = scaleY = Math.min (sw / options.contentWidth, sh / options.contentHeight);
						if (options.debug) {
							console.log('Fit to letterbox', scaleX, scaleY, options);
						}
						//scaleX = scaleY = Math.max(scaleX, scaleY);
						break;
				
					case 'f': // Fit to fullscreen
						scaleX = scaleY = Math.max (sw / options.contentWidth, sh / Responsive.STAGE_HEIGHT);
						if (options.debug) {
							console.log('Fit to fullscreen', scaleX, scaleY, options);
						}
						break;
				
				}
				break;
				
				
			// Stretching modes	
				
			case 'w': // Stretch to stage width
				//console.log('Stretch Width');
				scaleX = sw / options.contentWidth;
				break;
		
			case 'h': // Stretch to stage height
				//console.log('Stretch Height');
				scaleY = sh / options.contentHeight;
				break;
				
				
			// Aligning modes	
			// offset * scale will be added after parsing the whole mode string
			
			case 'c': // Horizontally center aligned
				left = sw * .5;
				if (options.debug) {
					console.log('Center Align Left=', left);
				}
				break;
				
			case 'm': // Vertically middle aligned
				//console.log('Middle Align');
				top = sh * .5;
				break;
				
			case 'l': // Horizontally left aligned
				//console.log('Left Align');
				left = 0;
				break;
				
			case 'r': // Horizontally right aligned
				//console.log('Right Align');
				left = sw;
				break;
				
			case 't': // Vertically top aligned
				//console.log('Top Align');
				top = 0;
				break;
				
			case 'b': // Vertically bottom aligned
				//console.log('Bottom Align');
				top = sh;
				break;
				
		}
	}
	
	element = sym.getSymbolElement();
	
	// Scale
	if (scaleX!=1 ||scaleY!=1) {
		element.css({
			"transform": "scale("+scaleX+","+scaleY+")",
			"-ms-transform": "scale("+scaleX+","+scaleY+")",/* IE 9 */
			"-webkit-transform":  "scale("+scaleX+","+scaleY+")" /* Safari and Chrome */
		});
	}
	
	// Top
	if (top) {
		top += options.offsetY * scaleY;
		element.css({
			"top": top+"px"
		});
	}
	
	// Left
	if (left) {
		left = Math.round (left + options.offsetX * scaleX);
		if (options.debug) {
			console.log('Left with ScaleX =', left, 'scaleX =', scaleX);
		}
		element.css({
			"left": left+"px"
		});
	}
	
}

Responsive.onResize = function(){
	for (var n in Responsive.fitList) {
		Responsive.doFit(Responsive.fitList[n].sym, Responsive.fitList[n].mode);
	}
}

//  Make contents inside container center aligned
Responsive.centerAlign = function(container){
	container.css('margin','0 auto');
	container.css('text-align','center');
}


/**************************************/
//
// Text
//
/**************************************/

// Creating centered text
Responsive.createCenteredText = function(element, text) {
	element.css('display','table');
	element.css('text-align','center');
	element.html('<h2 id="text" class="ButtonInner">'+text+'</h2>');
	//element.html('<h2 id="text" style="color: #FFF; display: table-cell; vertical-align: middle">'+text+'</h2>');
	//console.log($('#fittext')[0]);
	//$('#fittext')[0].fitText();
}

// Auto-fit text to the container
Responsive.fitText = function( element, kompressor, options ) {
	
    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);


	// Store the object
	var $this = element;

	// Resizer() resizes items based on the object width divided by the compressor * 10
	var resizer = function () {
		$this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
	};

	// Call once to set.
	resizer();

	// Call on resize. Opera debounces their resize by default.
	$(window).on('resize.fittext orientationchange.fittext', resizer);

}
