
(function ($) {
  "use strict";

  
  /*==================================================================
  [ Validate ]*/
  var name = $('.validate-input input[name="name"]');
  var email = $('.validate-input input[name="email"]');
  var subject = $('.validate-input input[name="subject"]');
  var message = $('.validate-input textarea[name="message"]');


  $('.validate-form').on('submit',function(){
      var check = true;

      if($(name).val().trim() == ''){
          showValidate(name);
          check=false;
      }

      if($(subject).val().trim() == ''){
          showValidate(subject);
          check=false;
      }


      if($(email).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
          showValidate(email);
          check=false;
      }

      if($(message).val().trim() == ''){
          showValidate(message);
          check=false;
      }

      return check;
  });


  $('.validate-form .input1').each(function(){
      $(this).focus(function(){
         hideValidate(this);
     });
  });

  function showValidate(input) {
      var thisAlert = $(input).parent();

      $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
      var thisAlert = $(input).parent();

      $(thisAlert).removeClass('alert-validate');
  }
  
  

})(jQuery);







window.addEventListener('scroll', function() {
  var navbar = document.getElementById('navbar');
  var navHeight = navbar.offsetHeight; // Height of the navigation bar
  var scrollPosition = window.scrollY; // Current scroll position

  if (scrollPosition > (navHeight + 100)) {
    navbar.classList.add('fixed-nav'); // Add the 'fixed-nav' class
  } else {
    navbar.classList.remove('fixed-nav'); // Remove the 'fixed-nav' class
  }
});




























document.addEventListener('DOMContentLoaded',function(){
  
})


/**
 * allTilt.js
 * Author: Bastian Fießinger
 * Version: 1.0.0
 */

'use strict';
HTMLElement.prototype.allTilt = function(settings) {
  
  if ( typeof(settings) == 'undefined' ) {
    settings = {};
  }
  
  /**
   * @param {number} settings.max - Maximum rotation of tilt object in degrees. Default: 20
   * @param {boolean} settings.inverted - Invert the effect. Default: false
   * @param {number|string} settings.perspective - use 'auto' or a numeric value. Default: 'auto'
   * @param {number} settings.transitionDuration - Duration of transitioneffects on while entering or leaving the tilt box. Default 400
   * @param {string} settings.easing - Easing Function. Default: cubic-bezier(.03,.98,.52,.99)
   * @param {number} settings.scale - Scale the element while hovering. Default: 1
   * @param {boolean} settings.ambientLightning - Add a lightning to the element. Default: true
   * @param {number} settings.maxLightning - maximum opacity of the ambient lightning. Default: 0.5
   * @param {string} settings.axis - might be 'both', 'x' or 'y'. Default: 'both'
   * @param {boolean} settings.content3D.enabled - Automatically add a 3D Effect to inner contents. Default: true
   * @param {string|array} settings.content3D.position - 'auto' will set the inner Element directly centered. Also strings like '50 40' or '50% 40%' as well as 'center left' are allowed. Default 'auto'
   * @param {string|number} settings.content3D.intensity - 'auto' is used to determine the translateZ by making it half the elements larger side. You can use a number instead. Default 'auto'
   */
  const tiltSetup = (settings) => {
    let defaults = {
      max: 20,
      inverted: false,
      perspective: 'auto',
      transitionDuration: 400,
      easing: 'cubic-bezier(.03,.98,.52,.99)',
      scale: 1,
      ambientLightning: true,
      maxLightning: 0.5,
      axis: 'both',
      content3D: {
        enabled: true,
        position: 'auto',
        intensity: 'auto'
      },
    };
    
    // Rebuild Settings
    let settingsObj = {};
    /**
     * @param {string} prop - The actual Property to set.
     * @param {string} innerprop - The Property if it's nested
     * @param {string} aliasProp - The data-name of the Property
     */
    let setOptions = (prop, innerProp, aliasProp) => {
      
      // Setup a new Object if there are nested Properties
      if ( innerProp != null && settingsObj[prop] == null ) {
        settingsObj[prop] = {};
      }
      
      // First Check for Data Attributes on an element
      if ( this.hasAttribute('data-tilt-' + aliasProp) ) {

        let attr = this.getAttribute('data-tilt-' + aliasProp);
        try {
          if ( innerProp == null ) {
            settingsObj[prop] = JSON.parse(attr);
          } else {
            settingsObj[prop][innerProp] = JSON.parse(attr);
          }
        } catch(e) {
          if ( innerProp == null ) {
            settingsObj[prop] = attr;
          } else {
            settingsObj[prop][innerProp] = attr;
          }
        }
        
      // Now Check the original Settings Object
      } else if ( prop in settings ) {
        
        if ( innerProp == null ) {
          settingsObj[prop] = settings[prop];
        } else {
          settingsObj[prop][innerProp] = settings[prop][innerProp];
        }
        
      // At least check for the setting in the Defaults Object
      } else {
        if ( innerProp == null ) {
          settingsObj[prop] = defaults[prop];
        } else {
          settingsObj[prop][innerProp] = defaults[prop][innerProp];
        }
      }
    }
    
    // Finally rebuild the settings Object
    Object.keys(defaults).map(prop => {
      
      if( typeof(defaults[prop]) == 'object' ) {
        Object.keys(defaults[prop]).map(nestedProp => {
          setOptions(prop, nestedProp, prop + '-' + nestedProp);
        });
      } else {
        setOptions(prop, null, prop);
      }
      
    });
    
    return settingsObj;
  }
  
  settings = tiltSetup(settings);

  // Autogenerate Perspective value from base element
  if ( settings.perspective == 'auto' ) {
    settings.perspective = Math.max( this.getBoundingClientRect().width, this.getBoundingClientRect().height ) * 2;
  }
  
  // Set initial Transform String
  const initTransforms = 'perspective(' + settings.perspective + 'px) rotateX(0) rotateY(0)';
  
  // Prepare all Values for usage
  const prepareValues = function(e) {
    
    const elemViewBox = this.getBoundingClientRect(),
          cursorX = e.clientX,
          cursorY = e.clientY,
          elemX = cursorX - elemViewBox.x,
          elemY = cursorY - elemViewBox.y,
          elemW = elemViewBox.width,
          elemH = elemViewBox.height;

    let percX = (Math.round(-elemX/elemW * 100) + 50) * 2,
        percY = (Math.round(-elemY/elemH * 100) + 50) * 2;
    
    // Invert Percentage
    if ( settings.inverted ) {
      percX *= -1;
      percY *= -1;
    }
    
    let ambientAngle = Math.atan2(elemY, elemX)*(360/Math.PI);
    
    const val = {
      clientX: cursorX,
      clientY: cursorY,
      elemX: elemX,
      elemY: elemY,
      elemH: elemH,
      elemW: elemW,
      ambientAngle: ambientAngle,
      ambientOpacity: Math.min(Math.max((percY * settings.maxLightning ) / 100, 0), settings.maxLightning ),
      degX: Math.min(Math.max(percY * ( settings.max / 100 ), settings.max * -1), settings.max),
      degY: Math.min(Math.max(percX * ( settings.max / 100 ), settings.max * -1), settings.max),
    };   
    
    return val;
  };
  
  const initTiltContainer = function(el, firstInstance) {

    const elStyle = el.style;
    elStyle.position = 'relative';
    elStyle.transform = initTransforms;
    elStyle.willChange = 'transform';
    
    const elInitViewBox = el.getBoundingClientRect();
    
    if ( settings.content3D.enabled ) {
      
      el.style.transformStyle = 'preserve-3D';
      
      const content3DSettings = settings.content3D;
      
      const tiltInnerElementBox = el.querySelector('.alltilt-inner-viewbox') || document.createElement('div');
      tiltInnerElementBox.className = 'alltilt-inner-viewbox';
      const tiltInnerElement = tiltInnerElementBox.querySelector('.alltilt-inner') || document.createElement('div');
      tiltInnerElement.className = 'alltilt-inner';
      
      if ( content3DSettings.intensity == 'auto' ) {
        content3DSettings.intensity = Math.min( elInitViewBox.width, elInitViewBox.height ) / 2;
      }
      
      let innerTransformStr = 'translateZ(' + content3DSettings.intensity + 'px)';
      
      let inner3DPos = {
        0: null, // Top Value
        1: null  // Left Value
      };
     
      if ( Array.isArray( content3DSettings.position ) ) {
        inner3DPos[0] = content3DSettings.position[0];
        inner3DPos[1] = content3DSettings.position[1];
      } else if ( content3DSettings.position == 'auto' ) {
        inner3DPos[0] = 50;
        inner3DPos[1] = 50;
      } else {
        const inner3DPosParts = content3DSettings.position.split(' ');
        inner3DPosParts.forEach(function(pos, i) {
          const trailingChar = pos.slice(-1);
          if ( !isNaN(pos) ) {
           inner3DPos[i] = parseInt(pos); 
          } else if (trailingChar == '%') { // check last character is string
            pos = pos.slice(0, -1); // trim last character
            inner3DPos[i] = parseInt(pos);
          } else if ( pos == 'top' || pos == 'left' ) {
            inner3DPos[i] = 0;
          } else if ( pos == 'center' ) {
            inner3DPos[i] = 50;
          } else if ( pos == 'bottom' || pos == 'right' ) {
            inner3DPos[i] = 100;
          }
        });
      }
      
      if ( ( inner3DPos[0] == null || inner3DPos[1] == null ) || ( isNaN(inner3DPos[0]) || isNaN(inner3DPos[1]) ) ) {
        console.warn('The value "' + content3DSettings.position + '" is not allowed for position! You can use integers, "X%", or keywords like "center", "top" or "right" instead. Usage: "valTop valLeft".' );
        inner3DPos[0] = 50;
        inner3DPos[1] = 50;
      }
      
      innerTransformStr += ' translateY(-50%) translateX(-50%)';
      
      const tiltInnerBoxElStyle = tiltInnerElementBox.style;
      tiltInnerBoxElStyle.position = 'relative';
      tiltInnerBoxElStyle.width = elInitViewBox.width + 'px';
      tiltInnerBoxElStyle.height = elInitViewBox.height + 'px';

      // Remove box padding as the element gets absolute positioned
      el.style.padding = 0;

      const tiltInnerElStyle = tiltInnerElement.style;
      tiltInnerElStyle.position = 'absolute';
      tiltInnerElStyle.top = inner3DPos[0] + '%';
      tiltInnerElStyle.left = inner3DPos[1] + '%';      
      tiltInnerElStyle.webkitTransform = innerTransformStr;
      tiltInnerElStyle.MozTransform = innerTransformStr;
      tiltInnerElStyle.msTransform = innerTransformStr;
      tiltInnerElStyle.OTransform = innerTransformStr;
      tiltInnerElStyle.transform = innerTransformStr;
      const elInitChildren = Array.from( el.children );
      
      if ( firstInstance ) {
        el.appendChild(tiltInnerElementBox);
        tiltInnerElementBox.appendChild(tiltInnerElement);
        elInitChildren.forEach(function(node, i) {
          tiltInnerElement.appendChild(node);
        });
      }
      
    }
    
    if ( settings.ambientLightning ) {
      
      const ambientLightningContainer = el.querySelector('.alltilt-ambient-lightning-container') || document.createElement('div');
      ambientLightningContainer.className = 'alltilt-ambient-lightning-container';
      
      const ambientLightningCStyle = ambientLightningContainer.style;
      ambientLightningCStyle.width = elInitViewBox.width + 'px';
      ambientLightningCStyle.height = elInitViewBox.height + 'px';
      ambientLightningCStyle.position = 'absolute';
      ambientLightningCStyle.left = 0;
      ambientLightningCStyle.top = 0;
      ambientLightningCStyle.overflow = 'hidden';
      ambientLightningCStyle.pointerevents = 'none';
      
      el.appendChild(ambientLightningContainer);
      
      const ambientLightning = ambientLightningContainer.querySelector('.alltilt-ambient-lightning') || document.createElement('div');
      ambientLightning.className = 'alltilt-ambient-lightning';
      const ambientLightningTransformStr = 'rotate(180deg) translate(-50%, -50%)';
      const ambientLightningStyle = ambientLightning.style;
      ambientLightningStyle.background = 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)';
      ambientLightningStyle.position = 'absolute';
      ambientLightningStyle.top = '50%';
      ambientLightningStyle.left = '50%';
      ambientLightningStyle.webkitTransform = ambientLightningTransformStr;
      ambientLightningStyle.MozTransform = ambientLightningTransformStr;
      ambientLightningStyle.msTransform = ambientLightningTransformStr;
      ambientLightningStyle.OTransform = ambientLightningTransformStr;
      ambientLightningStyle.transform = ambientLightningTransformStr;
      ambientLightningStyle.transformOrigin = '50% 50%';
      ambientLightningStyle.opacity = 0;

      ambientLightningContainer.appendChild(ambientLightning);
      
    }
    
  };
  
  const tiltMove = function() {
    this.values = prepareValues.call(this, event);
    updTransform(this, this.values);
  };
  
  const updTransform = function(el, val) {
    
    let transformStr = 'perspective(' + settings.perspective + 'px)';
    
    if ( settings.axis == 'x' ) {
      transformStr += ' rotateY(' + val.degY + 'deg)';
    } else if ( settings.axis == 'y' ) {
      transformStr += 'rotateX(' + val.degX + 'deg)';
    } else {
      transformStr += 'rotateX(' + val.degX + 'deg) rotateY(' + val.degY + 'deg)';
    }
    
    if ( settings.scale && !isNaN(settings.scale) ) {
      transformStr += ' scale3d(' + settings.scale + ',' + settings.scale + ',1)';
    } else {
      transformStr += ' scale3d(1,1,1)';
    }
    
    el.style.webkitTransform = transformStr;
    el.style.MozTransform = transformStr;
    el.style.msTransform = transformStr;
    el.style.OTransform = transformStr;
    el.style.transform = transformStr;
    
    if ( settings.ambientLightning ) {
      const elAmbientLightning = el.querySelector('.alltilt-ambient-lightning');
      const lightningDimensions = Math.max( val.elemH, val.elemW );
      const lightningStyle = elAmbientLightning.style;
      const lightningTransformStr = 'translate(-50%, -50%) rotate(' + val.ambientAngle + 'deg)';
      lightningStyle.width = lightningDimensions * 2 + 'px';
      lightningStyle.height = lightningDimensions * 2 + 'px';
      lightningStyle.webkitTransform = transformStr;
      lightningStyle.MozTransform = transformStr;
      lightningStyle.msTransform = transformStr;
      lightningStyle.OTransform = transformStr;
      lightningStyle.transform = lightningTransformStr;
      lightningStyle.opacity = val.ambientOpacity;
    }
    
  };
  
  const tiltEnter = function() {
    const _this = this;
    
    if ( settings.ambientLightning ) {
      const _elAmbientLightning = _this.querySelector('.alltilt-ambient-lightning');
      _elAmbientLightning.style.transition = 'opacity ' + settings.transitionDuration + 'ms ' + settings.easing;
    }
    
    _this.style.transition = 'transform ' + settings.transitionDuration + 'ms ' + settings.easing;
    setTimeout( function() {
      _this.style.removeProperty('transition');
      if ( settings.ambientLightning ) {
        _this.querySelector('.alltilt-ambient-lightning').style.removeProperty('transition');
      }
    }, settings.transitionDuration);

  }
  
  const resetTransforms = function() {
    const elStyle = this.style;
    elStyle.transition = 'transform ' + settings.transitionDuration + 'ms ease-in-out';
    elStyle.webkitTransform = initTransforms;
    elStyle.MozTransform = initTransforms;
    elStyle.msTransform = initTransforms;
    elStyle.OTransform = initTransforms;
    elStyle.transform = initTransforms;
    if ( settings.ambientLightning ) {
      this.querySelector('.alltilt-ambient-lightning').style.transition = 'opacity ' + settings.transitionDuration + 'ms ease-in-out';
      this.querySelector('.alltilt-ambient-lightning').style.opacity = 0;
    }
  };
  
  // Emulate Pointer Events on mobile Devices
  function touchHandler(event) {
    var touches = event.changedTouches,
        first = touches[0],
        type;
    
    switch(event.type) {
      case 'touchstart':
        type = 'mouseenter'; 
        break;
      case 'touchmove': 
        type = 'mousemove';
        break;
      case 'touchcancel':
      case 'touchend':
        type = 'mouseleave';
        break;
      default:
        return;
    }

    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                  first.screenX, first.screenY, 
                                  first.clientX, first.clientY, false, 
                                  false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
  }
  
  const BindEvents = function(e) {
    const _this = this;
    initTiltContainer(_this, true);
    window.addEventListener('resize', function(e) {
      initTiltContainer(_this, false); 
    });
    _this.addEventListener('mouseenter', tiltEnter);
    _this.addEventListener('mousemove', tiltMove);
    _this.addEventListener('mouseleave', resetTransforms);
    // Enable Touch
    _this.addEventListener("touchstart", touchHandler, true);
    _this.addEventListener("touchmove", touchHandler, true);
    _this.addEventListener("touchend", touchHandler, true);
    _this.addEventListener("touchcancel", touchHandler, true);   
  };
  
  this.init = () => {
    // Bind events
    BindEvents.call(this);
  };
  
  this.init();
  
}

document.addEventListener('DOMContentLoaded', function() {
  var tiltedElements = document.querySelectorAll('.tilt');
  
  tiltedElements.forEach((element) => {
    element.allTilt();
  });
  
  hljs.initHighlightingOnLoad();
});



























(function(t,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof module&&module.exports?module.exports=e():t.anime=e()})(this,function(){var t,e,n,r={duration:1e3,delay:0,loop:!1,autoplay:!0,direction:"normal",easing:"easeOutElastic",elasticity:400,round:!1,begin:void 0,update:void 0,complete:void 0},i="translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY".split(" "),o={arr:function(t){return Array.isArray(t)},obj:function(t){return-1<Object.prototype.toString.call(t).indexOf("Object")},svg:function(t){return t instanceof SVGElement},dom:function(t){return t.nodeType||o.svg(t)},num:function(t){return!isNaN(parseInt(t))},str:function(t){return"string"==typeof t},fnc:function(t){return"function"==typeof t},und:function(t){return void 0===t},nul:function(t){return"null"==typeof t},hex:function(t){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t)},rgb:function(t){return/^rgb/.test(t)},hsl:function(t){return/^hsl/.test(t)},col:function(t){return o.hex(t)||o.rgb(t)||o.hsl(t)}},a=(e={},n={Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t,e){if(0===t||1===t)return t;var n=1-Math.min(e,998)/1e3,r=t/1-1;return-Math.pow(2,10*r)*Math.sin(2*(r-n/(2*Math.PI)*Math.asin(1))*Math.PI/n)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,n=4;t<((e=Math.pow(2,--n))-1)/11;);return 1/Math.pow(4,3-n)-7.5625*Math.pow((3*e-2)/22-t,2)}},["Quad","Cubic","Quart","Quint","Expo"].forEach(function(t,e){n[t]=function(t){return Math.pow(t,e+2)}}),Object.keys(n).forEach(function(t){var r=n[t];e["easeIn"+t]=r,e["easeOut"+t]=function(t,e){return 1-r(1-t,e)},e["easeInOut"+t]=function(t,e){return.5>t?r(2*t,e)/2:1-r(-2*t+2,e)/2},e["easeOutIn"+t]=function(t,e){return.5>t?(1-r(1-2*t,e))/2:(r(2*t-1,e)+1)/2}}),e.linear=function(t){return t},e),s=function(t){return o.str(t)?t:t+""},u=function(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()},c=function(t){if(o.col(t))return!1;try{return document.querySelectorAll(t)}catch(t){return!1}},l=function(t){return t.reduce(function(t,e){return t.concat(o.arr(e)?l(e):e)},[])},f=function(t){return o.arr(t)?t:(o.str(t)&&(t=c(t)||t),t instanceof NodeList||t instanceof HTMLCollection?[].slice.call(t):[t])},m=function(t,e){return t.some(function(t){return t===e})},h=function(t,e){var n={};return t.forEach(function(t){var r=JSON.stringify(e.map(function(e){return t[e]}));n[r]=n[r]||[],n[r].push(t)}),Object.keys(n).map(function(t){return n[t]})},d=function(t){return t.filter(function(t,e,n){return n.indexOf(t)===e})},p=function(t){var e,n={};for(e in t)n[e]=t[e];return n},v=function(t,e){for(var n in e)t[n]=o.und(t[n])?e[n]:t[n];return t},g=function(t){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(t,e,n,r){return e+e+n+n+r+r});var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);t=parseInt(e[1],16);var n=parseInt(e[2],16);e=parseInt(e[3],16);return"rgb("+t+","+n+","+e+")"},y=function(t){t=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t);var e=parseInt(t[1])/360,n=parseInt(t[2])/100,r=parseInt(t[3])/100;if(t=function(t,e,n){return 0>n&&(n+=1),1<n&&--n,n<1/6?t+6*(e-t)*n:.5>n?e:n<2/3?t+(e-t)*(2/3-n)*6:t},0==n)n=r=e=r;else{var i=.5>r?r*(1+n):r+n-r*n,o=2*r-i;n=t(o,i,e+1/3),r=t(o,i,e),e=t(o,i,e-1/3)}return"rgb("+255*n+","+255*r+","+255*e+")"},b=function(t){return/([\+\-]?[0-9|auto\.]+)(%|px|pt|em|rem|in|cm|mm|ex|pc|vw|vh|deg)?/.exec(t)[2]},x=function(t,e,n){return b(e)?e:-1<t.indexOf("translate")?b(n)?e+b(n):e+"px":-1<t.indexOf("rotate")||-1<t.indexOf("skew")?e+"deg":e},E=function(t,e){if(e in t.style)return getComputedStyle(t).getPropertyValue(u(e))||"0"},O=function(t,e){var n=-1<e.indexOf("scale")?1:0,r=t.style.transform;if(!r)return n;for(var i=/(\w+)\((.+?)\)/g,o=[],a=[],s=[];o=i.exec(r);)a.push(o[1]),s.push(o[2]);return r=s.filter(function(t,n){return a[n]===e}),r.length?r[0]:n},M=function(t,e){return o.dom(t)&&m(i,e)?"transform":o.dom(t)&&(t.getAttribute(e)||o.svg(t)&&t[e])?"attribute":o.dom(t)&&"transform"!==e&&E(t,e)?"css":o.nul(t[e])||o.und(t[e])?void 0:"object"},w=function(t,e){switch(M(t,e)){case"transform":return O(t,e);case"css":return E(t,e);case"attribute":return t.getAttribute(e)}return t[e]||0},I=function(t,e,n){return o.col(e)?(e=o.rgb(e)?e:o.hex(e)?g(e):o.hsl(e)?y(e):void 0,e):b(e)?e:(t=b(t.to)?b(t.to):b(t.from),!t&&n&&(t=b(n)),t?e+t:e)},k=function(t){var e=/-?\d*\.?\d+/g;return{original:t,numbers:s(t).match(e)?s(t).match(e).map(Number):[0],strings:s(t).split(e)}},D=function(t,e,n){return e.reduce(function(e,r,i){return r=r||n[i-1],e+t[i-1]+r})},A=function(t){return t=t?l(o.arr(t)?t.map(f):f(t)):[],t.map(function(t,e){return{target:t,id:e}})},L=function(t,e,n,r){return"transform"===n?(n=t+"("+x(t,e.from,e.to)+")",e=t+"("+x(t,e.to)+")"):(t="css"===n?E(r,t):void 0,n=I(e,e.from,t),e=I(e,e.to,t)),{from:k(n),to:k(e)}},j=function(t,e){var n=[];return t.forEach(function(r,i){var a=r.target;return e.forEach(function(e){var s=M(a,e.name);if(s){var u;u=e.name;var c=e.value;c=f(o.fnc(c)?c(a,i):c);u={from:1<c.length?c[0]:w(a,u),to:1<c.length?c[1]:c[0]},c=p(e),c.animatables=r,c.type=s,c.from=L(e.name,u,c.type,a).from,c.to=L(e.name,u,c.type,a).to,c.round=o.col(u.from)||c.round?1:0,c.delay=(o.fnc(c.delay)?c.delay(a,i,t.length):c.delay)/Q.speed,c.duration=(o.fnc(c.duration)?c.duration(a,i,t.length):c.duration)/Q.speed,n.push(c)}})}),n},_=function(t,e){var n=j(t,e);return h(n,["name","from","to","delay","duration"]).map(function(t){var e=p(t[0]);return e.animatables=t.map(function(t){return t.animatables}),e.totalDuration=e.delay+e.duration,e})},q=function(t,e){t.tweens.forEach(function(n){var r=n.from,i=t.duration-(n.delay+n.duration);n.from=n.to,n.to=r,e&&(n.delay=i)}),t.reversed=!t.reversed},z=function(t){if(t.length)return Math.max.apply(Math,t.map(function(t){return t.totalDuration}))},C=function(t){var e=[],n=[];return t.tweens.forEach(function(t){"css"!==t.type&&"transform"!==t.type||(e.push("css"===t.type?u(t.name):"transform"),t.animatables.forEach(function(t){n.push(t.target)}))}),{properties:d(e).join(", "),elements:d(n)}},S=function(t){var e=C(t);e.elements.forEach(function(t){t.style.willChange=e.properties})},T=function(t){C(t).elements.forEach(function(t){t.style.removeProperty("will-change")})},X=function(t,e){var n=t.path,r=t.value*e,i=function(i){return i=i||0,n.getPointAtLength(1<e?t.value+i:r+i)},o=i(),a=i(-1);i=i(1);switch(t.name){case"translateX":return o.x;case"translateY":return o.y;case"rotate":return 180*Math.atan2(i.y-a.y,i.x-a.x)/Math.PI}},Y=function(t,e){var n=Math.min(Math.max(e-t.delay,0),t.duration)/t.duration,r=t.to.numbers.map(function(e,r){var i=t.from.numbers[r],o=a[t.easing](n,t.elasticity);i=t.path?X(t,o):i+o*(e-i);return t.round?Math.round(i*t.round)/t.round:i});return D(r,t.to.strings,t.from.strings)},B=function(e,n){var r;e.currentTime=n,e.progress=n/e.duration*100;for(var i=0;i<e.tweens.length;i++){var o=e.tweens[i];o.currentValue=Y(o,n);for(var a=o.currentValue,s=0;s<o.animatables.length;s++){var u=o.animatables[s],c=u.id,l=(u=u.target,o.name);switch(o.type){case"css":u.style[l]=a;break;case"attribute":u.setAttribute(l,a);break;case"object":u[l]=a;break;case"transform":r||(r={}),r[c]||(r[c]=[]),r[c].push(a)}}}if(r)for(i in t||(t=(E(document.body,"transform")?"":"-webkit-")+"transform"),r)e.animatables[i].target.style[t]=r[i].join(" ");e.settings.update&&e.settings.update(e)},F=function(t){var e={};e.animatables=A(t.targets),e.settings=v(t,r);var n,i=e.settings,a=[];for(n in t)if(!r.hasOwnProperty(n)&&"targets"!==n){var s=o.obj(t[n])?p(t[n]):{value:t[n]};s.name=n,a.push(v(s,i))}return e.properties=a,e.tweens=_(e.animatables,e.properties),e.duration=z(e.tweens)||t.duration,e.currentTime=0,e.progress=0,e.ended=!1,e},P=[],Z=0,W=function(){var t=function(){Z=requestAnimationFrame(e)},e=function(e){if(P.length){for(var n=0;n<P.length;n++)P[n].tick(e);t()}else cancelAnimationFrame(Z),Z=0};return t}(),Q=function(t){var e=F(t),n={};return e.tick=function(t){e.ended=!1,n.start||(n.start=t),n.current=Math.min(Math.max(n.last+t-n.start,0),e.duration),B(e,n.current);var r=e.settings;r.begin&&n.current>=r.delay&&(r.begin(e),r.begin=void 0),n.current>=e.duration&&(r.loop?(n.start=t,"alternate"===r.direction&&q(e,!0),o.num(r.loop)&&r.loop--):(e.ended=!0,e.pause(),r.complete&&r.complete(e)),n.last=0)},e.seek=function(t){B(e,t/100*e.duration)},e.pause=function(){T(e);var t=P.indexOf(e);-1<t&&P.splice(t,1)},e.play=function(t){e.pause(),t&&(e=v(F(v(t,e.settings)),e)),n.start=0,n.last=e.ended?0:e.currentTime,t=e.settings,"reverse"===t.direction&&q(e),"alternate"!==t.direction||t.loop||(t.loop=1),S(e),P.push(e),Z||W()},e.restart=function(){e.reversed&&q(e),e.pause(),e.seek(0),e.play()},e.settings.autoplay&&e.play(),e};return Q.version="1.1.1",Q.speed=1,Q.list=P,Q.remove=function(t){t=l(o.arr(t)?t.map(f):f(t));for(var e=P.length-1;0<=e;e--)for(var n=P[e],r=n.tweens,i=r.length-1;0<=i;i--)for(var a=r[i].animatables,s=a.length-1;0<=s;s--)m(t,a[s].target)&&(a.splice(s,1),a.length||r.splice(i,1),r.length||n.pause())},Q.easings=a,Q.getValue=w,Q.path=function(t){return t=o.str(t)?c(t)[0]:t,{path:t,value:t.getTotalLength()}},Q.random=function(t,e){return Math.floor(Math.random()*(e-t+1))+t},Q}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var n=this._events=this._events||{},r=n[t]=n[t]||[];return-1==r.indexOf(e)&&r.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var n=this._onceEvents=this._onceEvents||{},r=n[t]=n[t]||{};return r[e]=!0,this}},e.off=function(t,e){var n=this._events&&this._events[t];if(n&&n.length){var r=n.indexOf(e);return-1!=r&&n.splice(r,1),this}},e.emitEvent=function(t,e){var n=this._events&&this._events[t];if(n&&n.length){var r=0,i=n[r];e=e||[];for(var o=this._onceEvents&&this._onceEvents[t];i;){var a=o&&o[i];a&&(this.off(t,i),delete o[i]),i.apply(this,e),r+=a?0:1,i=n[r]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(n){return e(t,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}(window,function(t,e){function n(t,e){for(var n in e)t[n]=e[n];return t}function r(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var n=0;n<t.length;n++)e.push(t[n]);else e.push(t);return e}function i(t,e,o){return this instanceof i?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=r(t),this.options=n({},this.options),"function"==typeof e?o=e:n(this.options,e),o&&this.on("always",o),this.getImages(),s&&(this.jqDeferred=new s.Deferred),void setTimeout(function(){this.check()}.bind(this))):new i(t,e,o)}function o(t){this.img=t}function a(t,e){this.url=t,this.element=e,this.img=new Image}var s=t.jQuery,u=t.console;i.prototype=Object.create(e.prototype),i.prototype.options={},i.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},i.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),!0===this.options.background&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&c[e]){for(var n=t.querySelectorAll("img"),r=0;r<n.length;r++){var i=n[r];this.addImage(i)}if("string"==typeof this.options.background){var o=t.querySelectorAll(this.options.background);for(r=0;r<o.length;r++){var a=o[r];this.addElementBackgroundImages(a)}}}};var c={1:!0,9:!0,11:!0};return i.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var n=/url\((['"])?(.*?)\1\)/gi,r=n.exec(e.backgroundImage);null!==r;){var i=r&&r[2];i&&this.addBackground(i,t),r=n.exec(e.backgroundImage)}},i.prototype.addImage=function(t){var e=new o(t);this.images.push(e)},i.prototype.addBackground=function(t,e){var n=new a(t,e);this.images.push(n)},i.prototype.check=function(){function t(t,n,r){setTimeout(function(){e.progress(t,n,r)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},i.prototype.progress=function(t,e,n){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&u&&u.log("progress: "+n,t,e)},i.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},o.prototype=Object.create(e.prototype),o.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},o.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},o.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},o.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},o.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},o.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},o.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},a.prototype=Object.create(o.prototype),a.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},a.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},a.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},i.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(s=e,s.fn.imagesLoaded=function(t,e){var n=new i(this,t,e);return n.jqDeferred.promise(s(this))})},i.makeJQueryPlugin(),i}),function(t){"use strict";function e(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function n(e){var n=0,r=0;if(!e)e=t.event;return e.pageX||e.pageY?(n=e.pageX,r=e.pageY):(e.clientX||e.clientY)&&(n=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,r=e.clientY+document.body.scrollTop+document.documentElement.scrollTop),{x:n,y:r}}function r(t,n){this.DOM={},this.DOM.el=t,this.options=e({},this.options),e(this.options,n),this._init()}r.prototype.options={movement:{imgWrapper:{translation:{x:0,y:0,z:0},rotation:{x:-5,y:5,z:0},reverseAnimation:{duration:1200,easing:"easeOutElastic",elasticity:600}},lines:{translation:{x:10,y:10,z:[0,10]},reverseAnimation:{duration:1e3,easing:"easeOutExpo",elasticity:600}},caption:{translation:{x:20,y:20,z:0},rotation:{x:0,y:0,z:0},reverseAnimation:{duration:1500,easing:"easeOutElastic",elasticity:600}},shine:{translation:{x:50,y:50,z:0},reverseAnimation:{duration:1200,easing:"easeOutElastic",elasticity:600}}}},r.prototype._init=function(){this.DOM.animatable={},this.DOM.animatable.imgWrapper=this.DOM.el.querySelector(".tilter__figure"),this.DOM.animatable.lines=this.DOM.el.querySelector(".tilter__deco--lines"),this.DOM.animatable.caption=this.DOM.el.querySelector(".tilter__caption"),this.DOM.animatable.overlay=this.DOM.el.querySelector(".tilter__deco--overlay"),this.DOM.animatable.shine=this.DOM.el.querySelector(".tilter__deco--shine > div"),this._initEvents()},r.prototype._initEvents=function(){var t=this;this.mouseenterFn=function(){for(var e in t.DOM.animatable)anime.remove(t.DOM.animatable[e])},this.mousemoveFn=function(e){requestAnimationFrame(function(){t._layout(e)})},this.mouseleaveFn=function(e){requestAnimationFrame(function(){for(var e in t.DOM.animatable)null!=t.options.movement[e]&&anime({targets:t.DOM.animatable[e],duration:null!=t.options.movement[e].reverseAnimation?t.options.movement[e].reverseAnimation.duration||0:1,easing:null!=t.options.movement[e].reverseAnimation&&t.options.movement[e].reverseAnimation.easing||"linear",elasticity:null!=t.options.movement[e].reverseAnimation&&t.options.movement[e].reverseAnimation.elasticity||null,scaleX:1,scaleY:1,scaleZ:1,translateX:0,translateY:0,translateZ:0,rotateX:0,rotateY:0,rotateZ:0})})},this.DOM.el.addEventListener("mousemove",this.mousemoveFn),this.DOM.el.addEventListener("mouseleave",this.mouseleaveFn),this.DOM.el.addEventListener("mouseenter",this.mouseenterFn)},r.prototype._layout=function(t){var e=n(t),r={left:document.body.scrollLeft+document.documentElement.scrollLeft,top:document.body.scrollTop+document.documentElement.scrollTop},i=this.DOM.el.getBoundingClientRect(),o={x:e.x-i.left-r.left,y:e.y-i.top-r.top};for(var a in this.DOM.animatable)if(null!=this.DOM.animatable[a]&&null!=this.options.movement[a]){var s=null!=this.options.movement[a]&&this.options.movement[a].translation||{x:0,y:0,z:0},u=null!=this.options.movement[a]&&this.options.movement[a].rotation||{x:0,y:0,z:0},c=function(t){for(var e in t)null==t[e]?t[e]=[0,0]:"number"==typeof t[e]&&(t[e]=[-1*t[e],t[e]])};c(s),c(u);var l={translation:{x:(s.x[1]-s.x[0])/i.width*o.x+s.x[0],y:(s.y[1]-s.y[0])/i.height*o.y+s.y[0],z:(s.z[1]-s.z[0])/i.height*o.y+s.z[0]},rotation:{x:(u.x[1]-u.x[0])/i.height*o.y+u.x[0],y:(u.y[1]-u.y[0])/i.width*o.x+u.y[0],z:(u.z[1]-u.z[0])/i.width*o.x+u.z[0]}};this.DOM.animatable[a].style.WebkitTransform=this.DOM.animatable[a].style.transform="translateX("+l.translation.x+"px) translateY("+l.translation.y+"px) translateZ("+l.translation.z+"px) rotateX("+l.rotation.x+"deg) rotateY("+l.rotation.y+"deg) rotateZ("+l.rotation.z+"deg)"}},t.TiltFx=r}(window);