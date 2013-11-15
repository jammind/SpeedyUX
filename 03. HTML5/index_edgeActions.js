/***********************
* Adobe Edge Animate Composition Actions
*
* Edit this file with caution, being careful to preserve 
* function signatures and comments starting with 'Edge' to maintain the 
* ability to interact with these actions from within Adobe Edge Animate
*
***********************/
(function($, Edge, compId){
var Composition = Edge.Composition, Symbol = Edge.Symbol; // aliases for commonly used Edge classes

   //Edge symbol: 'stage'
   (function(symbolName) {
      
      
      

      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         //Responsive.fit(sym.getSymbol('screen'), 'fw');

      });
      //Edge binding end

      Symbol.bindElementAction(compId, symbolName, "window", "resize", function(sym, e) {
         Responsive.onResize();

      });
      //Edge binding end

   })("stage");
   //Edge symbol end:'stage'

   //=========================================================
   
   //Edge symbol: 'Icon'
   (function(symbolName) {   
         

      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         var dockArray = [
         	{label:'电话', id:0},
         	{label:'信息', id:1},
         	{label:'日历', id:3},
         	{label:'邮件', id:5}
         ];
         var selector = sym.variableValues.symbolSelector;
         
         if (selector.indexOf('dock') >= 0) {
         	var id = selector.charAt(selector.length-1);
         	var data = dockArray[id];
         	FastIcon.initIconContent(sym, data.id, data.label);
         }

      });
      //Edge binding end

   })("FastIcon");
   //Edge symbol end:'FastIcon'

   //=========================================================
   
   //Edge symbol: 'Icon'
   (function(symbolName) {   
   
   })("FastIconInner");
   //Edge symbol end:'FastIconInner'

   //=========================================================
   
   //Edge symbol: 'FastScreen'
   (function(symbolName) {   
   
      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         new FastDesktop(sym);

      });
      //Edge binding end

   })("FastDesktop");
   //Edge symbol end:'FastDesktop'

   //=========================================================
   
   //Edge symbol: 'PageDot'
   (function(symbolName) {   
   
      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         sym.getSymbolElement().css('position', 'absolute');

      });
      //Edge binding end

      Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 250, function(sym, e) {
         sym.stop();

      });
      //Edge binding end

      Symbol.bindTimelineAction(compId, symbolName, "Default Timeline", "complete", function(sym, e) {
         sym.play();

      });
      //Edge binding end

   })("PageDot");
   //Edge symbol end:'PageDot'

   //=========================================================
   
   //Edge symbol: 'PageFlipper'
   (function(symbolName) {   
   
      Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {
         new PageFlipper(sym);

      });
      //Edge binding end

   })("PageFlipper");
   //Edge symbol end:'PageFlipper'

})(jQuery, AdobeEdge, "EDGE-FASTICON");