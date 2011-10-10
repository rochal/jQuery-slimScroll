/*! Copyright (c) 2011 Piotr Rochala (http://rochala.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 0.0.1
 * 
 */
(function($) {

	jQuery.fn.extend({
		slimScroll: function() {

			var isOverPanel = false;
			var isOverBar = false;
			var isDragg = false;
			var queueHide = null;
			
			//create scrollbar rail
			var rail  = $('<div></div>').css({
				width: '15px',
				height: '100%',
				position: 'absolute',
				top: 0,
				right: 0
			});
			
			//create scrollbar
			var bar = $('<div class="slimScrollBar"></div>').css({
				background: '#000',
				width: '7px',
				position: 'absolute',
				top: 0,
				right: 0,
				opacity: 0.4,
				display: 'none',
				MozBorderRadius: '7px',
				zIndex:99
			});
			
			//calculate scrollbar height
			var height = (this.height() * this.height()) / this[0].scrollHeight;
			bar.css({ height: height + 'px' });

			//update parent position
			this.css({ position: 'relative' });

			//append to parent div
			this.append(bar);
			this.append(rail);
			
			//make it draggable
			bar.draggable({ 
				axis: 'y', 
				containment: 'parent',
				start: function() { isDragg = true; },
				stop: function() { isDragg = false; }
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
			this.hover(function(){
				isOverPanel = true;
				showBar();
				hideBar();
			}, function(){
				isOverPanel = false;
				hideBar();
			});
			
			var t = this;
			var _onWheel = function(e)
			{
				if (!isOverPanel) { return; }
				
				var delta = 0;
				
				if (e.wheelDelta) { delta = e.wheelDelta/120; }
				if (e.detail) { delta = e.detail / 3; }
				var mDelta = delta * 30;
				
				var scroll = t.scrollTop();
				t.scrollTop(scroll + mDelta);
				
				//update bar position
				//bar.css({ top: t.scrollTop() + 'px'});
				
				//ensure bar is visible
				showBar();
			}

			var attachWheel = function()
			{
				if (this.addEventListener)
				{
					this.addEventListener('DOMMouseScroll', _onWheel, false );
					this.addEventListener('mousewheel', _onWheel, false );
				} 
				else
				{
					this.onmousewheel = _onWheel;
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

