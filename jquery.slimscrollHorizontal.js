/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.2
 *
 */
(function($) {

  $.fn.extend({
    slimScrollH: function(options) {

      var defaults = {

        // width in pixels of the visible scroll area
        width : '250px',

        // height in pixels of the visible scroll area
        height : 'auto',

        // height in pixels of the scrollbar and rail
        size : '7px',

        // scrollbar color, accepts any hex/color value
        color: '#000',

        // scrollbar position - top/bottom
        position : 'bottom',

        // distance in pixels between the side edge and the scrollbar
        distance : '1px',

        // default scroll position on load - left/right / $('selector')
        start : 'left',

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

        // defautlt CSS class of the slimscroll rail
        railClass : 'slimScrollRailH',

        // defautlt CSS class of the slimscroll bar
        barClass : 'slimScrollBarH',

        // defautlt CSS class of the slimscroll wrapper
        wrapperClass : 'slimScrollDiv',

        // check if mousewheel should scroll the window if we reach top/bottom
        allowPageScroll : false,

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

      // do it for every element that matches selector
      this.each(function(){

      var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
        barWidth, percentScroll, lastScroll,
        divS = '<div></div>',
        divMask = '<div></div>',
        minBarWidth = 30,
        releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);

        // active mask
        var isMask = me.width() >= o.width;

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass) && $.inArray(o.barClass, me.parent().children().map(function(i, el){return $(el).attr('class');})) >= 0 && $.inArray(o.railClass, me.parent().children().map(function(i, el){return $(el).attr('class');})) >= 0)
        {
            // start from last bar position
            var offset_horizontal = me.scrollLeft();

            // find bar and rail
            bar = me.parent().find('.' + o.barClass);
            rail = me.parent().find('.' + o.railClass);

            getBarHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options))
            {
              // Pass width: auto to an existing slimscroll object to force a resize after contents have changed
              if ( 'width' in options ) {
                if (options.width == 'auto') {
                  me.parent().css('width', 'auto');
                  me.css('width', 'auto');
                  var width = me.parent().parent().width();
                  me.parent().css('width', width);
                  me.css('width', width);
                }
                else {
                  me.css('width', o.width);
                  me.parent().css('width', o.width);
                }
              }

              if ('scrollTo' in options)
              {
                // jump to a static point
                offset_horizontal = parseInt(o.scrollTo);
              }
              else if ('scrollBy' in options)
              {
                // jump by value pixels
                offset_horizontal += parseInt(o.scrollBy);
              }
              else if ('destroy' in options)
              {
                // remove slimscroll elements
                bar.remove();
                rail.remove();
                me.unwrap();
                return;
              }

              // scroll content by the given offset_horizontal
              scrollContent(offset_horizontal, false, true);
            }

            return;
        }

        // optionally set height to the parent's height
        o.width = (o.width == 'auto') ? me.parent().width() : o.width;
        o.height = (o.height == 'auto') ? me.parent().height() : o.height;

        // wrap content
        var wrapper = me.parent();
        if (!me.parent().hasClass(o.wrapperClass)) {
          wrapper = $(divS)
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
        }

        // create scrollbar rail
        var rail = $(divS)
          .addClass(o.railClass)
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
        var bar = $(divS)
          .addClass(o.barClass)
          .css({
            background: o.color,
            height: o.size,
            position: 'absolute',
            cursor: o.opacity ? 'move' : 'normal',
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
        var posCss = (o.position == 'top') ? { top: o.distance } : { bottom: o.distance };
        rail.css(posCss);
        bar.css(posCss);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);

        // create masks
        if (isMask && o.mask_left_url) {
          var mask_left = $(divMask)
            .addClass('mask_left')
            .css({
              width: '20px',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              display: bar.position().left <= 0 ? 'none' : 'block',
              backgroundImage: 'url(' + o.mask_left_url + ')',
              backgroundRepeat: 'y',
              zIndex: 85
            });
          me.parent().append(mask_left);
        }

        if (isMask && o.mask_right_url) {
          var mask_right = $(divMask)
            .addClass('mask_right')
            .css({
              width: '20px',
              height: '100%',
              position: 'absolute',
              bottom: 0,
              right: 0,
              display: bar.position().left >= me.width()-bar.width() ? 'none' : 'block',
              backgroundImage: 'url(' + o.mask_right_url + ')',
              backgroundRepeat: 'y',
              zIndex: 85
            });
          me.parent().append(mask_right);
        }

        // make it draggable and no longer dependent on the jqueryUI
        if (o.railDraggable){
          bar.bind("mousedown", function(e) {
            var $doc = $(document);
            isDragg = true;
            t = parseFloat(bar.css('left'));
            pageY = e.pageX;

            $doc.bind("mousemove.slimscroll", function(e){
              currLeft = t + e.pageX - pageY;
              bar.css('left', currLeft);
              scrollContent(0, bar.position().left, false);// scroll content
            });

            $doc.bind("mouseup.slimscroll", function(e) {
              isDragg = false;hideBar();
              $doc.unbind('.slimscroll');
            });
            return false;
          }).bind("selectstart.slimscroll", function(e){
            e.stopPropagation();
            e.preventDefault();
            return false;
          });
        }

        // on rail over
        rail.hover(function(){
          showBar();
        }, function(){
          hideBar();
        });

        // on bar over
        bar.hover(function(){
          isOverBar = true;
        }, function(){
          isOverBar = false;
        });

        // show on parent mouseover
        me.hover(function(){
          isOverPanel = true;
          showBar();
          hideBar();
        }, function(){
          isOverPanel = false;
          hideBar();
        });

        // support for mobile
        me.bind('touchstart', function(e,b){
          if (e.originalEvent.touches.length)
          {
            // record where touch started
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        me.bind('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
  		      e.originalEvent.preventDefault();
		      }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diff, true);
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        // set up initial height
        getBarHeight();

        // check start position
        if (o.start === 'right')
        {
          // scroll content to rigth
          bar.css({ left: me.outerWidth() - bar.outerWidth() });
          scrollContent(0, true);
        }
        else if (o.start !== 'left')
        {
          // assume jQuery selector
        scrollContent($(o.start).position().left, null, true);

          // make sure bar stays hidden
          if (!o.alwaysVisible) { bar.hide(); }
        }

        // attach scroll events
        attachWheel();

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) { return; }

          var e = e || window.event;

          var delta = 0;
          if (e.wheelDelta) { delta = -e.wheelDelta/120; }
          if (e.detail) { delta = e.detail / 3; }

          if (e.wheelDeltaX || e.deltaX || e.axis == 1) {
            var target = e.target || e.srcTarget || e.srcElement;
            if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
              // scroll content
              scrollContent(delta, true);
            }

            // stop window scroll
            if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
            if (!releaseScroll) { e.returnValue = false; }
          }
        }

        function scrollContent(y, isWheel, isJump)
        {
          releaseScroll = false;
          var delta = y;
          var maxLeft = me.outerWidth() - bar.outerWidth();

          if (isMask)
          {
            me.parent().find('.mask_left').css({
              display: bar.position().left <= 0 ? 'none' : 'block'
            });
            me.parent().find('.mask_right').css({
              display: bar.position().left >= me.width()-bar.width() ? 'none' : 'block'
            });
          }

          if (isWheel)
          {
            // move bar with mouse wheel
            delta = parseInt(bar.css('left')) + y * parseInt(o.wheelStep) / 100 * bar.outerWidth();

            // move bar, make sure it doesn't go out
            delta = Math.min(Math.max(delta, 0), maxLeft);

            // if scrolling down, make sure a fractional change to the
            // scroll position isn't rounded away when the scrollbar's CSS is set
            // this flooring of delta would happened automatically when
            // bar.css is set below, but we floor here for clarity
            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

            // scroll the scrollbar
            bar.css({ left: delta + 'px' });
          }

          // calculate actual scroll amount
          percentScroll = parseInt(bar.css('left')) / (me.outerWidth() - bar.outerWidth());
          delta = percentScroll * (me[0].scrollWidth - me.outerWidth());

          if (isJump)
          {
            delta = y;
            var offsetLeft = delta / me[0].scrollWidth * me.outerWidth();
            offsetLeft = Math.min(Math.max(offsetLeft, 0), maxLeft);
            bar.css({ left: offsetLeft + 'px' });
          }

          // scroll content
          me.scrollLeft(delta);

          // fire scrolling event
          me.trigger('slimscrolling', ~~delta);

          // ensure bar is visible
          showBar();

          // trigger hide when scroll is stopped
          hideBar();
        }

        function attachWheel()
        {
          if (window.addEventListener)
          {
            this.addEventListener('DOMMouseScroll', _onWheel, false );
            this.addEventListener('mousewheel', _onWheel, false );
            this.addEventListener('MozMousePixelScroll', _onWheel, false );
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel);
          }
        }

        function getBarHeight()
        {
          // calculate scrollbar height and make sure it is not too small
          barWidth = Math.max((me.outerWidth() / me[0].scrollWidth) * me.outerWidth(), minBarWidth);
          bar.css({ width: barWidth + 'px' });

          // hide scrollbar if content is not long enough
          var display = barWidth == me.outerWidth() ? 'none' : 'block';
          bar.css({ display: display });
        }

        function showBar()
        {
          // recalculate bar height
          getBarHeight();
          clearTimeout(queueHide);

          // when bar reached top or bottom
          if (percentScroll == ~~percentScroll)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScroll != percentScroll)
            {
                var msg = (~~percentScroll == 0) ? 'left' : 'right';
                me.trigger('slimscroll', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScroll = percentScroll;

          // show only when required
          if(barWidth >= me.outerWidth()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          bar.stop(true,true).fadeIn('fast');
          if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
        }

        function hideBar()
        {
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHide = setTimeout(function(){
              if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
              {
                bar.fadeOut('slow');
                rail.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });

      // maintain chainability
      return this;
    }
  });

  $.fn.extend({
    slimscrollH: $.fn.slimScrollH
  });

})(jQuery);
