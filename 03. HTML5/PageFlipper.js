// FastIcon Page Flipper Library
// A Quick Icon Arrangement UX
// (C)2013 Jam Zhang
// By Jam Zhang


// Flipper Methods

function PageFlipper (sym) {
    
    PageFlipper.DOT_DISTANCE = 40;
    PageFlipper.DOT_DEFAULT_ALPHA = .5;
    PageFlipper.DOT_HIGHLIGHT_ALPHA = 1;
    
    PageFlipper.dotArray = [];
    PageFlipper.sym = sym;
    PageFlipper.element = sym.getSymbolElement();
    PageFlipper.element.css ('position','absolute');
    PageFlipper.element.append('<div id="dots" style="position:absolute"></div>');
    PageFlipper.dotContainer = PageFlipper.element.find('>#dots');
    PageFlipper.currentDot = 0;
    
    for (var n = 0; n < FastDesktop.iconArray.length; n++) {
        PageFlipper.addDot(sym);
    }
    
    PageFlipper.center();
    PageFlipper.dotArray[0].highlight();
    
}

PageFlipper.addDot = function (sym) {
    PageFlipper.dotArray.push(new PageDot(sym));
    PageFlipper.center();
}

PageFlipper.removeDot = function (sym) {
    PageFlipper.dotArray.pop().dot.deleteSymbol();
    PageFlipper.center();
}

PageFlipper.highlight = function (dotID) {
    if (PageFlipper.dotArray[PageFlipper.currentDot]) {
        PageFlipper.dotArray[PageFlipper.currentDot].normalize();
    }
    PageFlipper.currentDot = dotID;
    PageFlipper.dotArray[PageFlipper.currentDot].highlight();
}

PageFlipper.pulse = function (dotID) {
    PageFlipper.dotArray[dotID].dot.play();
}

PageFlipper.getPosition = function () {
    return 320 - PageFlipper.DOT_DISTANCE * (PageFlipper.dotArray.length - 1) * .5;
}

PageFlipper.center = function () {
    TweenLite.to(PageFlipper.dotContainer, FastDesktop.ICON_MOVE_TIME, {left:PageFlipper.getPosition(), ease:Power2.easeOut});
}




// Dot Methods

function PageDot (sym) {
    this.dot = PageFlipper.sym.createChildSymbol('PageDot', PageFlipper.dotContainer);
    this.dot.getSymbolElement().css('left', PageFlipper.DOT_DISTANCE * PageFlipper.dotArray.length);
    this.normalize();
}

PageDot.prototype.normalize = function () {
    this.dot.getSymbolElement().css('opacity', PageFlipper.DOT_DEFAULT_ALPHA);
}

PageDot.prototype.highlight = function () {
    this.dot.getSymbolElement().css('opacity', PageFlipper.DOT_HIGHLIGHT_ALPHA);
}
