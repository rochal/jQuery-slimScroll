/*! Copyright (c) 2011 Piotr Rochala (http://rochala.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 0.0.1
 * 
 */
(function($) {

	jQuery.fn.extend({
		slimScroll: function(o) {

			var isOverPanel, isOverBar, isDragg, queueHide,
				divS = '<div></div>';
			
			var o = o || {};
			var size = o.size || '7px';
			var color = o.color || '#000';
			var position = o.position || 'right';
			var opacity = o.opacity || .4;
			
			//used in event handlers and for better minification
			var me = this;
			
			//wrap content
			var wrapper = $(divS).css({
				position: 'relative',
				width: me.width(),
				height: me.height(),
				overflow: 'hidden'
			}).attr({ 'class': 'slimScrollContent' });

			//create scrollbar rail
			var rail  = $(divS).css({
				width: '15px',
				height: '100%',
				position: 'absolute',
				top: 0
			});
				
			//create scrollbar
			var bar = $(divS).css({
				background: color,
				width: size,
				position: 'absolute',
				top: 0,
				opacity: opacity,
				display: 'none',
				MozBorderRadius: size,
				WebkitBorderRadius: size,
				BorderRadius: size,
				zIndex: 99
			}).attr({ 'class': 'slimScrollBar '});

			//set position
			var posCss = (position == 'right') ? { right: 0 } : { left: 0 };
			rail.css(posCss);
			bar.css(posCss);

			//calculate scrollbar height
			var height = (this.height() * this.height()) / this[0].scrollHeight;
			bar.css({ height: height + 'px' });

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
				stop: function() { isDragg = false; },
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
				
				var delta = 0;
				if (e.wheelDelta) { delta = e.wheelDelta/120; }
				if (e.detail) { delta = e.detail / 3; }

				//scroll content
				scrollContent(0, delta, true);
			}
			
			var scrollContent = function(x, y, isWheel)
			{
				var delta = y;
				
				if (isWheel)
				{
					delta = me.scrollTop() + y * 30;
					
					//move bar, make sure it doesn't go out
					delta = delta < 0 ? 0 : delta;
					var maxTop = me.height() - bar.height();
					delta = delta > maxTop ? maxTop : delta;
					bar.css({ top: delta + 'px' });
				} 
				else
				{

				}

				//scroll content
				me.scrollTop(delta);
				
				//ensure bar is visible
				showBar();
			}

			var attachWheel = function()
			{
				if (addEventListener)
				{
					addEventListener('DOMMouseScroll', _onWheel, false );
					addEventListener('mousewheel', _onWheel, false );
				} 
				else
				{
					onmousewheel = _onWheel;
				}
			}

			//attach scroll events
			attachWheel();
			
			var showBar = function()
			{
				clearTimeout(queueHide);
				bar.fadeIn('fast');	
			}

			var hideBar = function()
			{
				queueHide = setTimeout(function(){
					if (!isOverBar && !isDragg) { bar.fadeOut('slow'); }
				}, 1000);
			}
		}
	});

})(jQuery);