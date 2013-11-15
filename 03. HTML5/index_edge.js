/**
 * Adobe Edge: symbol definitions
 */
(function($, Edge, compId){
//images folder
var im='images/';

var fonts = {};


var resources = [
];
var symbols = {
"stage": {
   version: "2.0.0",
   minimumCompatibleVersion: "2.0.0",
   build: "2.0.0.250",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: false,
   resizeInstances: false,
   content: {
         dom: [
         {
            id:'screen',
            type:'rect',
            rect:['0px','0px','640px','1136px','auto','auto']
         },
         {
            id:'pageFlipper',
            type:'rect',
            rect:['320','921px','auto','auto','auto','auto']
         },
         {
            id:'dock_bg',
            type:'rect',
            rect:['0px','944px','640px','192px','auto','auto'],
            opacity:0.5,
            fill:["rgba(192,192,192,1)"],
            stroke:[0,"rgba(0,0,0,1)","none"]
         },
         {
            id:'dockIcon0',
            type:'rect',
            rect:['32px','972px','auto','auto','auto','auto']
         },
         {
            id:'dockIcon1',
            type:'rect',
            rect:['184px','972px','auto','auto','auto','auto']
         },
         {
            id:'dockIcon2',
            type:'rect',
            rect:['336px','972px','auto','auto','auto','auto']
         },
         {
            id:'dockIcon3',
            type:'rect',
            rect:['488px','972px','auto','auto','auto','auto']
         }],
         symbolInstances: [
         {
            id:'dockIcon1',
            symbolName:'FastIcon'
         },
         {
            id:'dockIcon3',
            symbolName:'FastIcon'
         },
         {
            id:'dockIcon2',
            symbolName:'FastIcon'
         },
         {
            id:'dockIcon0',
            symbolName:'FastIcon'
         },
         {
            id:'screen',
            symbolName:'FastDesktop'
         },
         {
            id:'pageFlipper',
            symbolName:'PageFlipper'
         }
         ]
      },
   states: {
      "Base State": {
         "${_dockIcon1}": [
            ["style", "top", '972px'],
            ["style", "left", '184px']
         ],
         "${_dock_bg}": [
            ["style", "top", '944px'],
            ["style", "height", '192px'],
            ["style", "opacity", '0.5'],
            ["style", "left", '0px'],
            ["style", "width", '640px']
         ],
         "${_dockIcon2}": [
            ["style", "top", '972px'],
            ["style", "left", '336px']
         ],
         "${_pageFlipper}": [
            ["style", "left", '0px'],
            ["style", "top", '921px']
         ],
         "${_Stage}": [
            ["color", "background-color", 'rgba(0,0,0,1.00)'],
            ["style", "overflow", 'hidden'],
            ["style", "height", '1136px'],
            ["style", "width", '640px']
         ],
         "${_screen}": [
            ["style", "top", '0px'],
            ["style", "height", '1136px'],
            ["style", "width", '640px']
         ],
         "${_dockIcon0}": [
            ["style", "top", '972px']
         ],
         "${_dockIcon3}": [
            ["style", "top", '972px'],
            ["style", "left", '488px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 0,
         autoPlay: false,
         timeline: [
            { id: "eid110", tween: [ "style", "${_pageFlipper}", "left", '0px', { fromValue: '0px'}], position: 0, duration: 0 }         ]
      }
   }
},
"FastIcon": {
   version: "2.0.0",
   minimumCompatibleVersion: "2.0.0",
   build: "2.0.0.250",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: false,
   resizeInstances: false,
   content: {
   dom: [
   {
      id: 'icon',
      type: 'rect',
      rect: ['0','0','auto','auto','auto','auto'],
      transform: [[0,0],[],[],['1.00833']]
   },
   {
      font: ['Arial, Helvetica, sans-serif',24,'rgba(255,255,255,1.00)','100','none','normal'],
      type: 'text',
      id: 'textLabel',
      text: 'Application',
      align: 'center',
      rect: ['-20px','125px','160px','auto','auto','auto']
   }],
   symbolInstances: [
   {
      id: 'icon',
      symbolName: 'FastIconInner'
   }   ]
   },
   states: {
      "Base State": {
         "${_textLabel}": [
            ["style", "top", '125px'],
            ["style", "text-align", 'center'],
            ["color", "color", 'rgba(255,255,255,1.00)'],
            ["style", "font-weight", '100'],
            ["style", "left", '-20px'],
            ["style", "width", '160px']
         ],
         "${_icon}": [
            ["transform", "scaleX", '1'],
            ["style", "cursor", 'auto'],
            ["style", "left", '0px']
         ],
         "${symbolSelector}": [
            ["style", "height", '153px'],
            ["style", "width", '120px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 0,
         autoPlay: false,
         timeline: [
            { id: "eid35", tween: [ "transform", "${_icon}", "scaleX", '1', { fromValue: '1'}], position: 0, duration: 0 },
            { id: "eid36", tween: [ "style", "${_icon}", "left", '0px', { fromValue: '0px'}], position: 0, duration: 0 }         ]
      }
   }
},
"FastIconInner": {
   version: "2.0.0",
   minimumCompatibleVersion: "2.0.0",
   build: "2.0.0.250",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: false,
   resizeInstances: false,
   content: {
   dom: [
   {
      userClass: 'Icon',
      rect: ['0px','0px','120px','120px','auto','auto'],
      borderRadius: ['20% 20%','20% 20%','20% 20%','20% 20%'],
      type: 'rect',
      id: 'icon',
      stroke: [0,'rgba(0,0,0,1)','none'],
      cursor: ['pointer'],
      fill: ['rgba(192,192,192,1)']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_icon}": [
            ["style", "border-top-left-radius", [25,25], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "border-bottom-right-radius", [25,25], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["transform", "scaleX", '1.00833'],
            ["style", "border-top-right-radius", [25,25], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "width", '120px'],
            ["style", "top", '0px'],
            ["style", "border-bottom-left-radius", [25,25], {valueTemplate:'@@0@@% @@1@@%'} ],
            ["style", "height", '120px'],
            ["style", "cursor", 'pointer'],
            ["style", "left", '0px']
         ],
         "${symbolSelector}": [
            ["style", "height", '120px'],
            ["style", "width", '120px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 0,
         autoPlay: false,
         timeline: [
            { id: "eid49", tween: [ "style", "${_icon}", "border-bottom-right-radius", [25,25], { valueTemplate: '@@0@@% @@1@@%', fromValue: [25,25]}], position: 0, duration: 0 },
            { id: "eid46", tween: [ "style", "${_icon}", "border-bottom-left-radius", [25,25], { valueTemplate: '@@0@@% @@1@@%', fromValue: [25,25]}], position: 0, duration: 0 },
            { id: "eid47", tween: [ "style", "${_icon}", "border-top-left-radius", [25,25], { valueTemplate: '@@0@@% @@1@@%', fromValue: [25,25]}], position: 0, duration: 0 },
            { id: "eid48", tween: [ "style", "${_icon}", "border-top-right-radius", [25,25], { valueTemplate: '@@0@@% @@1@@%', fromValue: [25,25]}], position: 0, duration: 0 }         ]
      }
   }
},
"FastDesktop": {
   version: "2.0.0",
   minimumCompatibleVersion: "2.0.0",
   build: "2.0.0.250",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: false,
   resizeInstances: false,
   content: {
   dom: [
   {
      rect: ['0px','0px','640px','1136px','auto','auto'],
      id: 'bg',
      opacity: 0.5,
      type: 'image',
      fill: ['rgba(0,0,0,0)','images/bg07.jpg','25%','0px','auto','100%']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_bg}": [
            ["style", "top", '0px'],
            ["style", "opacity", '0.5'],
            ["style", "background-size", ['auto',100], {valueTemplate:'@@0@@ @@1@@%'} ],
            ["style", "left", '0px'],
            ["style", "background-position", [25,0], {valueTemplate:'@@0@@% @@1@@px'} ]
         ],
         "${symbolSelector}": [
            ["style", "height", '1136px'],
            ["style", "width", '640px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 0,
         autoPlay: false,
         timeline: [
         ]
      }
   }
},
"PageDot": {
   version: "2.0.0",
   minimumCompatibleVersion: "2.0.0",
   build: "2.0.0.250",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: false,
   resizeInstances: false,
   content: {
   dom: [
   {
      rect: ['-7px','-7px','14px','14px','auto','auto'],
      borderRadius: ['50%','50%','50%','50%'],
      id: 'Ellipse',
      stroke: [0,'rgba(0,0,0,1)','none'],
      type: 'ellipse',
      fill: ['rgba(255,255,255,1.00)']
   }],
   symbolInstances: [
   ]
   },
   states: {
      "Base State": {
         "${_Ellipse}": [
            ["style", "top", '-7px'],
            ["transform", "scaleY", '0'],
            ["transform", "scaleX", '0'],
            ["style", "height", '14px'],
            ["color", "background-color", 'rgba(255,255,255,1.00)'],
            ["style", "left", '-7px'],
            ["style", "width", '14px']
         ],
         "${symbolSelector}": [
            ["style", "height", '14px'],
            ["style", "width", '14px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 750,
         autoPlay: true,
         timeline: [
            { id: "eid117", tween: [ "transform", "${_Ellipse}", "scaleX", '1', { fromValue: '0'}], position: 0, duration: 250, easing: "easeOutBack" },
            { id: "eid121", tween: [ "transform", "${_Ellipse}", "scaleX", '1.5', { fromValue: '1'}], position: 250, duration: 250, easing: "easeOutQuad" },
            { id: "eid123", tween: [ "transform", "${_Ellipse}", "scaleX", '0', { fromValue: '1.5'}], position: 500, duration: 250, easing: "easeInOutQuad" },
            { id: "eid118", tween: [ "transform", "${_Ellipse}", "scaleY", '1', { fromValue: '0'}], position: 0, duration: 250, easing: "easeOutBack" },
            { id: "eid122", tween: [ "transform", "${_Ellipse}", "scaleY", '1.5', { fromValue: '1'}], position: 250, duration: 250, easing: "easeOutQuad" },
            { id: "eid124", tween: [ "transform", "${_Ellipse}", "scaleY", '0', { fromValue: '1.5'}], position: 500, duration: 250, easing: "easeInOutQuad" }         ]
      }
   }
},
"PageFlipper": {
   version: "2.0.0",
   minimumCompatibleVersion: "2.0.0",
   build: "2.0.0.250",
   baseState: "Base State",
   initialState: "Base State",
   gpuAccelerate: false,
   resizeInstances: false,
   content: {
   },
   states: {
      "Base State": {
         "${symbolSelector}": [
            ["style", "height", '20px'],
            ["style", "width", '640px']
         ]
      }
   },
   timelines: {
      "Default Timeline": {
         fromState: "Base State",
         toState: "",
         duration: 0,
         autoPlay: false,
         timeline: [
         ]
      }
   }
}
};


Edge.registerCompositionDefn(compId, symbols, fonts, resources);

/**
 * Adobe Edge DOM Ready Event Handler
 */
$(window).ready(function() {
     Edge.launchComposition(compId);
});
})(jQuery, AdobeEdge, "EDGE-FASTICON");
