/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 0.3.0
 * 
 */
(function($) {

	jQuery.fn.extend({
		slimScroll: function(o) {

			var ops = o;
			//do it for every element that matches selector
			this.each(function(){

			var isOverPanel, isOverBar, isDragg, queueHide, barHeight,
				divS = '<div></div>',
				minBarHeight = 30,
				releaseScroll = false,
				o = ops || {},
				wheelStep = parseInt(o.wheelStep) || 20,
				cwidth = o.width || 'auto',
				cheight = o.height || '250px',
				size = o.size || '7px',
				color = o.color || '#000',
				position = o.position || 'right',
				distance = o.distance || '1px',
				start = o.start || 'top',
				opacity = o.opacity || .4,
				alwaysVisible = o.alwaysVisible === true,
				railVisible = o.railVisible || false,
				railColor = o.railColor || '#333',
				railOpacity = o.railOpacity || 0.2;
			
				//used in event handlers and for better minification
				var me = $(this);

				//wrap content
				var wrapper = $(divS).css({
					position: 'relative',
					overflow: 'hidden',
					width: cwidth,
					height: cheight
				}).attr({ 'class': 'slimScrollDiv' });

				//update style for the div
				me.css({
					overflow: 'hidden',
					width: cwidth,
					height: cheight
				});

				//create scrollbar rail
				var rail  = $(divS).css({
					width: size,
					height: '100%',
					position: 'absolute',
					top: 0,
					display: (alwaysVisible && railVisible) ? 'block' : 'none',
					'border-radius': size,
					background: railColor,
					opacity: railOpacity,
					zIndex: 90
				});

				//create scrollbar
				var bar = $(divS).attr({ 
					'class': 'slimScrollBar ', 
					style: 'border-radius: ' + size 
					}).css({
						background: color,
						width: size,
						position: 'absolute',
						top: 0,
						opacity: opacity,
						display: alwaysVisible ? 'block' : 'none',
						BorderRadius: size,
						MozBorderRadius: size,
						WebkitBorderRadius: size,
						zIndex: 99
				});

				//set position
				var posCss = (position == 'right') ? { right: distance } : { left: distance };
				rail.css(posCss);
				bar.css(posCss);

				//wrap it
				me.wrap(wrapper);

				//append to parent div
				me.parent().append(bar);
				me.parent().append(rail);

				//make it draggable
				bar.draggable({ 
					axis: 'y', 
					containment: 'parent',
					start: function() { isDragg = true; },
					stop: function() { isDragg = false; hideBar(); },
					drag: function(e) 
					{ 
						//scroll content
						scrollContent(0, $(this).position().top, false);
					}
				});

				//on rail over
				rail.hover(function(){
					showBar();
				}, function(){
					hideBar();
				});

				//on bar over
				bar.hover(function(){
					isOverBar = true;
				}, function(){
					isOverBar = false;
				});

				//show on parent mouseover
				me.hover(function(){
					isOverPanel = true;
					showBar();
					hideBar();
				}, function(){
					isOverPanel = false;
					hideBar();
				});

				var _onWheel = function(e)
				{
					//use mouse wheel only when mouse is over
					if (!isOverPanel) { return; }

					var e = e || window.event;

					var delta = 0;
					if (e.wheelDelta) { delta = -e.wheelDelta/120; }
					if (e.detail) { delta = e.detail / 3; }

					//scroll content
					scrollContent(delta, true);

					//stop window scroll
					if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
					if (!releaseScroll) { e.returnValue = false; }
				}

				var scrollContent = function(y, isWheel, isJump)
				{
					var delta = y;

					if (isWheel)
					{
						//move bar with mouse wheel
						delta = bar.position().top + y * wheelStep;

						//move bar, make sure it doesn't go out
						delta = Math.max(delta, 0);
						var maxTop = me.outerHeight() - bar.outerHeight();
						delta = Math.min(delta, maxTop);

						//scroll the scrollbar
						bar.css({ top: delta + 'px' });
					}

					//calculate actual scroll amount
					var percentScroll = parseInt(bar.position().top) / (me.outerHeight() - bar.outerHeight());
					delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

					if (isJump)
					{
						delta = y;
						var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
						bar.css({ top: offsetTop + 'px' });
					}

					//scroll content
					me.scrollTop(delta);

					//ensure bar is visible
					showBar();
				}

				var attachWheel = function()
				{
					if (window.addEventListener)
					{
						this.addEventListener('DOMMouseScroll', _onWheel, false );
						this.addEventListener('mousewheel', _onWheel, false );
					} 
					else
					{
						document.attachEvent("onmousewheel", _onWheel)
					}
				}

				//attach scroll events
				attachWheel();

				var getBarHeight = function()
				{
					//calculate scrollbar height and make sure it is not too small
					barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
					bar.css({ height: barHeight + 'px' });
				}

				//set up initial height
				getBarHeight();

				var showBar = function()
				{
					//recalculate bar height
					getBarHeight();
					clearTimeout(queueHide);
					
					//show only when required
					if(barHeight >= me.outerHeight()) {
						//allow window scroll
						releaseScroll = true;
						return;
					}
					bar.fadeIn('fast');
					if (railVisible) { rail.fadeIn('fast'); }
				}

				var hideBar = function()
				{
					//only hide when options allow it
					if (!alwaysVisible)
					{
						queueHide = setTimeout(function(){
							if (!isOverBar && !isDragg) 
							{ 
								bar.fadeOut('slow');
								rail.fadeOut('slow');
							}
						}, 1000);
					}
				}

				//check start position
				if (start == 'bottom') 
				{
					//scroll content to bottom
					bar.css({ top: 'auto', bottom: 0 });
					scrollContent(0, true);
				}
				else if (typeof start == 'object')
				{
					//scroll content
					scrollContent($(start).position().top, null, true);

					//make sure bar stays hidden
					if (!alwaysVisible) { bar.hide(); }
				}
			});
			
			//maintain chainability
			return this;
		}
	});

	jQuery.fn.extend({
		slimscroll: jQuery.fn.slimScroll
	});

})(jQuery);