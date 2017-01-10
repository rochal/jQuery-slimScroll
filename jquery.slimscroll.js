/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la), Lanre Adebambo
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.7
 *
 */
(function($) {

  $.fn.extend({
    slimScroll: function(options) {

      var defaults = {

        // axis to apply scrollbars x(X) / y(Y) / both
        axis: 'y',

        // width in pixels of the visible scroll area
        width : 'auto',

        // height in pixels of the visible scroll area
        height : '250px',

        // width in pixels of the scrollbar and rail
        size : '7px',

        // scrollbar color, accepts any hex/color value
        color: '#000',

        // scrollbar position - top/bottom
        positionX : 'bottom',

        // scrollbar position - left/right
        positionY : 'right',

        // distance in pixels between the side edge and the scrollbar
        distance : '1px',

        // default scroll position on load - left/right / $('selector')
        startX : 'left',

        // default scroll position on load - top / bottom / $('selector')
        startY : 'top',

        // sets scrollbar opacity
        opacity : 0.4,

        // enables always-on mode for the scrollbar
        alwaysVisible : false,

        // check if we should hide the scrollbar when user is hovering over
        disableFadeOut : false,

        // sets visibility of the rail
        railVisible : false,

        // sets rail color
        railColor : '#333',

        // sets rail opacity
        railOpacity : 0.2,

        // whether  we should use jQuery UI Draggable to enable bar dragging
        railDraggable : true,

        // defautlt CSS class of the slimscroll rail in X axis
        railClassX : 'slimScrollRailX',

        // defautlt CSS class of the slimscroll bar in X Axis
        barClassX : 'slimScrollBarX',

        // defautlt CSS class of the slimscroll rail in Y axis
        railClassY : 'slimScrollRailY',

        // defautlt CSS class of the slimscroll bar in Y axis
        barClassY : 'slimScrollBarY',

        // defautlt CSS class of the slimscroll wrapper
        wrapperClass : 'slimScrollDiv',

        // check if mousewheel should scroll the window if we reach top/bottom
        allowPageScroll : false,

        // check if force vertical movement of mousewheel to scroll a area whose axis is 'x'
        applyVerticalWheelToHorizontal : false,

        // scroll amount applied to each mouse wheel step
        wheelStep : 20,

        // scroll amount applied when user is using gestures
        touchScrollStep : 200,

        // sets border radius
        borderRadius: '7px',

        // sets border radius of the rail
        railBorderRadius : '7px'
      };

      var o = $.extend(defaults, options);

      // normalize to lower case for ease of handling
      o.axis = o.axis.toLowerCase();

      // do it for every element that matches selector
      this.each(function(){
      var hasHorizontalScrollbar;
      var hasVerticalScrollbar;
      var t, pageX, pageY;
      var isOverPanel, isOverBarX, isOverBarY, isDragg, queueHideX, queueHideY, touchDifX, touchDifY,
        barHeight, barWidth, percentScrollX, lastScrollX, percentScrollY, lastScrollY,
        divS = '<div></div>',
        minBarHeight = 30,
        minBarWidth = 30,
        releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);
        var $doc = $(document);

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass))
        {
            $.extend(o, (me.data('slimScrollConfig') || {})); //retrieve previous config
            // start from last bar position
            var offset_horizontal = me.scrollLeft();
            var offset_vertical = me.scrollTop();

            // find bar and rail
            barX = me.siblings('.' + o.barClassX);
            railX = me.siblings('.' + o.railClassX);
            barY = me.siblings('.' + o.barClassY);
            railY = me.siblings('.' + o.railClassY);

            //check that scroll bars are enabled
            hasHorizontalScrollbar = (o.axis == 'both' || o.axis == 'x');
            hasVerticalScrollbar = (o.axis == 'both' || o.axis == 'y');

            getBarXWidth();
            getBarYHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options))
            {

              // Pass width: auto to an existing slimscroll object to force a resize after contents have changed
              if ( 'width' in options && hasHorizontalScrollbar) {
                if (options.width == 'auto') {
                  me.parent().css('width', 'auto');
                  me.css('width', 'auto');
                  o.width = me.parent().parent().width();
                }
                else {
                  o.width = options.width;
                  me.css({'white-space': 'nowrap'});
                }
              }

              // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
              if ( 'height' in options && hasVerticalScrollbar) {
                if(options.height == 'auto'){
                  me.parent().css('height', 'auto');
                  me.css('height', 'auto');
                  o.height = me.parent().parent().height();
                } else {
                  o.height = options.height;
                }
              }

              // rewrap content
              me.parent().css({
                  position: 'relative',
                  overflow: 'hidden',
                  width: o.width,
                  height: o.height
                });

              // update style for the div
              me.css({
                overflow: 'hidden',
                width: o.width,
                height: o.height
              });

              if ('scrollToX' in options)
              {
                // jump to a static point
                offset_horizontal = parseInt(o.scrollToX);
              }
              else if ('scrollByX' in options)
              {
                // jump by value pixels
                offset_horizontal += parseInt(o.scrollByX);
              }
              if ('scrollToY' in options)
              {
                // jump to a static point
                offset_vertical = parseInt(o.scrollToY);
              }
              else if ('scrollByY' in options)
              {
                // jump by value pixels
                offset_vertical += parseInt(o.scrollByY);
              }

              if ('destroy' in options)
              {
                // remove slimscroll elements
                barX.remove();
                railX.remove();
                barY.remove();
                railY.remove();
                me.unwrap();
                return;
              }
            }
            // scroll content by the given offset
            scrollContent(offset_horizontal, offset_vertical, false, true);

            return;
        }
        else if ($.isPlainObject(options))
        {
            if ('destroy' in options)
            {
            	return;
            }
        }

        //check that scroll bars are enabled
        hasHorizontalScrollbar = (o.axis == 'both' || o.axis == 'x');
        hasVerticalScrollbar = (o.axis == 'both' || o.axis == 'y');

        // optionally set height/width to the parent's height/width
        o.height = (o.height == 'auto') ? me.parent().height() : o.height;
        o.width = (o.width == 'auto') ? me.parent().width() : o.width;

        //store options in DOM
        me.data('slimScrollConfig', o);

        // wrap content
        var wrapper = $(divS)
          .addClass(o.wrapperClass)
          .css({
            position: 'relative',
            overflow: 'hidden',
            width: o.width,
            height: o.height
          });

        // update style for the div
        me.css({
          overflow: 'hidden',
          width: o.width,
          height: o.height
        });

        // wrap it
        me.wrap(wrapper);


        if(hasHorizontalScrollbar){
          // if width is specified remove wrapping from text
          if(o.width != 'auto' && hasHorizontalScrollbar){
            me.css({'white-space': 'nowrap'});
          }

          // create scrollbar rail
          var railX = $(divS)
            .addClass(o.railClassX)
            .css({
              width: '100%',
              height: o.size,
              position: 'absolute',
              left: 0,
              display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
              'border-radius': o.railBorderRadius,
              background: o.railColor,
              opacity: o.railOpacity,
              zIndex: 90
            });

          // create scrollbar
          var barX = $(divS)
            .addClass(o.barClassX)
            .css({
              background: o.color,
              height: o.size,
              position: 'absolute',
              left: 0,
              opacity: o.opacity,
              display: o.alwaysVisible ? 'block' : 'none',
              'border-radius' : o.borderRadius,
              BorderRadius: o.borderRadius,
              MozBorderRadius: o.borderRadius,
              WebkitBorderRadius: o.borderRadius,
              zIndex: 99
            });

          // set position
          var xPosCss = (o.positionX == 'top') ? { top: o.distance } : { bottom: o.distance };
          railX.css(xPosCss);
          barX.css(xPosCss);

          // append to parent div
          me.parent().append(barX);
          me.parent().append(railX);

          // make it draggable and no longer dependent on the jqueryUI
          if(o.railDraggable){
            barX.on("mousedown", function(e) {
              isDragg = true;
              t = parseFloat(barX.css('left'));
              pageX = e.pageX;

              $doc.on("mousemove.slimscrollX", function(e){
                currLeft = t + e.pageX - pageX;
                barX.css('left', currLeft);
                scrollContent(0, 0, barX.position().left);// scroll content
              });

              $doc.on("mouseup.slimscrollX", function(e) {
                isDragg = false;
                hideBarX();
                $doc.unbind('.slimscrollX');
              });
              return false;
            }).on("selectstart.slimscrollX", function(e){
              e.stopPropagation();
              e.preventDefault();
              return false;
            });

            railX.on("mousedown", function(e){
              var deltaX = (e.offsetX - (barWidth/2))* me[0].scrollWidth / me.outerWidth();
              scrollContent(deltaX, 0, false, true);// scroll content
              t = parseFloat(barX.css('left'));
              pageX = e.pageX;

              $doc.on("mousemove.slimscrollX", function(e){
                currLeft = t + e.pageX - pageX;
                barX.css('left', currLeft);
                scrollContent(0, 0, barX.position().left);// scroll content
              });

              $doc.on("mouseup.slimscrollX", function(e) {
                isDragg = false;
                hideBarX();
                $doc.unbind('.slimscrollX');
              });
              return false;
            });
          }

          // on rail over
          railX.hover(function(){
            showBarX();
          }, function(){
            hideBarX();
          });

          // on bar over
          barX.hover(function(){
            isOverBarX = true;
          }, function(){
            isOverBarX = false;
          });

          // set up initial width and height
          getBarXWidth();

          // check start position
          if (o.startX === 'right')
          {
            // scroll content to rigth
            barX.css({ left: me.outerWidth() - barX.outerWidth() });
            scrollContent(0, 0, true);
          }
          else if (o.startX !== 'left')
          {
            // assume jQuery selector
            scrollContent($(o.startX).position().left, null, null, true);

            // make sure bar stays hidden
            if (!o.alwaysVisible) { barX.hide(); }
          }

        }


        if(hasVerticalScrollbar){
          // create scrollbar rail
          var railY = $(divS)
            .addClass(o.railClassY)
            .css({
              width: o.size,
              height: '100%',
              position: 'absolute',
              top: 0,
              display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
              'border-radius': o.railBorderRadius,
              background: o.railColor,
              opacity: o.railOpacity,
              zIndex: 90
            });

          // create scrollbar
          var barY = $(divS)
            .addClass(o.barClassY)
            .css({
              background: o.color,
              width: o.size,
              position: 'absolute',
              top: 0,
              opacity: o.opacity,
              display: o.alwaysVisible ? 'block' : 'none',
              'border-radius' : o.borderRadius,
              BorderRadius: o.borderRadius,
              MozBorderRadius: o.borderRadius,
              WebkitBorderRadius: o.borderRadius,
              zIndex: 99
            });

          var yPosCss = (o.positionY == 'right') ? { right: o.distance } : { left: o.distance };
          railY.css(yPosCss);
          barY.css(yPosCss);

          me.parent().append(barY);
          me.parent().append(railY);

          if(o.railDraggable){
            barY.on("mousedown", function(e) {
              isDragg = true;
              t = parseFloat(barY.css('top'));
              pageY = e.pageY;

              $doc.on("mousemove.slimscrollY", function(e){
                currTop = t + e.pageY - pageY;
                barY.css('top', currTop);
                scrollContent(0, 0, barY.position().top);// scroll content
              });

              $doc.on("mouseup.slimscrollY", function(e) {
                isDragg = false;
                hideBarY();
                $doc.unbind('.slimscrollY');
              });
              return false;
            }).on("selectstart.slimscrollY", function(e){
              e.stopPropagation();
              e.preventDefault();
              return false;
            });

            railY.on("mousedown", function(e){
              var deltaY = (e.offsetY - (barHeight/2))* me[0].scrollHeight / me.outerHeight();
              scrollContent(0, deltaY, false, true);// scroll content
              t = parseFloat(barY.css('top'));
              pageY = e.pageY;

              $doc.on("mousemove.slimscrollY", function(e){
                currTop = t + e.pageY - pageY;
                barY.css('top', currTop);
                scrollContent(0, 0, barY.position().top);// scroll content
              });

              $doc.on("mouseup.slimscrollY", function(e) {
                isDragg = false;
                hideBarY();
                $doc.unbind('.slimscrollY');
              });
              return false;
            });
          }

          // on rail over
          railY.hover(function(){
            showBarY();
          }, function(){
            hideBarY();
          });

          // on bar over
          barY.hover(function(){
            isOverBarY = true;
          }, function(){
            isOverBarY = false;
          });

          getBarYHeight();

          if (o.startY === 'bottom')
          {
            // scroll content to bottom
            barY.css({ top: me.outerHeight() - barY.outerHeight() });
            scrollContent(0, 0, true);
          }
          else if (o.startY !== 'top')
          {
            // assume jQuery selector
            scrollContent(null, $(o.startY).position().top, null, true);

            // make sure bar stays hidden
            if (!o.alwaysVisible) { barY.hide(); }
          }

        }

        // show on parent mouseover
        me.hover(function(){
          isOverPanel = true;
          showBarX();
          showBarY();
          hideBarX();
          hideBarY();
        }, function(){
          isOverPanel = false;
          hideBarX();
          hideBarY();
        });

        // support for mobile
        me.on('touchstart', function(e,b){
          if (e.originalEvent.touches.length)
          {
            // record where touch started
            touchDifX = e.originalEvent.touches[0].pageX;
            touchDifY = e.originalEvent.touches[0].pageY;
          }
        });

        me.on('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
  		      e.originalEvent.preventDefault();
		      }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diffX = (touchDifX - e.originalEvent.touches[0].pageX) / o.touchScrollStep;
            var diffY = (touchDifY - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diffX, diffY, true);
            touchDifX = e.originalEvent.touches[0].pageX;
            touchDifY = e.originalEvent.touches[0].pageY;
          }
        });


        // attach scroll events
        attachWheel(this);

        function _getDeltaFromEvent(e) {
          var deltaX     = 0;
          var deltaY     = 0;

          // Old school scrollwheel delta
          if ( 'detail'      in e ) { deltaY = e.detail;      }
          if ( 'wheelDelta'  in e ) { deltaY = -1 * e.wheelDelta / 6;       }
          if ( 'wheelDeltaY' in e ) { deltaY = -1 * e.wheelDeltaY / 6;      }
          if ( 'wheelDeltaX' in e ) { deltaX = e.wheelDeltaX / 6; }

          // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
          if ( 'axis' in e && e.axis === e.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
          }

          if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
            // IE in some mouse drivers
            deltaX = 0;
            deltaY = e.wheelDelta;
          }

          // New school wheel delta (wheel event)
          if ( 'deltaY' in e ) {
            deltaY = e.deltaY;
          }
          if ( 'deltaX' in e ) {
            deltaX = e.deltaX;
          }

          return [deltaX, deltaY];
        }

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) { return; }

          e = e || window.event;

          var delta = _getDeltaFromEvent(e);
          var deltaX = delta[0];
          var deltaY = delta[1];

          // if (e.wheelDelta) { delta = -e.wheelDelta/120; }
          // if (e.detail) { delta = e.detail / 3; }

          var target = e.target || e.srcTarget || e.srcElement;
          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
            // scroll content
            scrollContent(deltaX, deltaY, true);
          }

          // stop window scroll
          if (e.preventDefault && !releaseScroll) {
            e.preventDefault();
            e.stopPropagation();
          }
          if (!releaseScroll) { e.returnValue = false; }
        }

        function scrollContent(x, y, isWheel, isJump)
        {
          releaseScroll = false;

          if(hasHorizontalScrollbar){
            var deltaX = moveFactor = x;
            if(o.applyVerticalWheelToHorizontal && o.axis == 'x' && !deltaX && !!y){
              deltaX = moveFactor = y;
            }
            var maxLeft = me.outerWidth() - barX.outerWidth();

            if (isWheel)
            {
              // move bar with mouse wheel
              deltaX = parseInt(barX.css('left')) + (moveFactor * parseInt(o.wheelStep)/100);

              // move bar, make sure it doesn't go out
              deltaX = Math.min(Math.max(deltaX, 0), maxLeft);

              // if scrolling right, make sure a fractional change to the
              // scroll position isn't rounded away when the scrollbar's CSS is set
              // this flooring of delta would happened automatically when
              // bar.css is set below, but we floor here for clarity
              deltaX = (moveFactor > 0) ? Math.ceil(deltaX) : Math.floor(deltaX);

              // scroll the scrollbar
              barX.css({ left: deltaX + 'px' });
            }

            // calculate actual scroll amount
            percentScrollX = parseInt(barX.css('left')) / (me.outerWidth() - barX.outerWidth());
            deltaX = percentScrollX * (me[0].scrollWidth - me.outerWidth());

            if (isJump)
            {
              deltaX = x;
              var offsetLeft = deltaX / me[0].scrollWidth * me.outerWidth();
              offsetLeft = Math.min(Math.max(offsetLeft, 0), maxLeft);
              barX.css({ left: offsetLeft + 'px' });
            }

            // scroll content and fire scrolling event
            me.scrollLeft(deltaX);
            me.trigger('slimscrollingX', ~~deltaX);

            // ensure bar is visible
            showBarX();

            // trigger hide when scroll is stopped
            hideBarX();
          }


          if(hasVerticalScrollbar){
            var deltaY = y;
            var maxTop = me.outerHeight() - barY.outerHeight();

            if (isWheel)
            {
              // move bar with mouse wheel
              deltaY = parseInt(barY.css('top')) + (y * parseInt(o.wheelStep) /100);

              // move bar, make sure it doesn't go out
              deltaY = Math.min(Math.max(deltaY, 0), maxTop);

              // if scrolling down, make sure a fractional change to the
              // scroll position isn't rounded away when the scrollbar's CSS is set
              // this flooring of delta would happened automatically when
              // bar.css is set below, but we floor here for clarity
              deltaY = (y > 0) ? Math.ceil(deltaY) : Math.floor(deltaY);

              // scroll the scrollbar
              barY.css({ top: deltaY + 'px' });
            }

            // calculate actual scroll amount
            percentScrollY = parseInt(barY.css('top')) / (me.outerHeight() - barY.outerHeight());
            deltaY = percentScrollY * (me[0].scrollHeight - me.outerHeight());

            if (isJump)
            {
              deltaY = y;
              var offsetTop = deltaY / me[0].scrollHeight * me.outerHeight();
              offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
              barY.css({ top: offsetTop + 'px' });
            }

            // scroll content and fire scrolling event
            me.scrollTop(deltaY);
            me.trigger('slimscrollingY', ~~deltaY);

            // ensure bar is visible
            showBarY();

            // trigger hide when scroll is stopped
            hideBarY();
          }

        }

        function attachWheel(target)
        {
          if (window.addEventListener)
          {
            if (typeof window.onwheel !== "undefined") {
              target.addEventListener('wheel', _onWheel, false );
            } else if (typeof window.onmousewheel !== "undefined") {
              target.addEventListener('mousewheel', _onWheel, false );
            }
            target.addEventListener('DOMMouseScroll', _onWheel, false );
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel);
          }
        }

        function getBarXWidth()
        {
          if(!barX){return;}
          // calculate scrollbar height and make sure it is not too small
          barWidth = Math.max((me.outerWidth() / me[0].scrollWidth) * me.outerWidth(), minBarWidth);
          barX.css({ width: barWidth + 'px' });

          // hide scrollbar if content is not long enough
          // var display = barWidth == me.outerWidth() ? 'none' : 'block';
          var display = (hasHorizontalScrollbar && (me[0].scrollWidth>me[0].clientWidth)) ? 'block' : 'none';
          barX.css({ display: display });
        }

        function getBarYHeight()
        {
          if(!barY){return;}
          // calculate scrollbar height and make sure it is not too small
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          barY.css({ height: barHeight + 'px' });

          // hide scrollbar if content is not long enough
          // var display = barHeight == me.outerHeight() ? 'none' : 'block';
          var display = (hasVerticalScrollbar && (me[0].scrollHeight>me[0].clientHeight)) ? 'block' : 'none';
          barY.css({ display: display });
        }


        function showBarX()
        {
          if(!barX){return;}
          // recalculate bar height
          getBarXWidth();
          clearTimeout(queueHideX);

          // when bar reached top or bottom
          if (percentScrollX == ~~percentScrollX)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScrollX != percentScrollX)
            {
              var msg = (~~percentScrollX === 0) ? 'left' : 'right';
              me.trigger('slimscrollX', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScrollX = percentScrollX;

          // show only when required
          if(barWidth >= me.outerWidth()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          barX.stop(true,true).fadeIn('fast');
          if (o.railVisible) { railX.stop(true,true).fadeIn('fast'); }
        }

        function hideBarX()
        {
          if(!barX){return;}
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHideX = setTimeout(function(){
              if (!(o.disableFadeOut && isOverPanel) && !isOverBarX && !isDragg)
              {
                barX.fadeOut('slow');
                railX.fadeOut('slow');
              }
            }, 1000);
          }
        }

        function showBarY()
        {
          if(!barY){return;}
          // recalculate bar height
          getBarYHeight();
          clearTimeout(queueHideY);

          // when bar reached top or bottom
          if (percentScrollY == ~~percentScrollY)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScrollY != percentScrollY)
            {
                var msg = (~~percentScrollY === 0) ? 'top' : 'bottom';
                me.trigger('slimscrollY', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScrollY = percentScrollY;

          // show only when required
          if(barHeight >= me.outerHeight()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          barY.stop(true,true).fadeIn('fast');
          if (o.railVisible) { railY.stop(true,true).fadeIn('fast'); }
        }

        function hideBarY()
        {
          if(!barY){return;}
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHideY = setTimeout(function(){
              if (!(o.disableFadeOut && isOverPanel) && !isOverBarY && !isDragg)
              {
                barY.fadeOut('slow');
                railY.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });

      this.trigger('initialized');

      // maintain chainability
      return this;
    }
  });

  $.fn.extend({
    slimscroll: $.fn.slimScroll
  });

})(jQuery);
