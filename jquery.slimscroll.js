/*!
 * Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.9
 *
 */
(function($) {
    "use strict";

    $.fn.extend({
        slimScroll: function(options) {

            var defaults = {

                width           : 'auto',               // width in pixels of the visible scroll area

                height          : '250px',              // height in pixels of the visible scroll area

                size            : '7px',                // width in pixels of the scrollbar and rail

                color           : '#000',               // scrollbar color, accepts any hex/color value

                position        : 'right',              // scrollbar position - left/right

                distance        : '1px',                // distance in pixels between the side edge and the scrollbar

                start           : 'top',                // default scroll position on load - top / bottom / $('selector')

                opacity         : 0.4,                  // sets scrollbar opacity

                alwaysVisible   : false,                // enables always-on mode for the scrollbar

                disableFadeOut  : false,                // check if we should hide the scrollbar when user is hovering over

                railVisible     : false,                // sets visibility of the rail

                railColor       : '#333',               // sets rail color

                railOpacity     : 0.2,                  // sets rail opacity

                railDraggable   : true,                 // whether    we should use jQuery UI Draggable to enable bar dragging

                horizontal      : false,                // enable scroll horizontal

                animate         : false,                // sets animation status on a given scroll

                barFixSize      : 0,                    // fixed bar height/width

                railClass       : 'slimScrollRail',     // defautlt CSS class of the slimscroll rail

                barClass        : 'slimScrollBar',      // defautlt CSS class of the slimscroll bar

                railClassH      : 'slimScrollRailHor',  // defautlt CSS class of the slimscroll rail (horizontal)

                barClassH       : 'slimScrollBarHor',   // defautlt CSS class of the slimscroll bar (horizontal)

                wrapperClass    : 'slimScrollDiv',      // defautlt CSS class of the slimscroll wrapper

                allowPageScroll : false,                // check if mousewheel should scroll the window if we reach top/bottom

                wheelStep       : 20,                   // scroll amount applied to each mouse wheel step

                touchScrollStep : 200,                  // scroll amount applied when user is using gestures

                borderRadius    : '7px',                // sets border radius

                railBorderRadius: '7px',                // sets border radius of the rail

                cursor          : 'normal',             // cursor for for the scroll bar

                zIndex          : 90                    // z-index for the scroll bar

            };

            var o = $.extend( defaults, options );

            // do it for every element that matches selector
            this.each( function(){

                var isOverPanel, isOverBar, isDragg, queueHide,
                    percentScrollX, percentScrollY,
                    lastScrollX, lastScrollY,
                    touchDifX, touchDifY,
                    barHeight, barWidth,
                    bar, rail, barH, railH,
                    divS          = '<div></div>',
                    minBarHeight  = 30,
                    minBarWidth   = 30,
                    releaseScroll = false;

                // used in event handlers and for better minification
                var me = $(this);

                // ensure we are not binding it again
                if ( me.parent().hasClass( o.wrapperClass ) )
                {
                    // start from last bar position
                    var offset = me.scrollTop();

                    // find bar and rail
                    bar  = me.siblings( '.' + o.barClass  );
                    rail = me.siblings( '.' + o.railClass );

                    // only if you need a horizontal scroll (small acceleration)
                    if ( o.horizontal )
                    {
                        barH  = me.siblings( '.' + o.barClassH  );
                        railH = me.siblings( '.' + o.railClassH );
                    }

                    getBarHeight();
                    getBarWidth();

                    // check if we should scroll existing instance
                    if ( $.isPlainObject(options) )
                    {
                        // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
                        if ( 'height' in options && options.height == 'auto' )
                        {
                            me.parent().css( 'height', 'auto' );
                            me.css( 'height', 'auto' );
                            var height = me.parent().parent().height();
                            me.parent().css( 'height', height );
                            me.css( 'height', height );
                        }
                        else if ( 'height' in options )
                        {
                            var h = options.height;
                            me.parent().css( 'height', h );
                            me.css( 'height', h );
                        }

                        if ( 'scrollTo' in options )
                        {
                            // jump to a static point
                            offset = parseInt( o.scrollTo );
                        }
                        else if ( 'scrollBy' in options )
                        {
                            // jump by value pixels
                            offset += parseInt( o.scrollBy );
                        }
                        else if ( 'destroy' in options )
                        {
                            // remove slimscroll elements
                            bar.remove();
                            barH.remove();

                            // only if you need a horizontal scroll (small acceleration)
                            if ( o.horizontal )
                            {
                                rail.remove();
                                railH.remove();
                            }

                            me.unwrap();
                            return;
                        }

                        // scroll content by the given offset
                        scrollContent( 0, offset, false, true );
                    }

                    return;
                }
                else if ( $.isPlainObject(options) )
                {
                    if ( 'destroy' in options )
                    {
                        return;
                    }
                }

                // optionally set height to the parent's height
                o.height = ( o.height == 'auto' ) ? me.parent().height() : o.height;

                var maxLen = o.horizontal ? ( 'calc(100% - ' + o.size ) : '100%';

                // wrap content
                var wrapper = $(divS)
                    .addClass( o.wrapperClass )
                    .css({
                        position: 'relative',
                        overflow: 'hidden',
                        width   : o.width,
                        height  : o.height
                    });

                // update style for the div
                me.css({
                    overflow: 'hidden',
                    width   : o.width,
                    height  : o.height
                });

                // create scrollbar rail
                rail = $(divS)
                    .addClass( o.railClass )
                    .css({
                        width           :  o.size,
                        height          :  maxLen,
                        position        :  'absolute',
                        top             :  0,
                        display         :  ( o.alwaysVisible && o.railVisible ) ? 'block' : 'none',
                        'border-radius' :  o.railBorderRadius,
                        background      :  o.railColor,
                        opacity         :  o.railOpacity,
                        zIndex          :  o.zIndex
                    });

                // create scrollbar
                bar = $(divS)
                    .addClass( o.barClass )
                    .css({
                        cursor             :  o.cursor,
                        background         :  o.color,
                        width              :  o.size,
                        position           :  'absolute',
                        top                :  0,
                        opacity            :  o.opacity,
                        display            :  o.alwaysVisible ? 'block' : 'none',
                        'border-radius'    :  o.borderRadius,
                        BorderRadius       :  o.borderRadius,
                        MozBorderRadius    :  o.borderRadius,
                        WebkitBorderRadius :  o.borderRadius,
                        zIndex             :  o.zIndex + 9
                    });

                // create scrollbar (only if you need a horizontal scroll, small acceleration)
                if ( o.horizontal )
                {
                    // create scrollbar rail  
                    railH = $(divS)
                        .addClass( o.railClassH )
                        .css({
                            width           :  maxLen,
                            height          :  o.size,
                            position        :  'absolute',
                            left            :  0,
                            display         :  ( o.alwaysVisible && o.railVisible ) ? 'block' : 'none',
                            'border-radius' :  o.railBorderRadius,
                            background      :  o.railColor,
                            opacity         :  o.railOpacity,
                            zIndex          :  o.zIndex
                        });

                    // create scrollbar
                    barH = $(divS)
                        .addClass( o.barClassH )
                        .css({
                            cursor             :  o.cursor,
                            background         :  o.color,
                            height             :  o.size,
                            position           :  'absolute',
                            left               :  0,
                            opacity            :  o.opacity,
                            display            :  o.alwaysVisible ? 'block' : 'none',
                            'border-radius'    :  o.borderRadius,
                            BorderRadius       :  o.borderRadius,
                            MozBorderRadius    :  o.borderRadius,
                            WebkitBorderRadius :  o.borderRadius,
                            zIndex             :  o.zIndex + 9
                        });
                }

                // set position
                var posCss = ( o.position == 'right' ) ? { right: o.distance } : { left: o.distance };
                rail.css( posCss );
                bar.css( posCss );

                // wrap it
                me.wrap( wrapper );

                // append to parent div
                me.parent().append( bar );
                me.parent().append( rail );

                // only if you need a horizontal scroll (small acceleration)
                if ( o.horizontal )
                {
                    // set position
                    posCss = { bottom: o.distance };
                    railH.css( posCss );
                    barH.css( posCss );
                    // append to parent div
                    me.parent().append( barH );
                    me.parent().append( railH );
                }

                // make it draggable and no longer dependent on the jqueryUI
                if ( o.railDraggable )
                {
                    var $doc = $(document);

                    bar.bind( 'mousedown', function(e) {

                        isDragg = true;
                        var t = parseFloat( bar.css('top') );
                        var pageY = e.pageY;

                        $doc.bind( 'mousemove.slimscroll', function(e){
                            bar.css( 'top', t + e.pageY - pageY );
                            scrollContent( 0, 0, bar.position().top, false );       // scroll content
                        });

                        $doc.bind( 'mouseup.slimscroll', function(e) {
                            isDragg = false;
                            hideBar();
                            $doc.unbind( '.slimscroll' );
                        });
                        return false;

                    }).bind( 'selectstart.slimscroll', function(e){

                        e.stopPropagation();
                        e.preventDefault();
                        return false;

                    });

                    // only if you need a horizontal scroll (small acceleration)
                    if ( o.horizontal )
                    {
                        barH.bind( 'mousedown', function(e) {

                            isDragg = true;
                            var t = parseFloat( barH.css('left') );
                            var pageX = e.pageX;

                            $doc.bind( 'mousemove.slimscroll', function(e){
                                barH.css( 'left', t + e.pageX - pageX );
                                scrollContent( 0, 0, barH.position().left, false );     // scroll content
                            });

                            $doc.bind( 'mouseup.slimscroll', function(e) {
                                isDragg = false;
                                hideBar();
                                $doc.unbind( '.slimscroll' );
                            });
                            return false;

                        }).bind( 'selectstart.slimscroll', function(e){

                            e.stopPropagation();
                            e.preventDefault();
                            return false;

                        });
                    }
                }

                // on rail over
                rail.hover( function(){
                    showBar();
                }, function(){
                    hideBar();
                });

                // on bar over
                bar.hover( function(){
                    isOverBar = true;
                }, function(){
                    isOverBar = false;
                });

                // only if you need a horizontal scroll (small acceleration)
                if ( o.horizontal )
                {
                    railH.hover( function(){
                        showBar();
                    }, function(){
                        hideBar();
                    });

                    barH.hover( function(){
                        isOverBar = true;
                    }, function(){
                        isOverBar = false;
                    });
                }

                // show on parent mouseover
                me.hover( function(){
                    isOverPanel = true;
                    showBar();
                    hideBar();
                }, function(){
                    isOverPanel = false;
                    hideBar();
                });

                // support for mobile
                me.bind( 'touchstart', function(e,b){
                    if ( e.originalEvent.touches.length )
                    {
                        var touch = e.originalEvent.touches[0];
                        // record where touch started
                        touchDifX = touch.pageX;
                        touchDifY = touch.pageY;
                    }
                });

                me.bind( 'touchmove', function(e){
                    // prevent scrolling the page if necessary
                    if( !releaseScroll )
                    {
                        e.originalEvent.preventDefault();
                    }
                    if ( e.originalEvent.touches.length )
                    {
                        var touch = e.originalEvent.touches[0];
                        // see how far user swiped
                        var diffX = ( touchDifX - touch.pageX ) / o.touchScrollStep;
                        var diffY = ( touchDifY - touch.pageY ) / o.touchScrollStep;
                        // scroll content
                        scrollContent( diffX, diffY, true );
                        touchDifX = touch.pageX;
                        touchDifY = touch.pageY;
                    }
                });

                // set up initial height
                getBarHeight();
                getBarWidth();

                // check start position
                if ( o.start == 'bottom' )
                {
                    // scroll content to bottom
                    bar.css({ top: me.outerHeight() - bar.outerHeight() });
                    scrollContent( 0, 0, true );
                }
                else if ( o.start !== 'top' )
                {
                    var pos = $(o.start).position();

                    // assume jQuery selector
                    scrollContent( pos.left, pos.top, null, true );

                    // make sure bar stays hidden
                    if ( !o.alwaysVisible ) {
                        bar.hide();
                        barH.hide();
                    }
                }

                // attach scroll events
                attachWheel(this);


                function _onWheel(e)
                {
                    // use mouse wheel only when mouse is over
                    if ( !isOverPanel ) { return; }

                    e = e || window.event;

                    var delta = 0;
                    if ( e.wheelDelta ) { delta = -e.wheelDelta / 120; }
                    if ( e.detail ) { delta = e.detail / 3; }

                    var target = e.target || e.srcTarget || e.srcElement;
                    if ( $(target).closest( '.' + o.wrapperClass ).is( me.parent() ) ) {
                        // scroll content
                        scrollContent( 0, delta, true );
                    }

                    // stop window scroll
                    if ( e.preventDefault && !releaseScroll ) { e.preventDefault(); }
                    if ( !releaseScroll ) { e.returnValue = false; }
                }

                function scrollContent(x, y, isWheel, isJump)
                {
                    releaseScroll = false;
                    var deltaX  = x;
                    var deltaY  = y;
                    var maxTop  = me.outerHeight() - bar.outerHeight() - ( o.horizontal ? o.size : 0 );
                    var maxLeft = o.horizontal && ( me.outerWidth() - barH.outerWidth() - o.size );

                    if ( isWheel )
                    {
                        // move bar with mouse wheel
                        deltaY = parseInt( bar.css('top') ) + y * parseInt( o.wheelStep ) / 100 * bar.outerHeight();

                        // move bar, make sure it doesn't go out
                        deltaY = Math.min( Math.max( deltaY, 0 ), maxTop );

                        // if scrolling down, make sure a fractional change to the
                        // scroll position isn't rounded away when the scrollbar's CSS is set
                        // this flooring of delta would happened automatically when
                        // bar.css is set below, but we floor here for clarity
                        deltaY = ( y > 0 ) ? Math.ceil( deltaY ) : Math.floor( deltaY );

                        // scroll the scrollbar
                        bar.css({ top: deltaY + 'px' });

                        // only if you need a horizontal scroll (small acceleration)
                        if ( o.horizontal )
                        {
                            deltaX = parseInt( barH.css('left') ) + x * parseInt( o.wheelStep ) / 100 * barH.outerWidth();
                            deltaX = Math.min( Math.max( deltaX, 0 ), maxLeft );
                            deltaX = ( x > 0 ) ? Math.ceil( deltaX ) : Math.floor( deltaX );
                            barH.css({ left: deltaX + 'px' });
                        }
                    }

                    // calculate actual scroll amount
                    percentScrollY = parseInt( bar.css('top') ) / ( me.outerHeight() - bar.outerHeight() );
                    deltaY = percentScrollY * ( me[0].scrollHeight - me.outerHeight() );

                    // calculate actual scroll amount (only if you need a horizontal scroll, small acceleration))
                    if ( o.horizontal )
                    {
                        percentScrollX = parseInt( barH.css('left') ) / ( me.outerWidth() - barH.outerWidth() );
                        deltaX = percentScrollX * ( me[0].scrollWidth - me.outerWidth() );
                    }

                    if ( isJump )
                    {
                        deltaY = y;
                        var offsetTop = deltaY / me[0].scrollHeight * me.outerHeight();
                        offsetTopY = Math.min( Math.max( offsetTop, 0 ), maxTop );
                        bar.css({ top: offsetTopY + 'px' });

                        // only if you need a horizontal scroll (small acceleration)
                        if ( o.horizontal )
                        {
                            deltaX = x;
                            var offsetLeft = deltaX / me[0].scrollWidth * me.outerWidth();
                            offsetTopX = Math.min( Math.max( offsetLeft, 0 ), maxLeft );
                            barH.css({ left: offsetTopX + 'px' });
                        }
                    }

                    // scroll content
                    if ( o.animate )
                    {
                        // scroll content smoothly using jquery animation
                        me.stop( true, true ).animate( { scrollTop: deltaY, scrollLeft: deltaX }, 200, 'linear' );
                    }
                    else
                    {
                        me.scrollTop( deltaY );
                        if ( o.horizontal ) { me.scrollLeft( deltaX ); }
                    }

                    // fire scrolling event
                    me.trigger( 'slimscrolling', ~~deltaY, o.horizontal && deltaX );

                    // ensure bar is visible
                    showBar();

                    // trigger hide when scroll is stopped
                    hideBar();
                }

                function attachWheel(target)
                {
                    if ( window.addEventListener )
                    {
                        target.addEventListener( 'DOMMouseScroll', _onWheel, false );
                        target.addEventListener( 'mousewheel', _onWheel, false );
                    }
                    else
                    {
                        document.attachEvent( 'onmousewheel', _onWheel );
                    }
                }

                function getBarHeight()
                {
                    // calculate scrollbar height and make sure it is not too small
                    barHeight = o.barFixSize ? parseInt( o.barFixSize ) : Math.max( ( me.outerHeight() / me[0].scrollHeight ) * me.outerHeight(), minBarHeight );
                    bar.css({ height: barHeight + 'px' });

                    // hide scrollbar if content is not long enough
                    var display = ~~barHeight == ~~me.outerHeight() ? 'none' : 'block';
                    bar.css({ display: display });
                }

                function getBarWidth()
                {
                    // only if you need a horizontal scroll (small acceleration)
                    if ( !o.horizontal ) { return; }

                    // calculate scrollbar width and make sure it is not too small
                    barWidth = o.barFixSize ? parseInt( o.barFixSize ) : Math.max( ( me.outerWidth() / me[0].scrollWidth ) * me.outerWidth(), minBarWidth );
                    barH.css({ width: barWidth + 'px' });

                    // hide scrollbar if content is not long enough
                    var display = ~~barWidth == ~~me.outerWidth() ? 'none' : 'block';
                    barH.css({ display: display });
                }

                function showBar()
                {
                    // recalculate bar height
                    getBarHeight();
                    getBarWidth();
                    clearTimeout(queueHide);

                    // when bar reached top or bottom
                    if ( percentScrollY == ~~percentScrollY || percentScrollX == ~~percentScrollX )
                    {
                        //release wheel
                        releaseScroll = o.allowPageScroll;

                        var msgY, msgX;

                        // publish approporiate event
                        if ( lastScrollY !== percentScrollY )
                        {
                                msgY = ( ~~percentScrollY == 0 ) ? 'top' : 'bottom';
                        }
                        if ( lastScrollX !== percentScrollX )
                        {
                                msgX = ( ~~percentScrollX == 0 ) ? 'left' : 'right';
                        }
                        if ( msgY, msgX )
                        {
                            me.trigger( 'slimscroll', msgY, msgX );
                        }
                    }
                    else
                    {
                        releaseScroll = false;
                    }
                    lastScrollY = percentScrollY;
                    lastScrollX = percentScrollX;

                    // show only when required
                    if( ~~barHeight >= ~~me.outerHeight() )
                    {
                        //allow window scroll
                        releaseScroll = true;
                    }
                    else
                    {
                        bar.stop( true, true ).fadeIn( 'fast' );
                        if ( o.railVisible ) { rail.stop( true, true ).fadeIn( 'fast' ); }
                    }

                    // only if you need a horizontal scroll (small acceleration)
                    if( o.horizontal )
                    {
                        if( ~~barWidth >= ~~me.outerWidth() )
                        {
                            //allow window scroll
                            releaseScroll = true;
                        }
                        else
                        {
                            barH.stop( true, true ).fadeIn( 'fast' );
                            if ( o.railVisible ) { railH.stop( true, true ).fadeIn( 'fast' ); }
                        }
                    }
                }

                function hideBar()
                {
                    // only hide when options allow it
                    if ( !o.alwaysVisible )
                    {
                        queueHide = setTimeout( function() {
                            if ( !( o.disableFadeOut && isOverPanel ) && !isOverBar && !isDragg )
                            {
                                bar.fadeOut( 'slow' );
                                rail.fadeOut( 'slow' );

                                // only if you need a horizontal scroll (small acceleration)
                                if ( o.horizontal )
                                {
                                    barH.fadeOut( 'slow' );
                                    railH.fadeOut( 'slow' );
                                }
                            }
                        }, 1000 );
                    }
                }

            });

            // maintain chainability
            return this;
        }
    });

    $.fn.extend({
        slimscroll: $.fn.slimScroll
    });

})(jQuery);
